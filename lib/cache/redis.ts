import "server-only";

import Redis, { RedisOptions } from "ioredis";

export const CACHE_TTL = {
  MARKET_DATA: 300,
  TOKEN_DETAIL: 300,
  PRICE_HISTORY: 300,
  TRENDING: 300,
  GLOBAL_STATS: 900,
  SEARCH: 300,
  STABLECOIN_DATA: 300,
  EXCHANGE_RATES: 3600,
  CRYPTOPANIC_NEWS: 43200,
  PROTOCOL: 43200,
} as const;

class RedisClient {
  private static instance: RedisClient;
  private client: Redis | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }

    return RedisClient.instance;
  }

  private async connect(): Promise<Redis> {
    // Reuse existing connection if ready or connecting
    if (this.client) {
      const status = this.client.status;

      if (status === "ready") {
        return this.client;
      }
      // If connecting or reconnecting, wait for it
      if (status === "connecting" || status === "reconnecting") {
        // Wait briefly and check again
        await new Promise((resolve) => setTimeout(resolve, 50));
        if (this.client.status === "ready") {
          return this.client;
        }
      }
      // Clean up dead connections
      if (status === "end" || status === "close") {
        try {
          this.client.disconnect();
        } catch {
          // Ignore errors during cleanup
        }
        this.client = null;
      }
    }

    // Prevent concurrent connection attempts
    if (this.isConnecting) {
      // Wait briefly for existing attempt
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (this.client && this.client.status === "ready") {
        return this.client;
      }
    }

    this.isConnecting = true;

    try {
      const redisUrl = process.env.REDIS_URL;

      if (!redisUrl) {
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
        lazyConnect: true, // Only connect when first command is executed
        keepAlive: 30000, // Keep connection alive for 30s
        connectTimeout: 10000, // 10s connection timeout
      };

      this.client = new Redis(redisUrl, options);

      // With lazyConnect, ping will trigger the actual connection
      await this.client.ping();
      this.isConnecting = false;

      return this.client;
    } catch (error) {
      this.isConnecting = false;
      if (this.client) {
        try {
          this.client.disconnect();
        } catch {
          // Ignore errors
        }
      }
      this.client = null;
      throw error;
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.connect();
      const value = await client.get(key);

      if (!value) return null;

      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttl: number = CACHE_TTL.SEARCH): Promise<boolean> {
    try {
      const client = await this.connect();
      const serialized = JSON.stringify(value);

      await client.setex(key, ttl, serialized);

      return true;
    } catch {
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.del(key);

      return true;
    } catch {
      return false;
    }
  }

  public async delPattern(pattern: string): Promise<number> {
    try {
      const client = await this.connect();
      const keys = await client.keys(pattern);

      if (keys.length === 0) return 0;

      const deleted = await client.del(...keys);

      return deleted;
    } catch {
      return 0;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const client = await this.connect();
      const result = await client.exists(key);

      return result === 1;
    } catch {
      return false;
    }
  }

  public async ttl(key: string): Promise<number> {
    try {
      const client = await this.connect();

      return await client.ttl(key);
    } catch {
      return -1;
    }
  }

  public async flushAll(): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.flushall();

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Batch get multiple keys using MGET
   * Returns a map of key -> parsed value (null if key doesn't exist)
   */
  public async mget<T>(keys: string[]): Promise<Map<string, T | null>> {
    const result = new Map<string, T | null>();

    if (keys.length === 0) return result;

    try {
      const client = await this.connect();
      const values = await client.mget(...keys);

      keys.forEach((key, index) => {
        const value = values[index];

        if (value) {
          try {
            result.set(key, JSON.parse(value) as T);
          } catch {
            result.set(key, null);
          }
        } else {
          result.set(key, null);
        }
      });

      return result;
    } catch {
      // Return empty map on error
      keys.forEach((key) => result.set(key, null));

      return result;
    }
  }

  /**
   * Batch set multiple key-value pairs using MSET + EXPIRE via pipeline
   * More efficient than individual SET calls
   */
  public async mset<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean> {
    if (entries.length === 0) return true;

    try {
      const client = await this.connect();
      const pipeline = client.pipeline();

      for (const entry of entries) {
        const serialized = JSON.stringify(entry.value);
        const ttl = entry.ttl ?? CACHE_TTL.SEARCH;

        pipeline.setex(entry.key, ttl, serialized);
      }

      await pipeline.exec();

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute a batch of commands using Redis pipeline
   * Reduces network round trips
   */
  public async executePipeline<T>(commands: Array<{ command: string; args: (string | number)[] }>): Promise<Array<T | null>> {
    if (commands.length === 0) return [];

    try {
      const client = await this.connect();
      const pipeline = client.pipeline();

      for (const cmd of commands) {
        (pipeline as any)[cmd.command](...cmd.args);
      }

      const results = await pipeline.exec();

      if (!results) return [];

      return results.map(([err, result]) => {
        if (err) return null;

        return result as T;
      });
    } catch {
      return new Array(commands.length).fill(null);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}

export const redis = RedisClient.getInstance();

export const cacheKeys = {
  marketData: (limit: number, offset: number) => `market:${limit}:${offset}`,
  newlyListed: (limit: number, offset: number) => `newly-listed:${limit}:${offset}`,
  tokenDetail: (address: string) => `token:${address}`,
  priceHistory: (address: string, days: number | string) => `price:${address}:${days}`,
  trending: (limit: number) => `trending:${limit}`,
  globalStats: () => "global:stats",
  stablecoinChains: () => "global:stablecoin",
  globalSolanaTVL: () => "global:totalTVL",
  exchangeRates: () => "global:exchange-rates",
  cryptopanicNews: (key: string) => `cryptopanic:news:${key.toLowerCase()}`,
} as const;
