import { NextResponse } from "next/server";

import { fetchBirdeyeData, mapTimeRange } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

/**
 * Fallback price history data (Birdeye-native format)
 * Returns empty array to let client handle gracefully
 */
const FALLBACK_PRICE_HISTORY = {
  data: [],
  success: true,
  error: "Unable to fetch price history data",
};

/**
 * API route to fetch historical price data for a token
 *
 * @description Fetches price history data from Birdeye OHLCV API
 * for chart visualization. Supports multiple time ranges.
 *
 * @param request - The incoming request object
 * @returns JSON response with price history data
 *
 * @example
 * GET /api/crypto/price-history?id=So11111111111111111111111111111111111111112&days=7
 * GET /api/crypto/price-history?id=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&days=30
 *
 * @param {string} id - Token address
 * @param {string|number} days - Number of days or 'max' for all available data
 *
 * @throws {Error} When API request fails, returns fallback data
 * @since 1.0.0
 * @version 2.0.0
 * @see {@link https://docs.birdeye.so/reference/get_defi_ohlcv} Birdeye OHLCV API Documentation
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get("id");
    const days = searchParams.get("days") || "1";

    if (!tokenAddress) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    // Validate token address format (Solana addresses are 32-44 characters)
    if (tokenAddress.length < 32 || tokenAddress.length > 44) {
      console.error(`Invalid token address format: ${tokenAddress} (length: ${tokenAddress.length})`);

      return NextResponse.json({ error: "Invalid token address format" }, { status: 400 });
    }

    const cacheKey = cacheKeys.priceHistory(tokenAddress, days);

    // Try Redis cache first
    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      console.log(`Cache HIT for price history: ${tokenAddress} (${days} days)`);

      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    console.log(`Cache MISS for price history: ${tokenAddress} (${days} days)`);

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
      console.warn("Invalid response from Birdeye API", {
        success: response.success,
        hasData: !!response.data,
        hasItems: !!response.data?.items,
      });

      return NextResponse.json(
        {
          ...FALLBACK_PRICE_HISTORY,
          error: "Invalid response from Birdeye API",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            "X-Fallback-Data": "true",
          },
        }
      );
    }

    const items = response.data.items;

    if (items.length === 0) {
      console.warn("No price history data from Birdeye API for token:", tokenAddress);

      return NextResponse.json(
        {
          ...FALLBACK_PRICE_HISTORY,
          error: "No price history data available for this token",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            "X-Fallback-Data": "true",
          },
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

    console.log(`Successfully fetched ${items.length} OHLCV data points for ${tokenAddress}`);

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.PRICE_HISTORY);

    return NextResponse.json(transformedData, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching price history from Birdeye:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        ...FALLBACK_PRICE_HISTORY,
        error: error instanceof Error ? error.message : "Failed to fetch price history",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
          "X-Error": error instanceof Error ? error.message : "Unknown error",
        },
      }
    );
  }
}
