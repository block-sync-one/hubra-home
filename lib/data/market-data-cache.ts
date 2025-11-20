import "server-only";

/**
 * Market Data Caching Layer
 *
 * Handles all caching operations for market data:
 * - Complete market data results (with stats)
 * - Individual token data (via unified cache)
 * - Cache freshness validation
 */

import { cacheKeys } from "@/lib/cache";

export interface MarketDataStats {
  totalFDV: number;
  totalFDVChange: number;
  totalVolume: number;
  solFDV: number;
}

export interface MarketDataResult {
  data: any[];
  stats: MarketDataStats;
}

/**
 * Generate cache key for market data
 */
export function getMarketDataCacheKey(limit: number, offset: number, customQueryParams?: Record<string, string>): string {
  if (customQueryParams) {
    return `market:${limit}:${offset}:${JSON.stringify(customQueryParams)}`;
  }

  return cacheKeys.marketData(limit, offset);
}
