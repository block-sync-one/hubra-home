import { NextResponse } from "next/server";

import { fetchBirdeyeData, mapTimeRange } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

const FALLBACK_PRICE_HISTORY = {
  data: [],
  success: true,
  error: "Unable to fetch price history data",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get("id");
    const days = searchParams.get("days") || "1";

    if (!tokenAddress) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    if (tokenAddress.length < 32 || tokenAddress.length > 44) {
      loggers.api.warn("Invalid token address", tokenAddress);

      return NextResponse.json({ error: "Invalid token address format" }, { status: 400 });
    }

    const cacheKey = cacheKeys.priceHistory(tokenAddress, days);

    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      loggers.cache.debug(`HIT: price history ${tokenAddress}`);

      return NextResponse.json(cachedData, {
        headers: { "X-Cache": "HIT" },
      });
    }

    loggers.cache.debug(`MISS: price history ${tokenAddress}`);

    // Map days to Birdeye time range
    const timeType = mapTimeRange(days === "max" ? "max" : parseInt(days, 10));

    // Calculate time range
    const now = Math.floor(Date.now() / 1000);
    const daysNum = days === "max" ? 365 : parseInt(days, 10);
    const timeFrom = now - daysNum * 24 * 60 * 60;

    // Fetch OHLCV data from Birdeye
    const response = await fetchBirdeyeData<{
      data: {
        items: Array<{
          unixTime: number;
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
    }>("/defi/ohlcv", {
      address: tokenAddress,
      type: timeType,
      time_from: timeFrom.toString(),
      time_to: now.toString(),
    });

    if (!response.success || !response.data?.items) {
      loggers.data.warn("Invalid Birdeye response", {
        success: response.success,
        hasData: !!response.data,
      });

      return NextResponse.json(
        {
          ...FALLBACK_PRICE_HISTORY,
          error: "Invalid response from Birdeye API",
        },
        {
          headers: { "X-Fallback-Data": "true" },
        }
      );
    }

    const items = response.data.items;

    if (items.length === 0) {
      loggers.data.warn("No price history data", tokenAddress);

      return NextResponse.json(
        {
          ...FALLBACK_PRICE_HISTORY,
          error: "No price history data available for this token",
        },
        {
          headers: { "X-Fallback-Data": "true" },
        }
      );
    }

    // Transform to clean Birdeye-native format
    const transformedData = {
      data: items.map((item) => ({
        timestamp: item.unixTime * 1000, // Convert to milliseconds
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

    loggers.data.debug(`Fetched ${items.length} OHLCV points`, tokenAddress);

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.PRICE_HISTORY);

    return NextResponse.json(transformedData, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    loggers.api.error("Failed to fetch price history", error);

    return NextResponse.json(
      {
        ...FALLBACK_PRICE_HISTORY,
        error: error instanceof Error ? error.message : "Failed to fetch price history",
      },
      {
        status: 200,
        headers: {
          "X-Fallback-Data": "true",
          "X-Error": error instanceof Error ? error.message : "Unknown error",
        },
      }
    );
  }
}
