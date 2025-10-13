import { NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

/**
 * Fallback global market data
 */
const FALLBACK_GLOBAL_DATA = {
  data: {
    active_cryptocurrencies: 0,
    upcoming_icos: 0,
    ongoing_icos: 0,
    ended_icos: 0,
    markets: 0,
    total_market_cap: {
      usd: 0,
    },
    total_volume: {
      usd: 0,
    },
    market_cap_percentage: {
      btc: 0,
      eth: 0,
    },
    market_cap_change_percentage_24h_usd: 0,
    updated_at: Math.floor(Date.now() / 1000),
    new_tokens: 0,
    sol_tvl: 0,
    sol_tvl_change: 0,
    stablecoins_tvl: 0,
    stablecoins_tvl_change: 0,
  },
};

/**
 * API route to fetch global cryptocurrency market data
 *
 * @description Fetches aggregated global market statistics from Birdeye API
 * including total market cap, volume, and market dominance data.
 * Note: Birdeye focuses on specific chains, so this aggregates Solana ecosystem data.
 *
 * @returns JSON response with global market data
 *
 * @example
 * GET /api/crypto/global
 *
 * @throws {Error} When API request fails, returns fallback data
 * @since 1.0.0
 * @version 2.0.0
 * @see {@link https://docs.birdeye.so/reference/get-defi-v3-token-list} Birdeye Token List API Documentation
 */
export async function GET() {
  try {
    const cacheKey = cacheKeys.globalStats();

    console.log("Fetching global market data from Birdeye API");

    // Try Redis cache first
    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      console.log("Cache HIT for global stats");

      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    console.log("Cache MISS for global stats");

    // Fetch top tokens to aggregate market data
    const response = await fetchBirdeyeData<{
      data: {
        items: Array<{
          address: string;
          symbol: string;
          name: string;
          market_cap?: number;
          volume_24h_usd?: number;
          volume_24h_change_percent?: number;
          price?: number;
          price_change_24h_percent?: number;
          liquidity?: number;
          recent_listing_time?: number | null;
        }>;
      };
      success: boolean;
    }>("/defi/v3/token/list", {
      offset: "0",
      limit: "100",
    });

    if (!response.success || !response.data?.items) {
      console.warn("Invalid response from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const items = response.data.items;

    if (items.length === 0) {
      console.warn("No tokens returned from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    // Aggregate market data
    const totalMarketCap = items.reduce((sum, token) => sum + (token.market_cap || 0), 0);
    const totalVolume = items.reduce((sum, token) => sum + (token.volume_24h_usd || 0), 0);
    const activeTokens = items.length;

    // Calculate weighted average market cap change
    const totalMarketCapChange = items.reduce((sum, token) => {
      const weight = (token.market_cap || 0) / totalMarketCap;
      const change = token.price_change_24h_percent || 0;

      return sum + weight * change;
    }, 0);

    // Calculate SOL TVL (using liquidity as proxy)
    const solToken = items.find((t) => t.symbol === "SOL");
    const solTVL = solToken?.liquidity || 0;
    const solTVLChange = solToken?.price_change_24h_percent || 0; // Use price change as proxy for TVL change

    // Calculate stablecoins TVL (USDC + USDT liquidity)
    const stablecoins = items.filter((t) => ["USDC", "USDT", "USDS", "DAI"].includes(t.symbol));
    const stablecoinsTVL = stablecoins.reduce((sum, token) => sum + (token.liquidity || 0), 0);

    // Calculate average change for stablecoins TVL
    const stablecoinsAvgChange =
      stablecoins.length > 0 ? stablecoins.reduce((sum, token) => sum + (token.volume_24h_change_percent || 0), 0) / stablecoins.length : 0;

    // Count new tokens (listed in last 7 days)
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const newTokens = items.filter((t) => t.recent_listing_time && t.recent_listing_time > sevenDaysAgo).length;

    // Transform to format expected by frontend
    const transformedData = {
      data: {
        active_cryptocurrencies: activeTokens,
        upcoming_icos: 0,
        ongoing_icos: 0,
        ended_icos: 0,
        markets: activeTokens * 2, // Approximation
        total_market_cap: {
          usd: totalMarketCap,
        },
        total_volume: {
          usd: totalVolume,
        },
        market_cap_percentage: {
          sol: solToken ? solToken.market_cap || 0 : 0,
          usdc: 0,
        },
        market_cap_change_percentage_24h_usd: totalMarketCapChange,
        updated_at: Math.floor(Date.now() / 1000),
        // New fields for Solana ecosystem
        new_tokens: newTokens,
        sol_tvl: solTVL,
        sol_tvl_change: solTVLChange,
        stablecoins_tvl: stablecoinsTVL,
        stablecoins_tvl_change: stablecoinsAvgChange,
      },
    };

    console.log(`Successfully fetched global market data:`, {
      totalMarketCap,
      totalMarketCapChange,
      totalVolume,
      newTokens,
      solTVL,
      solTVLChange,
      stablecoinsTVL,
      stablecoinsAvgChange,
    });

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.GLOBAL_STATS);

    return NextResponse.json(transformedData, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching global data from Birdeye:", error);

    return NextResponse.json(FALLBACK_GLOBAL_DATA, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
