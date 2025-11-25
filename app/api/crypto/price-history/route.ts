import { NextResponse } from "next/server";

import { fetchPriceHistory } from "@/lib/data/price-history";
import { loggers } from "@/lib/utils/logger";

const FALLBACK_PRICE_HISTORY = {
  data: [],
  success: true,
  error: "Unable to fetch price history data",
};

/**
 * GET /api/crypto/price-history
 *
 * Client-side API route for interactive price chart period switching.
 * Delegates to centralized fetchPriceHistory() which handles:
 * - Redis SWR caching
 * - Birdeye API fetching
 * - Data transformation
 *
 * This API route is necessary because price charts are client-side
 * interactive components that need to refetch data when users change
 * the time period (24h, 7d, 1M, etc.)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get("id");
    const days = searchParams.get("days") || "1";

    if (!tokenAddress) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    if (tokenAddress.length < 32 || tokenAddress.length > 44) {
      loggers.api.warn("[Price History API] Invalid token address:", tokenAddress);

      return NextResponse.json({ error: "Invalid token address format" }, { status: 400 });
    }

    // Delegate to centralized data layer function
    const priceHistoryData = await fetchPriceHistory(tokenAddress, days);

    if (!priceHistoryData) {
      loggers.api.warn("[Price History API] No data returned for:", tokenAddress);

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

    return NextResponse.json(priceHistoryData, {
      headers: { "X-Cache": "HIT" },
    });
  } catch (error) {
    loggers.api.error("[Price History API] Error:", error);

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
