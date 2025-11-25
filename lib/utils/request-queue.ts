/**
 * Request Deduplication Queue
 *
 * Prevents duplicate concurrent requests to the same resource.
 * If multiple callers request the same key simultaneously, they all
 * receive the same promise instead of making separate network calls.
 *
 * This protects against:
 * - Cache miss stampedes
 * - API rate limit exhaustion
 * - Redundant network requests
 *
 * @example
 * ```typescript
 * const data = await apiQueue.dedupe('token:SOL', async () => {
 *   return await fetch('/api/token/SOL');
 * });
 * ```
 */

import { loggers } from "./logger";

class RequestQueue {
  private inFlight = new Map<string, Promise<any>>();
  private stats = {
    deduped: 0,
    total: 0,
  };

  /**
   * Execute a request with deduplication
   *
   * If a request with the same key is already in flight,
   * returns the existing promise instead of executing the function.
   *
   * @param key - Unique identifier for this request
   * @param fn - Function that performs the actual request
   * @returns Promise resolving to the request result
   */
  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    this.stats.total++;

    // If request already in flight, return existing promise
    if (this.inFlight.has(key)) {
      this.stats.deduped++;
      loggers.cache.debug(`🔄 Deduped request: ${key} (saved ${this.stats.deduped}/${this.stats.total} total)`);

      return this.inFlight.get(key)!;
    }

    // Execute new request
    loggers.cache.debug(`📤 New request: ${key}`);
    const promise = fn().finally(() => {
      // Remove from in-flight map when complete
      this.inFlight.delete(key);
    });

    this.inFlight.set(key, promise);

    return promise;
  }

  /**
   * Get current deduplication statistics
   */
  getStats() {
    return {
      ...this.stats,
      inFlight: this.inFlight.size,
      savingsPercent: this.stats.total > 0 ? ((this.stats.deduped / this.stats.total) * 100).toFixed(1) : "0",
    };
  }

  /**
   * Clear all in-flight requests (useful for testing)
   */
  clear() {
    this.inFlight.clear();
    this.stats = { deduped: 0, total: 0 };
  }
}

/**
 * Global request queue instance
 *
 * Use this to deduplicate API requests across the application
 */
export const apiQueue = new RequestQueue();
