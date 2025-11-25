import "server-only";

import { fetchStablecoinData } from "./stablecoin-data";

import { getStaleWhileRevalidate } from "@/lib/cache/swr-cache";
import { cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

// ===================================================================
// TYPES
// ===================================================================

export interface GlobalStats {
  stablecoins_tvl: number;
  stablecoins_tvl_change: number;
  updated_at: number;
}

// ===================================================================
// MAIN DATA FETCHING FUNCTIONS
// ===================================================================

/**
 * Fetch fresh global statistics
 */
async function fetchFreshGlobalStats(): Promise<GlobalStats> {
  const perfStart = performance.now();

  try {
    const stablecoinData = await fetchStablecoinData().catch((err) => {
      loggers.data.error("Stablecoin fetch failed:", err);

      return { totalCirculatingUSD: 0, change24h: 0 };
    });

    const duration = performance.now() - perfStart;

    loggers.data.debug(`✓ Fetched global stats in ${duration.toFixed(0)}ms`);

    return {
      stablecoins_tvl: stablecoinData.totalCirculatingUSD,
      stablecoins_tvl_change: stablecoinData.change24h,
      updated_at: Math.floor(Date.now() / 1000),
    };
  } catch (error) {
    loggers.data.error("Error fetching global stats:", error);

    return {
      stablecoins_tvl: 0,
      stablecoins_tvl_change: 0,
      updated_at: Math.floor(Date.now() / 1000),
    };
  }
}

/**
 * Internal implementation of global stats fetching
 */
async function fetchGlobalStatsInternal(): Promise<GlobalStats> {
  const cacheKey = cacheKeys.globalStats();

  const result = await getStaleWhileRevalidate<GlobalStats>(cacheKey, CACHE_TTL.GLOBAL_STATS, () => fetchFreshGlobalStats());

  return (
    result || {
      stablecoins_tvl: 0,
      stablecoins_tvl_change: 0,
      updated_at: Math.floor(Date.now() / 1000),
    }
  );
}

/**
 * Fetch global statistics
 *
 * @returns Global statistics including stablecoin TVL
 */
export async function fetchGlobalStats(): Promise<GlobalStats> {
  return fetchGlobalStatsInternal();
}
