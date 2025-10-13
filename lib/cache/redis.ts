/**
 * Redis Cache Client
 * Singleton pattern with connection pooling and error handling
 */

import Redis, { RedisOptions } from "ioredis";

// Default cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  MARKET_DATA: 120, // 2 minutes for market data
  TOKEN_DETAIL: 120, // 2 minutes for token details
  PRICE_HISTORY: 300, // 5 minutes for price history
  TRENDING: 180, // 3 minutes for trending tokens
  GLOBAL_STATS: 300, // 5 minutes for global stats
  SEARCH: 60, // 1 minute for search results
} as const;

class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null = null;
  private isConnecting = false;

  private constructor() {
    // Private constructor to enforce singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  /**
   * Initialize Redis connection
   */
  private async connect(): Promise<Redis> {
    if (this.client && this.client.status === "ready") {
      return this.client;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      await new Promise((resolve) => setTimeout(resolve, 100));

      return this.connect();
    }

    this.isConnecting = true;

    try {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
        console.warn("REDIS_URL not configured, caching disabled");
        this.isConnecting = false;

        throw new Error("REDIS_URL not configured");
      }

      const options: RedisOptions = {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);

          return delay;
        },
        enableReadyCheck: true,
        lazyConnect: false,
      };

      this.client = new Redis(redisUrl, options);

      this.client.on("error", (error) => {
        console.error("Redis Client Error:", error);
      });

      this.client.on("connect", () => {
        console.log("Redis Client Connected");
      });

      this.client.on("ready", () => {
        console.log("Redis Client Ready");
      });

      this.client.on("close", () => {
        console.log("Redis Client Connection Closed");
      });

      await this.client.ping();
      this.isConnecting = false;

      return this.client;
    } catch (error) {
      this.isConnecting = false;
      this.client = null;
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  /**
   * Get a value from cache
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.connect();
      const value = await client.get(key);

      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);

      return null;
    }
  }

  /**
   * Set a value in cache with TTL
   */
  public async set<T>(key: string, value: T, ttl: number = CACHE_TTL.SEARCH): Promise<boolean> {
    try {
      const client = await this.connect();
      const serialized = JSON.stringify(value);

      await client.setex(key, ttl, serialized);

      return true;
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);

      return false;
    }
  }

  /**
   * Delete a value from cache
   */
  public async del(key: string): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.del(key);

      return true;
    } catch (error) {
      console.error(`Redis DEL error for key ${key}:`, error);

      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  public async delPattern(pattern: string): Promise<number> {
    try {
      const client = await this.connect();
      const keys = await client.keys(pattern);

      if (keys.length === 0) return 0;

      const deleted = await client.del(...keys);

      return deleted;
    } catch (error) {
      console.error(`Redis DEL pattern error for ${pattern}:`, error);

      return 0;
    }
  }

  /**
   * Check if a key exists
   */
  public async exists(key: string): Promise<boolean> {
    try {
      const client = await this.connect();
      const result = await client.exists(key);

      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error);

      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  public async ttl(key: string): Promise<number> {
    try {
      const client = await this.connect();
      const result = await client.ttl(key);

      return result;
    } catch (error) {
      console.error(`Redis TTL error for key ${key}:`, error);

      return -1;
    }
  }

  /**
   * Clear all cache (use with caution)
   */
  public async flushAll(): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.flushall();

      return true;
    } catch (error) {
      console.error("Redis FLUSHALL error:", error);

      return false;
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

// Export singleton instance
export const redis = RedisClient.getInstance();

/**
 * Helper function to generate cache keys
 * Note: Search is intentionally excluded - user queries are too diverse for effective caching
 */
export const cacheKeys = {
  marketData: (limit: number, offset: number) => `market:${limit}:${offset}`,
  tokenDetail: (address: string) => `token:${address}`,
  priceHistory: (address: string, days: number | string) => `price:${address}:${days}`,
  trending: (limit: number) => `trending:${limit}`,
  globalStats: () => "global:stats",
} as const;
