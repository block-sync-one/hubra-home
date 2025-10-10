import { NextRequest, NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { BirdEyeTokenOverview } from "@/lib/types/birdeye";

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

    console.log("token=====>", token);

    if (!token) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    // Fetch token overview from Birdeye (Solana network)
    const overviewResponse = await fetchBirdeyeData<BirdEyeTokenOverview>(
      "/defi/token_overview",
      {
        address: token,
        ui_amount_mode: "scaled",
        // chain parameter will be auto-added by buildBirdeyeUrl
      },
      {
        cache: "no-store", // Disable cache for fresh data
      }
    );

    if (!overviewResponse.success || !overviewResponse.data) {
      console.warn(`Token not found: ${token}`);

      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    console.log("overviewResponse.data=====>", overviewResponse.data);

    const tokenRes = overviewResponse.data;

    tokenRes.name === "Wrapped SOL" ? (tokenRes.name = "Solana") : tokenRes.name;

    return NextResponse.json(tokenRes, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
        "X-Fallback-Data": "false",
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
