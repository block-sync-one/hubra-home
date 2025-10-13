import { NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

/**
 * Fallback trending data
 */
const FALLBACK_TRENDING_DATA = {
  coins: [],
};

/**
 * API route to fetch trending tokens with Redis caching
 *
 * @description Fetches trending token list from Birdeye API
 * showing tokens with high trading activity and volume.
 *
 * @returns JSON response with trending tokens data
 *
 * @example
 * GET /api/crypto/trending
 *
 * @throws {Error} When API request fails, returns fallback data
 * @since 1.0.0
 * @version 2.0.0
 * @see {@link https://docs.birdeye.so/reference/get-defi-v3-token-trending} Birdeye Trending API Documentation
 */
export async function GET() {
  try {
    const limit = 4;
    const cacheKey = cacheKeys.trending(limit);

    console.log("Fetching trending tokens from Birdeye API");

    // Try Redis cache first
    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      console.log("Cache HIT for trending tokens");

      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=180",
        },
      });
    }

    console.log("Cache MISS for trending tokens");

    // Fetch trending tokens from Birdeye using the official trending endpoint
    const response = await fetchBirdeyeData<{
      data: {
        tokens: Array<{
          address: string;
          decimals: number;
          symbol: string;
          name: string;
          logoURI?: string;
          liquidity?: number;
          volume24hUSD?: number;
          volume24hChangePercent?: number | null;
          price?: number;
          price24hChangePercent?: number;
          marketcap?: number;
          fdv?: number;
          rank?: number;
        }>;
      };
      success: boolean;
    }>("/defi/token_trending", {
      offset: "0",
      limit: limit.toString(),
    });

    if (!response.success || !response.data?.tokens) {
      console.warn("Invalid response from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Fallback-Data": "true",
        },
      });
    }

    const tokens = response.data.tokens;

    if (tokens.length === 0) {
      console.warn("No trending tokens from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Fallback-Data": "true",
        },
      });
    }

    // Transform Birdeye trending data to expected format
    const transformedCoins = tokens.map((token, index) => ({
      item: {
        id: token.address,
        coin_id: token.address,
        name: token.name,
        symbol: token.symbol,
        market_cap_rank: token.rank || index + 1,
        thumb: token.logoURI || "",
        small: token.logoURI || "",
        large: token.logoURI || "",
        slug: token.symbol.toLowerCase(),
        price_btc: 0,
        score: 0,
        data: {
          price: token.price || 0,
          price_btc: "0",
          price_change_percentage_24h: {
            usd: token.price24hChangePercent || 0,
          },
          market_cap: `$${(token.marketcap || 0).toLocaleString()}`,
          market_cap_btc: "0",
          total_volume: `$${(token.volume24hUSD || 0).toLocaleString()}`,
          total_volume_btc: "0",
          sparkline: "",
          content: {
            title: token.name,
            description: `${token.name} (${token.symbol}) is trending on Solana by 24h volume`,
          },
        },
      },
    }));

    const transformedData = {
      coins: transformedCoins,
    };

    console.log(`Successfully fetched ${transformedCoins.length} trending tokens from Birdeye API`);

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.TRENDING);

    return NextResponse.json(transformedData, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=180",
      },
    });
  } catch (error) {
    console.error("Error fetching trending data from Birdeye:", error);

    return NextResponse.json(FALLBACK_TRENDING_DATA, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
