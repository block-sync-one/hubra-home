import { NextRequest, NextResponse } from "next/server";

import { fetchTokenData } from "@/lib/data/token-data";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

/**
 * API route to fetch detailed token information by address
 *
 * @description Fetches comprehensive token data from Birdeye API including
 * current price, market data, volume, and token metadata.
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

    console.log("API route - fetching token:", token);

    if (!token) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    const cacheKey = cacheKeys.tokenDetail(token);

    // Try Redis cache first
    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      console.log(`Cache HIT for token: ${token}`);

      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=120",
        },
      });
    }

    console.log(`Cache MISS for token: ${token}`);

    // Use shared data fetching function
    const tokenData = await fetchTokenData(token);

    if (!tokenData) {
      console.warn(`Token not found: ${token}`);

      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    console.log("API route - token data fetched:", tokenData.symbol);

    // Store in Redis cache
    await redis.set(cacheKey, tokenData, CACHE_TTL.TOKEN_DETAIL);

    return NextResponse.json(tokenData, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=120",
      },
    });
  } catch (error) {
    console.error("Error fetching token data from Birdeye:", error);

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
