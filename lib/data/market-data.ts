import "server-only";

import { setUnifiedToken, toUnifiedTokenData } from "./unified-token-cache";

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
 * Normalizes data structure and handles missing values
 */
function transformBirdeyeToken(token: BirdeyeToken): Token {
  return {
    id: token.address,
    name: token.name === "Wrapped SOL" ? "Solana" : token.name,
    symbol: token.symbol.toUpperCase(),
    logoURI: token.logo_uri ?? "/logo.svg",
    price: "", // Will be formatted by caller based on currency preference
    change: token.price_change_24h_percent || 0,
    volume: "", // Will be formatted by caller
    rawVolume: token.volume_24h_usd || 0,
    fdv: token.fdv || 0,
    marketCap: token.market_cap || 0,
    rawPrice: token.price || 0,
  };
}

/**
 * Filter out spam/dead tokens based on market cap threshold
 */
function filterViableTokens(tokens: Token[]): Token[] {
  return tokens.filter((token) => token.marketCap && token.marketCap > MARKET_CAP_FILTERS.MIN_VIABLE);
}

/**
 * Cache individual tokens asynchronously for detail page performance
 * This ONLY caches basic list data (price, volume, market cap)
 * Full token overview data is fetched ON-DEMAND when user visits token detail page
 *
 * This prevents 200+ unnecessary API calls to /defi/token_overview
 * Uses chunking to avoid overwhelming Redis with parallel writes
 */
function cacheIndividualTokensAsync(tokens: BirdeyeToken[]): void {
  // Fire and forget - don't block the response
  (async () => {
    try {
      for (let i = 0; i < tokens.length; i += BIRDEYE_LIMITS.BATCH_SIZE) {
        const chunk = tokens.slice(i, i + BIRDEYE_LIMITS.BATCH_SIZE);

        await Promise.all(chunk.map((token) => setUnifiedToken(token.address, toUnifiedTokenData(token, "list"), CACHE_TTL.TOKEN_DETAIL)));
      }

      loggers.cache.debug(`✓ Cached ${tokens.length} individual tokens (async)`);
    } catch (error) {
      loggers.cache.error("Failed to cache individual tokens:", error);
    }
  })();
}

/**
 * Fetch market data from Birdeye API with Redis caching
 * This function can be called from both server components and API routes
 * The API key is protected as this only runs on the server
 *
 * Caching strategy:
 * - Cache key includes limit and offset for pagination support
 * - TTL: 2 minutes (market data changes frequently)
 * - Shared cache between server components and API routes
 * - Returns both token data and calculated stats
 *
 * @param limit - Number of tokens to fetch
 * @param offset - Pagination offset
 * @param customQueryParams - Optional custom query params (e.g., for filtering newly listed tokens)
 * @param cacheKey - Optional custom cache key (if not provided, auto-generated from params)
 */
export async function fetchMarketData(
  limit: number = 100,
  offset: number = 0,
  customQueryParams?: Record<string, string>,
  cacheKey?: string
): Promise<MarketDataResult> {
  // Use provided cache key or generate one based on params
  const finalCacheKey =
    cacheKey ||
    (customQueryParams ? `market:${limit}:${offset}:${JSON.stringify(customQueryParams)}` : cacheKeys.marketData(limit, offset));

  try {
    // Try Redis cache first
    const cachedData = await redis.get<MarketDataResult>(finalCacheKey);

    if (cachedData) {
      loggers.cache.debug(`HIT: ${finalCacheKey}`);

      return cachedData;
    }

    loggers.cache.debug(`MISS: Fetching ${limit} tokens from Birdeye (offset: ${offset})`);

    // Use custom query params if provided, otherwise use default
    const queryParam = customQueryParams || BIRDEYE_QUERY_PRESETS.DEFAULT;

    let allItems: BirdeyeToken[] = [];

    if (limit <= BIRDEYE_LIMITS.MAX_PER_REQUEST) {
      // Single request for 100 or fewer tokens
      const response = await fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
        offset: offset.toString(),
        limit: limit.toString(),
        ...queryParam,
      });

      if (!response.success || !response.data?.items) {
        loggers.data.warn("Invalid response from Birdeye API");

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

      allItems = response.data.items;
    } else {
      // Multiple parallel requests for more than 100 tokens
      const numRequests = Math.ceil(limit / BIRDEYE_LIMITS.MAX_PER_REQUEST);
      const requests = [];

      for (let i = 0; i < numRequests; i++) {
        const batchOffset = offset + i * BIRDEYE_LIMITS.MAX_PER_REQUEST;
        const batchLimit = Math.min(BIRDEYE_LIMITS.MAX_PER_REQUEST, limit - i * BIRDEYE_LIMITS.MAX_PER_REQUEST);

        requests.push(
          fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
            offset: batchOffset.toString(),
            limit: batchLimit.toString(),
            ...queryParam,
          })
        );
      }

      const responses = await Promise.all(requests);

      // Combine all results
      for (const response of responses) {
        if (response.success && response.data?.items) {
          allItems.push(...response.data.items);
        }
      }
    }

    if (allItems.length === 0) {
      loggers.data.warn("No tokens returned from Birdeye API");

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

    // Transform and filter tokens
    const transformedTokens = allItems.map(transformBirdeyeToken);
    const filteredTokens = filterViableTokens(transformedTokens);

    // Calculate global stats from filtered token data
    const totalMarketCap = filteredTokens.reduce((sum, t) => sum + (t.marketCap || 0), 0);
    const totalVolume = filteredTokens.reduce((sum, t) => sum + (t.rawVolume || 0), 0);
    const totalFDV = filteredTokens.reduce((sum, t) => sum + (t.fdv || 0), 0);
    // TODO: Implement weighted market cap change calculation
    const marketCapChange = 0;

    const result: MarketDataResult = {
      data: filteredTokens,
      stats: {
        totalMarketCap,
        totalVolume,
        totalFDV,
        marketCapChange,
      },
    };

    // Cache the result (blocks response - quick operation)
    redis.set(finalCacheKey, result, CACHE_TTL.MARKET_DATA).catch((err) => {
      loggers.cache.error(`Market data cache failed: ${err.message}`);
    });

    // Cache individual tokens asynchronously (doesn't block response)
    cacheIndividualTokensAsync(allItems);

    loggers.cache.debug(`✓ Returning ${filteredTokens.length}/${transformedTokens.length} tokens with stats (caching in background)`);

    return result;
  } catch (error) {
    loggers.data.error("Error fetching market data:", error);

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
}
