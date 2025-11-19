import "server-only";

import { toUnifiedTokenData, setManyUnifiedTokens } from "./unified-token-cache";

import { getStaleWhileRevalidate } from "@/lib/cache/swr-cache";
import { cacheKeys, CACHE_TTL } from "@/lib/cache";
import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { loggers } from "@/lib/utils/logger";

interface BirdeyeTrendingToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoURI?: string;
  liquidity?: number;
  volume24hUSD?: number;
  volume24hChangePercent?: number | null;
  price?: number;
  price24hChangePercent?: number;
  marketcap?: number;
  fdv?: number;
  rank?: number;
}

interface BirdeyeTrendingResponse {
  data: {
    tokens: BirdeyeTrendingToken[];
  };
  success: boolean;
}

export interface TrendingToken {
  item: {
    id: string;
    coin_id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: {
        usd: number;
      };
      market_cap: string;
      market_cap_btc: string;
      total_volume: string;
      total_volume_btc: string;
      sparkline: string;
      content: {
        title: string;
        description: string;
      };
      volume_24h_usd?: number;
      marketcap?: number;
    };
  };
}

export interface TrendingData {
  tokens: TrendingToken[];
}

/**
 * Transform Birdeye trending tokens to expected format
 */
function transformTrendingTokens(tokens: BirdeyeTrendingToken[]): TrendingData {
  const transformedCoins = tokens.map((token, index) => ({
    item: {
      id: token.address,
      coin_id: token.address,
      name: token.name,
      symbol: token.symbol,
      market_cap_rank: token.rank || index + 1,
      thumb: token.logoURI || "",
      small: token.logoURI || "",
      large: token.logoURI || "",
      slug: token.symbol.toLowerCase(),
      price_btc: 0,
      score: 0,
      data: {
        price: token.price || 0,
        price_btc: "0",
        price_change_percentage_24h: {
          usd: token.price24hChangePercent || 0,
        },
        market_cap: `$${(token.marketcap || 0).toLocaleString()}`,
        market_cap_btc: "0",
        total_volume: `$${(token.volume24hUSD || 0).toLocaleString()}`,
        total_volume_btc: "0",
        sparkline: "",
        content: {
          title: token.name,
          description: `${token.name} (${token.symbol}) is trending on Solana by 24h volume`,
        },
        volume_24h_usd: token.volume24hUSD || 0,
        marketcap: token.marketcap || 0,
      },
    },
  }));

  return {
    tokens: transformedCoins,
  };
}

/**
 * Cache individual trending tokens in unified cache
 * Runs async in background
 */
async function cacheIndividualTrendingTokens(tokens: BirdeyeTrendingToken[]): Promise<void> {
  try {
    const startTime = performance.now();

    const batchData = tokens.map((token) => ({
      address: token.address,
      data: toUnifiedTokenData(token, "list"),
    }));

    await setManyUnifiedTokens(batchData, CACHE_TTL.TRENDING);

    const duration = performance.now() - startTime;

    loggers.cache.debug(`✓ Cached ${tokens.length} individual trending tokens in ${duration.toFixed(0)}ms (batched)`);
  } catch (error) {
    loggers.cache.error("Failed to cache individual trending tokens:", error);
  }
}

// ===================================================================
// MAIN DATA FETCHING FUNCTIONS
// ===================================================================

/**
 * Fetch fresh trending tokens from Birdeye API
 */
async function fetchFreshTrendingData(limit: number): Promise<TrendingData> {
  const perfStart = performance.now();

  try {
    const response = await fetchBirdeyeData<BirdeyeTrendingResponse>("/defi/token_trending", {
      offset: "0",
      limit: limit.toString(),
    });

    if (!response.success || !response.data?.tokens || response.data.tokens.length === 0) {
      loggers.data.warn("No trending tokens from Birdeye API - returning empty data");

      return { tokens: [] };
    }

    const tokens = response.data.tokens;
    const transformedData = transformTrendingTokens(tokens);

    // Cache individual tokens in background
    cacheIndividualTrendingTokens(tokens).catch((err) => {
      loggers.cache.error("Failed to cache individual trending tokens:", err);
    });

    const duration = performance.now() - perfStart;

    loggers.data.debug(`✓ Fetched ${tokens.length} trending tokens in ${duration.toFixed(0)}ms`);

    return transformedData;
  } catch (error) {
    loggers.data.error("Error fetching trending data from Birdeye:", error);

    return { tokens: [] };
  }
}

/**
 * Internal implementation of trending data fetching
 */
async function fetchTrendingDataInternal(limit: number): Promise<TrendingData> {
  const cacheKey = cacheKeys.trending(limit);

  const result = await getStaleWhileRevalidate<TrendingData>(cacheKey, CACHE_TTL.TRENDING, () => fetchFreshTrendingData(limit));

  return result || { tokens: [] };
}

/**
 * Fetch trending tokens
 *
 * @param limit - Number of trending tokens to fetch
 * @returns Trending tokens data
 */
export async function fetchTrendingData(limit: number): Promise<TrendingData> {
  return fetchTrendingDataInternal(limit);
}
