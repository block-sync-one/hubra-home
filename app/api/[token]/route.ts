import { NextRequest, NextResponse } from "next/server";

import { fetchTokenData } from "@/lib/data/token-data";
import { loggers } from "@/lib/utils/logger";

/**
 * API route to fetch detailed token information by address
 *
 * @description Fetches comprehensive token data with Redis caching.
 * Caching is now handled in fetchTokenData() for consistency
 * between server components and API routes.
 *
 * @param request - The incoming request object
 * @param params - Route parameters containing the token address
 * @returns JSON response with token data or error
 *
 * @example
 * GET /api/So11111111111111111111111111111111111111112
 * GET /api/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v (USDC address)
 *
 * @throws {Error} When API request fails or token not found
 * @since 2.0.0
 * @see {@link https://docs.birdeye.so/reference/get-defi-token_overview} Birdeye Token Overview API Documentation
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    // Use shared data fetching function (includes Redis caching)
    const tokenData = await fetchTokenData(token);

    if (!tokenData) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json(tokenData, {
      headers: {
        "Cache-Control": "public, max-age=120",
      },
    });
  } catch (error) {
    loggers.api.error("Error fetching token data:", error);

    return NextResponse.json(
      { error: "Failed to fetch token data" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
