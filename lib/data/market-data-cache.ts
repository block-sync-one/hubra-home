import "server-only";

/**
 * Market Data Caching Layer
 *
 * Handles all caching operations for market data:
 * - Complete market data results (with stats)
 * - Individual token data (via unified cache)
 * - Cache freshness validation
 */

import { getManyUnifiedTokens, setManyUnifiedTokens, UnifiedTokenData } from "./unified-token-cache";

import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

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

/**
 * Get cached complete market data (includes stats)
 */
export async function getCachedMarketData(cacheKey: string): Promise<MarketDataResult | null> {
  try {
    const cached = await redis.get<MarketDataResult>(cacheKey);

    if (cached) {
      return cached;
    }

    loggers.cache.debug(`MISS: Market data cache`);

    return null;
  } catch (error) {
    loggers.cache.error("Failed to get cached market data:", error);

    return null;
  }
}

/**
 * Cache complete market data (non-blocking)
 */
export async function setCachedMarketData(cacheKey: string, data: MarketDataResult): Promise<void> {
  try {
    // Non-blocking - don't await
    redis.set(cacheKey, data, CACHE_TTL.MARKET_DATA).catch((err) => {
      loggers.cache.error("Market data cache write failed:", err);
    });
  } catch (error) {
    loggers.cache.error("Failed to set market data cache:", error);
  }
}

/**
 * Batch lookup tokens from cache using MGET
 * Returns map of address -> UnifiedTokenData (null if not cached)
 */
export async function getCachedTokensBatch(addresses: string[]): Promise<Map<string, UnifiedTokenData | null>> {
  const perfStart = performance.now();

  try {
    const cachedTokensMap = await getManyUnifiedTokens(addresses);
    const cachedCount = Array.from(cachedTokensMap.values()).filter((t) => t !== null).length;
    const missingCount = addresses.length - cachedCount;
    const duration = performance.now() - perfStart;

    loggers.cache.debug(
      `Batch lookup: ${cachedCount}/${addresses.length} tokens cached (${duration.toFixed(0)}ms) [${missingCount} need refresh]`
    );

    return cachedTokensMap;
  } catch (error) {
    loggers.cache.error("Failed to batch lookup tokens:", error);

    // Return empty map on error
    return new Map(addresses.map((addr) => [addr, null]));
  }
}

/**
 * Batch cache multiple tokens (non-blocking)
 */
export async function setCachedTokensBatch(tokensToCache: Array<{ address: string; data: UnifiedTokenData }>): Promise<void> {
  if (tokensToCache.length === 0) return;

  try {
    // Fire and forget - don't block response
    setManyUnifiedTokens(tokensToCache, CACHE_TTL.TOKEN_DETAIL).catch((err) => {
      loggers.cache.error(`Failed to batch cache ${tokensToCache.length} tokens:`, err);
    });
  } catch (error) {
    loggers.cache.error("Failed to set cached tokens batch:", error);
  }
}

/**
 * Check if cached data is still fresh enough to use
 * Prevents using stale data even if it's still in cache
 */
export function isCacheStillFresh(cached: UnifiedTokenData): boolean {
  const MAX_AGE_MS = CACHE_TTL.TOKEN_DETAIL * 1000; // Convert seconds to ms
  const age = Date.now() - cached.lastUpdated;

  return age < MAX_AGE_MS;
}
