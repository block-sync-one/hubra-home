/**
 * Cron Job: Refresh Market Data Cache
 *
 * This endpoint is called by Vercel Cron to refresh the Redis cache
 * periodically, ensuring data is always fresh.
 *
 * Frequency: Every 15 minute
 * Protected: Requires CRON_SECRET for security
 */

import { NextRequest, NextResponse } from "next/server";

import { fetchMarketData } from "@/lib/data/market-data";
import { loggers } from "@/lib/utils/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

    if (authHeader !== expectedSecret) {
      loggers.data.warn("Unauthorized cron attempt");

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startTime = Date.now();

    loggers.data.info("🔄 Starting cache refresh...");

    // Delete existing cache first to force fresh fetch
    const { redis, cacheKeys } = await import("@/lib/cache");

    await redis.del(cacheKeys.marketData(200, 0));

    // Force fresh fetch from Birdeye (bypasses existing cache)
    // This will update both the list cache and individual token caches
    const tokens = await fetchMarketData(200, 0);

    const duration = Date.now() - startTime;

    loggers.data.info(`✅ Cache refreshed: ${tokens.length} tokens in ${duration}ms`);

    return NextResponse.json({
      success: true,
      tokensUpdated: tokens.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    loggers.data.error("❌ Cache refresh failed:", error);

    return NextResponse.json(
      {
        error: "Cache refresh failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
