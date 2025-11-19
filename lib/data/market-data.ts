import "server-only";

/**
 * Market Data Fetching & Processing
 */

import { toUnifiedTokenData, UnifiedTokenData } from "./unified-token-cache";
import { getMarketDataCacheKey, MarketDataResult } from "./market-data-cache";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { Token } from "@/lib/types/token";
import { loggers } from "@/lib/utils/logger";
import { BIRDEYE_LIMITS, BIRDEYE_QUERY_PRESETS, MARKET_CAP_FILTERS } from "@/lib/constants/market";
import { getStaleWhileRevalidate, CACHE_TTL, cacheKeys } from "@/lib/cache";

export type { MarketDataStats, MarketDataResult } from "./market-data-cache";

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
 * Filter out spam/dead tokens based on market cap threshold
 */
function filterViableTokens(tokens: Token[]): Token[] {
  return tokens.filter((token) => token.marketCap && token.marketCap > MARKET_CAP_FILTERS.MIN_VIABLE);
}

/**
 * Calculate aggregate market statistics
 */
function calculateMarketStats(tokens: Token[]) {
  const totalFDV = tokens.reduce((sum, t) => sum + (t.fdv || 0), 0);
  const totalVolume = tokens.reduce((sum, t) => sum + (t.rawVolume || 0), 0);
  const solFDV = tokens.find((t) => "solana" === t.name.toLowerCase())?.fdv ?? 0;

  return {
    totalFDV,
    totalFDVChange: 0, // TODO: Implement weighted calculation
    totalVolume,
    solFDV,
  };
}

/**
 * Create empty result structure
 */
function buildEmptyMarketData() {
  return {
    data: [],
    stats: {
      totalFDV: 0,
      totalVolume: 0,
      solFDV: 0,
      totalFDVChange: 0,
    },
  };
}

/**
 * Fetch single page of tokens from Birdeye API
 */
async function fetchTokenPage(offset: number, limit: number, queryParams: Record<string, string>): Promise<BirdeyeToken[]> {
  const response = await fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
    offset: offset.toString(),
    limit: limit.toString(),
    ...queryParams,
  });

  return response.success && response.data?.items ? response.data.items : [];
}

/**
 * Fetch tokens from API with automatic batching for large requests
 */
async function fetchTokensFromAPI(limit: number, offset: number, queryParams: Record<string, string>): Promise<BirdeyeToken[]> {
  // Single request for small limits
  if (limit <= BIRDEYE_LIMITS.MAX_PER_REQUEST) {
    return fetchTokenPage(offset, limit, queryParams);
  }

  // Batch multiple requests for large limits
  const numRequests = Math.ceil(limit / BIRDEYE_LIMITS.MAX_PER_REQUEST);
  const requests = Array.from({ length: numRequests }, (_, i) => {
    const batchOffset = offset + i * BIRDEYE_LIMITS.MAX_PER_REQUEST;
    const batchLimit = Math.min(BIRDEYE_LIMITS.MAX_PER_REQUEST, limit - i * BIRDEYE_LIMITS.MAX_PER_REQUEST);

    return fetchTokenPage(batchOffset, batchLimit, queryParams);
  });

  const responses = await Promise.all(requests);

  return responses.flat();
}

/**
 * Process tokens by merging cached and fresh API data
 */
function processTokens(apiTokens: BirdeyeToken[]): { tokens: Token[]; tokensToCache: Array<{ address: string; data: UnifiedTokenData }> } {
  const tokens: Token[] = [];
  const tokensToCache: Array<{ address: string; data: UnifiedTokenData }> = [];

  for (const apiToken of apiTokens) {
    const token = transformBirdeyeToken(apiToken);

    tokens.push(token);
    tokensToCache.push({
      address: apiToken.address,
      data: toUnifiedTokenData(apiToken, "list"),
    });
  }

  return { tokens, tokensToCache };
}

/**
 * Fetch fresh market data from API
 * All caching is handled centrally by getStaleWhileRevalidate
 */
async function fetchFreshMarketData(
  limit: number,
  offset: number,
  queryParams: Record<string, string>
): Promise<MarketDataResult & { _tokens?: any[] }> {
  const apiTokens = await fetchTokensFromAPI(limit, offset, queryParams);

  if (apiTokens.length === 0) {
    throw new Error("No tokens returned from API");
  }

  const { tokens, tokensToCache } = processTokens(apiTokens);

  // Filter and calculate stats
  const filteredTokens = filterViableTokens(tokens);
  const stats = calculateMarketStats(filteredTokens);

  // Return data with internal metadata for batch caching
  return {
    data: filteredTokens,
    stats,
    _tokens: tokensToCache, // Internal: used by SWR for batch caching
  };
}

/**
 * Fetch market data with stale-while-revalidate pattern
 *
 * Returns cached data instantly (even if stale), refreshes in background if needed.
 *
 * @param limit - Number of tokens to fetch
 * @param offset - Offset for pagination
 * @param customQueryParams - Custom query parameters for Birdeye API
 * @param cacheKey - Optional custom cache key
 * @returns Market data result with tokens and aggregate stats
 */
/**
 * Internal implementation of market data fetching
 */
async function fetchMarketDataInternal(
  limit: number = 100,
  offset: number = 0,
  customQueryParams?: Record<string, string>,
  cacheKey?: string
): Promise<MarketDataResult> {
  const perfStart = performance.now();
  const finalCacheKey = cacheKey || getMarketDataCacheKey(limit, offset, customQueryParams);
  const queryParams = customQueryParams || BIRDEYE_QUERY_PRESETS.DEFAULT;

  try {
    // Use centralized SWR with batch caching
    // SWR handles ALL caching (main result + individual tokens)
    const result = await getStaleWhileRevalidate<MarketDataResult & { _tokens?: any[] }>(
      finalCacheKey,
      CACHE_TTL.MARKET_DATA,
      () => fetchFreshMarketData(limit, offset, queryParams),
      {
        // Configure batch caching for individual tokens
        batchCache: {
          extractItems: (result) => result._tokens || [],
          getItemKey: (item) => cacheKeys.tokenDetail(item.address),
          transformItem: (item) => item.data,
          itemTtl: CACHE_TTL.TOKEN_DETAIL,
        },
      }
    );

    const totalDuration = performance.now() - perfStart;

    loggers.cache.debug(`✓ Market data: ${result?.data.length || 0} tokens in ${totalDuration.toFixed(0)}ms`);

    // Clean internal metadata before returning
    if (result) {
      const { _tokens, ...cleanResult } = result as any;

      return cleanResult as MarketDataResult;
    }

    return buildEmptyMarketData();
  } catch (error) {
    loggers.data.error("Error fetching market data:", error);

    return buildEmptyMarketData();
  }
}

/**
 * Fetch market data
 *
 * @param limit - Number of tokens to fetch
 * @param offset - Offset for pagination
 * @param customQueryParams - Custom query parameters
 * @param cacheKey - Optional custom cache key
 * @returns Market data with stats and tokens
 */
export async function fetchMarketData(
  limit: number = 100,
  offset: number = 0,
  customQueryParams?: Record<string, string>,
  cacheKey?: string
): Promise<MarketDataResult> {
  return fetchMarketDataInternal(limit, offset, customQueryParams, cacheKey);
}
