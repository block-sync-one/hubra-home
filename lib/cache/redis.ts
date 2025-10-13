import Redis, { RedisOptions } from "ioredis";

export const CACHE_TTL = {
  MARKET_DATA: 120,
  TOKEN_DETAIL: 120,
  PRICE_HISTORY: 300,
  TRENDING: 180,
  GLOBAL_STATS: 300,
  SEARCH: 60,
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

      await this.client.ping();
      this.isConnecting = false;

      return this.client;
    } catch (error) {
      this.isConnecting = false;
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
    } catch (error) {
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttl: number = CACHE_TTL.SEARCH): Promise<boolean> {
    try {
      const client = await this.connect();
      const serialized = JSON.stringify(value);

      await client.setex(key, ttl, serialized);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.del(key);

      return true;
    } catch (error) {
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
    } catch (error) {
      return 0;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const client = await this.connect();
      const result = await client.exists(key);

      return result === 1;
    } catch (error) {
      return false;
    }
  }

  public async ttl(key: string): Promise<number> {
    try {
      const client = await this.connect();
      const result = await client.ttl(key);

      return result;
    } catch (error) {
      return -1;
    }
  }

  public async flushAll(): Promise<boolean> {
    try {
      const client = await this.connect();

      await client.flushall();

      return true;
    } catch (error) {
      return false;
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
  tokenDetail: (address: string) => `token:${address}`,
  priceHistory: (address: string, days: number | string) => `price:${address}:${days}`,
  trending: (limit: number) => `trending:${limit}`,
  globalStats: () => "global:stats",
} as const;
