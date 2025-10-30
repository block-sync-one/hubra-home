import { fetchBirdeyeData, mapTimeRange } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

export interface PriceHistoryData {
  data: Array<{
    timestamp: number;
    price: number;
    open: number;
    high: number;
    low: number;
    volume: number;
  }>;
  success: boolean;
  tokenAddress: string;
  timeRange: {
    from: number;
    to: number;
    type: string;
  };
}

export async function fetchPriceHistory(tokenAddress: string, days: string = "7"): Promise<PriceHistoryData | null> {
  try {
    const cacheKey = cacheKeys.priceHistory(tokenAddress, days);
    const cachedData = await redis.get<PriceHistoryData>(cacheKey);

    if (cachedData) {
      loggers.cache.debug(`HIT: price history ${tokenAddress}`);

      return cachedData;
    }

    loggers.cache.debug(`MISS: price history ${tokenAddress}`);

    const timeType = mapTimeRange(days === "max" ? "max" : parseInt(days, 10));
    const now = Math.floor(Date.now() / 1000);
    const daysNum = days === "max" ? 365 : parseInt(days, 10);
    const timeFrom = now - daysNum * 24 * 60 * 60;

    const response = await fetchBirdeyeData<{
      data: {
        items: Array<{
          unixTime: number;
          o: number;
          h: number;
          l: number;
          c: number;
          v: number;
        }>;
      };
      success: boolean;
    }>("/defi/ohlcv", {
      address: tokenAddress,
      type: timeType,
      time_from: timeFrom.toString(),
      time_to: now.toString(),
    });

    if (!response.success || !response.data?.items || response.data.items.length === 0) {
      return null;
    }

    const transformedData: PriceHistoryData = {
      data: response.data.items.map((item) => ({
        timestamp: item.unixTime * 1000,
        price: item.c,
        open: item.o,
        high: item.h,
        low: item.l,
        volume: item.v,
      })),
      success: true,
      tokenAddress,
      timeRange: {
        from: timeFrom,
        to: now,
        type: timeType,
      },
    };

    await redis.set(cacheKey, transformedData, CACHE_TTL.PRICE_HISTORY);

    return transformedData;
  } catch (error) {
    loggers.data.error("Failed to fetch price history:", error);

    return null;
  }
}
