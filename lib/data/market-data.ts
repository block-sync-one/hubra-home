import "server-only";

/**
 * Optimized Token Loader
 * Implements batched Redis lookups with fallback to API
 *
 * STRATEGY:
 * 1. Check Redis for complete market data cache → Return if found
 * 2. If market cache miss, batch check individual token caches using MGET
 * 3. Fetch only missing tokens from API in batch
 * 4. Merge cached + fresh data
 * 5. Update caches in batch using MSET
 */

import { getManyUnifiedTokens, setManyUnifiedTokens, toUnifiedTokenData, UnifiedTokenData } from "./unified-token-cache";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { Token } from "@/lib/types/token";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";
import { BIRDEYE_LIMITS, BIRDEYE_QUERY_PRESETS, MARKET_CAP_FILTERS } from "@/lib/constants/market";

export interface MarketDataStats {
  totalMarketCap: number;
  totalVolume: number;
  totalFDV: number;
  marketCapChange: number;
}

export interface MarketDataResult {
  data: Token[];
  stats: MarketDataStats;
}

interface BirdeyeToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo_uri?: string;
  liquidity?: number;
  fdv?: number;
  volume_24h_usd?: number;
  volume_24h_change_percent?: number;
  price?: number;
  price_change_24h_percent?: number;
  market_cap?: number;
  holder?: number;
}

interface BirdeyeTokenListResponse {
  data: {
    items: BirdeyeToken[];
  };
  success: boolean;
}

/**
 * Transform Birdeye API token to our internal Token type
 */
function transformBirdeyeToken(token: BirdeyeToken): Token {
  return {
    id: token.address,
    name: token.name === "Wrapped SOL" ? "Solana" : token.name,
    symbol: token.symbol.toUpperCase(),
    logoURI: token.logo_uri ?? "/logo.svg",
    price: "",
    change: token.price_change_24h_percent || 0,
    volume: "",
    rawVolume: token.volume_24h_usd || 0,
    fdv: token.fdv || 0,
    marketCap: token.market_cap || 0,
    rawPrice: token.price || 0,
  };
}

/**
 * Transform UnifiedTokenData to Token type
 */
function unifiedToToken(unified: UnifiedTokenData): Token {
  return {
    id: unified.address,
    name: unified.name,
    symbol: unified.symbol,
    logoURI: unified.logoURI,
    price: "",
    change: unified.priceChange24hPercent,
    volume: "",
    rawVolume: unified.v24hUSD,
    fdv: unified.fdv || 0,
    marketCap: unified.marketCap,
    rawPrice: unified.price,
  };
}

/**
 * Filter out spam/dead tokens based on market cap threshold
 */
function filterViableTokens(tokens: Token[]): Token[] {
  return tokens.filter((token) => token.marketCap && token.marketCap > MARKET_CAP_FILTERS.MIN_VIABLE);
}

/**
 * Calculate market stats from token data
 */
function calculateMarketStats(tokens: Token[]): MarketDataStats {
  const totalMarketCap = tokens.reduce((sum, t) => sum + (t.marketCap || 0), 0);
  const totalVolume = tokens.reduce((sum, t) => sum + (t.rawVolume || 0), 0);
  const totalFDV = tokens.reduce((sum, t) => sum + (t.fdv || 0), 0);

  return {
    totalMarketCap,
    totalVolume,
    totalFDV,
    marketCapChange: 0, // TODO: Implement weighted calculation
  };
}

/**
 * Fetch tokens from API in batches
 */
async function fetchFromAPI(limit: number, offset: number, queryParams: Record<string, string>): Promise<BirdeyeToken[]> {
  const allItems: BirdeyeToken[] = [];

  if (limit <= BIRDEYE_LIMITS.MAX_PER_REQUEST) {
    // Single request
    const response = await fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
      offset: offset.toString(),
      limit: limit.toString(),
      ...queryParams,
    });

    if (response.success && response.data?.items) {
      allItems.push(...response.data.items);
    }
  } else {
    // Multiple parallel requests
    const numRequests = Math.ceil(limit / BIRDEYE_LIMITS.MAX_PER_REQUEST);
    const requests = [];

    for (let i = 0; i < numRequests; i++) {
      const batchOffset = offset + i * BIRDEYE_LIMITS.MAX_PER_REQUEST;
      const batchLimit = Math.min(BIRDEYE_LIMITS.MAX_PER_REQUEST, limit - i * BIRDEYE_LIMITS.MAX_PER_REQUEST);

      requests.push(
        fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
          offset: batchOffset.toString(),
          limit: batchLimit.toString(),
          ...queryParams,
        })
      );
    }

    const responses = await Promise.all(requests);

    for (const response of responses) {
      if (response.success && response.data?.items) {
        allItems.push(...response.data.items);
      }
    }
  }

  return allItems;
}

