import "server-only";

import { fetchBirdeyeData, mapTimeRange } from "@/lib/services/birdeye";
import { cacheKeys, CACHE_TTL, getStaleWhileRevalidate } from "@/lib/cache";

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

/**
 * Fetch price history with stale-while-revalidate pattern
 */
export async function fetchPriceHistory(tokenAddress: string, days: string = "7"): Promise<PriceHistoryData | null> {
  const cacheKey = cacheKeys.priceHistory(tokenAddress, days);

  return await getStaleWhileRevalidate<PriceHistoryData>(cacheKey, CACHE_TTL.PRICE_HISTORY, async () => {
    const timeType = mapTimeRange(days === "max" ? "max" : parseInt(days, 10));
    const now = Math.floor(Date.now() / 1000);
    const daysNum = days === "max" ? 365 : parseInt(days, 10);
    const timeFrom = now - daysNum * 24 * 60 * 60;

    const response = await fetchBirdeyeData<{
      data: {
        items: Array<{
          unix_time: number; // Birdeye v3 uses snake_case
          o: number;
          h: number;
          l: number;
          c: number;
          v: number;
          address: string;
          type: string;
          currency: string;
        }>;
      };
      success: boolean;
    }>("/defi/v3/ohlcv", {
      address: tokenAddress,
      type: timeType,
      time_from: timeFrom.toString(),
      time_to: now.toString(),
    });

    if (!response.success || !response.data?.items || response.data.items.length === 0) {
      throw new Error("No price history data available");
    }

    const transformedData: PriceHistoryData = {
      data: response.data.items.map((item) => ({
        timestamp: item.unix_time * 1000, // Convert to milliseconds
        price: item.c, // Close price
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

    return transformedData;
  });
}
