import { NextResponse } from "next/server";

import { getCacheStats } from "@/lib/cache/monitor";
import { loggers } from "@/lib/utils/logger";

/**
 * GET /api/internal/cache-stats
 *
 * Internal endpoint for cache performance monitoring.
 * Provides insights into:
 * - Redis connection status
 * - Memory usage
 * - Key distribution
 * - Cache hit rates (estimated)
 * - Request deduplication stats
 *
 * This endpoint is for internal debugging and monitoring only.
 * In production, protect with authentication or remove from build.
 *
 * @example
 * ```bash
 * curl http://localhost:3000/api/internal/cache-stats
 * ```
 */
export async function GET(request: Request) {
  try {
    // Optional: Add authentication
    const authHeader = request.headers.get("authorization");
    const expectedAuth = process.env.INTERNAL_API_SECRET;

    // If secret is configured, enforce it
    if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get cache statistics
    const stats = await getCacheStats();

    loggers.api.debug("[Cache Stats] Stats retrieved");

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats,
    });
  } catch (error) {
    loggers.api.error("[Cache Stats] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get cache stats",
      },
      { status: 500 }
    );
  }
}