/**
 * Optimized market data fetcher with batched Redis operations
 *
 * OPTIMIZATION LEVELS:
 * Level 1: Complete market data cache hit (fastest)
 * Level 2: Partial individual token cache hits + API for missing tokens (optimized)
 * Level 3: Complete API fetch + batch cache (fallback)
 */
export async function fetchMarketData(
  limit: number = 100,
  offset: number = 0,
  customQueryParams?: Record<string, string>,
  cacheKey?: string
): Promise<MarketDataResult> {
  const perfStart = performance.now();
  const finalCacheKey =
    cacheKey ||
    (customQueryParams ? `market:${limit}:${offset}:${JSON.stringify(customQueryParams)}` : cacheKeys.marketData(limit, offset));

  try {
    // LEVEL 1: Check for complete cached market data
    const cachedMarketData = await redis.get<MarketDataResult>(finalCacheKey);

    if (cachedMarketData) {
      const duration = performance.now() - perfStart;

      loggers.cache.debug(`✓ HIT: Complete market data (${duration.toFixed(0)}ms)`);

      return cachedMarketData;
    }

    loggers.cache.debug(`MISS: Market data cache - checking individual token caches...`);

    // LEVEL 2: Try to reconstruct from individual cached tokens
    // This is useful when market cache expires but individual tokens are still cached
    const queryParam = customQueryParams || BIRDEYE_QUERY_PRESETS.DEFAULT;

    // First, fetch from API to get the list of addresses in the correct order
    // We need this because we don't know which tokens should be included
    const apiTokens = await fetchFromAPI(limit, offset, queryParam);

    if (apiTokens.length === 0) {
      loggers.data.warn("No tokens from API");

      return createEmptyResult();
    }

    const addresses = apiTokens.map((t) => t.address);

    // Batch check individual token caches using MGET
    const batchStart = performance.now();
    const cachedTokensMap = await getManyUnifiedTokens(addresses);
    const batchDuration = performance.now() - batchStart;

    // Identify which tokens we have cached vs need to fetch
    const cachedCount = Array.from(cachedTokensMap.values()).filter((t) => t !== null).length;
    const missingCount = addresses.length - cachedCount;

    loggers.cache.debug(
      `Batch lookup: ${cachedCount}/${addresses.length} tokens cached (${batchDuration.toFixed(0)}ms) ` + `[${missingCount} need refresh]`
    );

    // Convert cached tokens to Token type
    const tokens: Token[] = [];
    const tokensToCache: Array<{ address: string; data: UnifiedTokenData }> = [];

    for (const apiToken of apiTokens) {
      const cached = cachedTokensMap.get(apiToken.address);

      if (cached && isCacheStillFresh(cached)) {
        // Use cached data
        tokens.push(unifiedToToken(cached));
      } else {
        // Use fresh API data
        const token = transformBirdeyeToken(apiToken);

        tokens.push(token);

        // Prepare for batch caching
        tokensToCache.push({
          address: apiToken.address,
          data: toUnifiedTokenData(apiToken, "list"),
        });
      }
    }

    // Batch cache fresh tokens
    if (tokensToCache.length > 0) {
      // Fire and forget - don't block response
      setManyUnifiedTokens(tokensToCache, CACHE_TTL.TOKEN_DETAIL).catch((err) => {
        loggers.cache.error(`Failed to batch cache ${tokensToCache.length} tokens:`, err);
      });
    }

    // Filter and calculate stats
    const filteredTokens = filterViableTokens(tokens);
    const stats = calculateMarketStats(filteredTokens);

    const result: MarketDataResult = {
      data: filteredTokens,
      stats,
    };

    // Cache the complete market data (non-blocking)
    redis.set(finalCacheKey, result, CACHE_TTL.MARKET_DATA).catch((err) => {
      loggers.cache.error(`Market data cache write failed:`, err);
    });

    const totalDuration = performance.now() - perfStart;

    loggers.cache.debug(
      `✓ Optimized fetch: ${filteredTokens.length} tokens in ${totalDuration.toFixed(0)}ms ` +
        `(${cachedCount} from cache, ${tokensToCache.length} fresh)`
    );

    return result;
  } catch (error) {
    loggers.data.error("Error in optimized market data fetch:", error);

    return createEmptyResult();
  }
}

/**
 * Check if cached data is still fresh enough to use
 * This prevents using stale data even if it's still in cache
 */
function isCacheStillFresh(cached: UnifiedTokenData): boolean {
  const MAX_AGE_MS = CACHE_TTL.TOKEN_DETAIL * 1000; // Convert seconds to ms
  const age = Date.now() - cached.lastUpdated;

  return age < MAX_AGE_MS;
}

/**
 * Create empty result structure
 */
function createEmptyResult(): MarketDataResult {
  return {
    data: [],
    stats: {
      totalMarketCap: 0,
      totalVolume: 0,
      totalFDV: 0,
      marketCapChange: 0,
    },
  };
}
