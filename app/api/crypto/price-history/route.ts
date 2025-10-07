import { NextResponse } from "next/server";

import { fetchBirdeyeData, mapTimeRange } from "@/lib/services/birdeye";

/**
 * Fallback price history data (Birdeye-native format)
 */
const FALLBACK_PRICE_HISTORY = {
  data: [
    {
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      price: 0,
      volume: 0,
    },
    {
      timestamp: Date.now(),
      price: 0,
      volume: 0,
    },
  ],
  success: true,
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

    console.log(`Fetching price history for ${tokenAddress} (${days} days) from Birdeye API`);

    // Map days to Birdeye time range
    const timeType = mapTimeRange(days === "max" ? "max" : parseInt(days, 10));

    // Calculate time range
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const daysNum = days === "max" ? 365 : parseInt(days, 10);
    const timeFrom = now - daysNum * 24 * 60 * 60; // X days ago

    // Fetch OHLCV data from Birdeye (Solana network)
    // Note: Using OHLCV endpoint (available in free tier)
    const response = await fetchBirdeyeData<{
      data: {
        items: Array<{
          unixTime: number;
          o: number; // open
          h: number; // high
          l: number; // low
          c: number; // close
          v: number; // volume
          address: string;
          type: string;
          currency: string;
        }>;
      };
      success: boolean;
    }>(
      "/defi/ohlcv",
      {
        address: tokenAddress,
        type: timeType,
        time_from: timeFrom.toString(),
        time_to: now.toString(),
        // chain parameter will be auto-added by buildBirdeyeUrl
      },
      {
        cache: "no-store", // Disable cache for fresh data
      }
    );

    if (!response.success || !response.data?.items) {
      console.warn("Invalid response from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_PRICE_HISTORY, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const items = response.data.items;

    if (items.length === 0) {
      console.warn("No price history data from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_PRICE_HISTORY, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
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

    return NextResponse.json(transformedData, {
      headers: {
        // Cache for 2 minutes on CDN/server
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
      },
    });
  } catch (error) {
    console.error("Error fetching price history from Birdeye:", error);

    return NextResponse.json(FALLBACK_PRICE_HISTORY, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
