import "server-only";

/**
 * Centralized Stale-While-Revalidate (SWR) Cache
 *
 * Single source of truth for all caching operations:
 * - Fresh cache (TTL > 25% of original): Return immediately
 * - Stale cache (TTL < 25% of original): Return stale data, refresh in background
 * - No cache: Fetch fresh data
 *
 * Supports intelligent batch caching:
 * - Arrays: Can cache individual items + aggregate result
 * - Objects: Cache as single entity
 */

import { redis } from "./redis";

import { loggers } from "@/lib/utils/logger";

export type FetchFn<T> = () => Promise<T>;

/**
 * Configuration for batch item caching
 * Used when result contains an array of items that should be cached individually
 */
export interface BatchCacheConfig<T> {
  /**
   * Extract array of items from result
   */
  extractItems: (result: T) => any[];

  /**
   * Generate cache key for each item
   */
  getItemKey: (item: any) => string;

  /**
   * Transform item for caching (optional)
   */
  transformItem?: (item: any) => any;

  /**
   * TTL for individual items (defaults to main TTL)
   */
  itemTtl?: number;
}

/**
 * Cache configuration for SWR
 */
export interface CacheConfig<T> {
  /**
   * Batch caching configuration (optional)
   * When provided, individual items from arrays will be cached separately
   */
  batchCache?: BatchCacheConfig<T>;
}

/**
 * Centralized stale-while-revalidate pattern
 *
 * This function is the SINGLE SOURCE OF TRUTH for all caching operations.
 * It handles:
 * - Cache freshness detection
 * - Stale data return + background refresh
 * - Main result caching
 * - Optional batch item caching (for arrays)
 *
 * @param key - Redis cache key for main result
 * @param ttl - Time-to-live in seconds
 * @param fetchFn - Function to fetch fresh data (NO caching logic)
 * @param config - Optional cache configuration for batch caching
 * @returns Cached or fresh data
 */
export async function getStaleWhileRevalidate<T>(
  key: string,
  ttl: number,
  fetchFn: FetchFn<T>,
  config?: CacheConfig<T>
): Promise<T | null> {
  try {
    // Check cache
    const cached = await redis.get<T>(key);

    if (cached) {
      // Check remaining TTL
      const remainingTtl = await redis.ttl(key);

      // If cache is in last 5% of its lifetime, refresh in background
      if (remainingTtl > 0 && remainingTtl < ttl / 20) {
        loggers.cache.debug(`⚠️ Stale cache (TTL: ${remainingTtl}s/${ttl}s), refreshing in background: ${key}`);

        // Fire-and-forget background refresh with retry logic
        setImmediate(() => {
          retryBackgroundRefresh(key, fetchFn, ttl, config, 0);
        });
      } else {
        loggers.cache.debug(`✓ Fresh cache (TTL: ${remainingTtl}s/${ttl}s): ${key}`);
      }

      // Return cached data immediately
      return cached;
    }

    // Cache miss - fetch fresh data
    loggers.cache.debug(`MISS: ${key} - fetching fresh data`);

    const freshData = await fetchFn();

    // Cache main result (non-blocking)
    redis.set(key, freshData, ttl).catch((err) => {
      loggers.cache.error(`Failed to cache ${key}:`, err);
    });

    // Batch cache individual items if configured (non-blocking)
    if (config?.batchCache) {
      cacheItemsBatch(freshData, config.batchCache, ttl).catch((err) => {
        loggers.cache.error(`Failed to batch cache items for ${key}:`, err);
      });
    }

    return freshData;
  } catch (error) {
    loggers.cache.error(`SWR fetch failed for ${key}:`, error);

    return null;
  }
}

/**
 * Retry background refresh with exponential backoff
 * Handles transient network errors gracefully
 */
async function retryBackgroundRefresh<T>(
  key: string,
  fetchFn: FetchFn<T>,
  ttl: number,
  config: CacheConfig<T> | undefined,
  attempt: number,
  maxAttempts: number = 3
): Promise<void> {
  const baseDelay = Math.min(1000 * Math.pow(2, attempt), 10000); // Max 10s delay

  try {
    const fresh = await fetchFn();

    // Cache main result
    await redis.set(key, fresh, ttl);

    // Batch cache individual items if configured
    if (config?.batchCache) {
      await cacheItemsBatch(fresh, config.batchCache, ttl);
    }

    loggers.cache.debug(`✓ Background refresh complete: ${key}`);
  } catch (error: any) {
    const isNetworkError =
      error?.code === "ECONNRESET" ||
      error?.code === "ETIMEDOUT" ||
      error?.code === "ENOTFOUND" ||
      error?.message?.includes("fetch failed") ||
      error?.cause?.code === "ECONNRESET";

    // Only retry network errors, not API errors (4xx, 5xx)
    if (isNetworkError && attempt < maxAttempts - 1) {
      loggers.cache.debug(`⚠️ Background refresh failed (attempt ${attempt + 1}/${maxAttempts}), retrying in ${baseDelay}ms: ${key}`);

      // Retry with exponential backoff
      setTimeout(() => {
        retryBackgroundRefresh(key, fetchFn, ttl, config, attempt + 1, maxAttempts);
      }, baseDelay);
    } else {
      // Log error only if all retries failed or it's a non-retryable error
      loggers.cache.error(`Background refresh failed for ${key} after ${attempt + 1} attempt(s):`, error);
    }
  }
}

/**
 * Cache individual items from an array result
 * Uses Redis pipeline for efficient batch writes
 */
async function cacheItemsBatch<T>(result: T, config: BatchCacheConfig<T>, ttl: number): Promise<void> {
  try {
    const items = config.extractItems(result);

    if (items.length === 0) return;

    const entries = items.map((item) => {
      const itemKey = config.getItemKey(item);
      const itemData = config.transformItem ? config.transformItem(item) : item;
      const itemTtl = config.itemTtl ?? ttl;

      return { key: itemKey, value: itemData, ttl: itemTtl };
    });

    await redis.mset(entries);

    loggers.cache.debug(`✓ Batch cached ${entries.length} items`);
  } catch (error) {
    loggers.cache.error("Failed to batch cache items:", error);
  }
}
