import { NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

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

export async function GET() {
  try {
    const cacheKey = cacheKeys.globalStats();

    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      loggers.cache.debug("HIT: global stats");

      return NextResponse.json(cachedData, {
        headers: { "X-Cache": "HIT" },
      });
    }

    loggers.cache.debug("MISS: global stats");

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
      loggers.data.warn("Invalid Birdeye response - using fallback");

      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
        headers: { "X-Fallback-Data": "true" },
      });
    }

    const items = response.data.items;

    if (items.length === 0) {
      loggers.data.warn("No tokens from Birdeye - using fallback");

      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
        headers: { "X-Fallback-Data": "true" },
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

    loggers.data.debug("Fetched global market data", {
      totalMarketCap,
      totalVolume,
      newTokens,
    });

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.GLOBAL_STATS);

    return NextResponse.json(transformedData, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    loggers.api.error("Failed to fetch global data", error);

    return NextResponse.json(FALLBACK_GLOBAL_DATA, {
      status: 200,
      headers: {
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
