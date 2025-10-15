import { NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";
import { setUnifiedToken, toUnifiedTokenData } from "@/lib/data/unified-token-cache";

const FALLBACK_TRENDING_DATA = {
  coins: [],
};

function cacheIndividualTrendingTokens(tokens: any[]): void {
  (async () => {
    try {
      await Promise.all(tokens.map((token) => setUnifiedToken(token.address, toUnifiedTokenData(token, "list"), CACHE_TTL.TRENDING)));

      loggers.cache.debug(`✓ Cached ${tokens.length} individual trending tokens (async)`);
    } catch (error) {
      loggers.cache.error("Failed to cache individual trending tokens:", error);
    }
  })();
}

export async function GET() {
  try {
    const limit = 4;
    const cacheKey = cacheKeys.trending(limit);

    // Try Redis cache first
    const cachedData = await redis.get<any>(cacheKey);

    if (cachedData) {
      loggers.cache.debug("HIT: trending tokens");

      return NextResponse.json(cachedData, {
        headers: { "X-Cache": "HIT" },
      });
    }

    loggers.cache.debug("MISS: trending tokens - Fetching from Birdeye");

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
      loggers.api.warn("Invalid response from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: { "X-Fallback-Data": "true" },
      });
    }

    const tokens = response.data.tokens;

    if (tokens.length === 0) {
      loggers.api.warn("No trending tokens from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: { "X-Fallback-Data": "true" },
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

    loggers.cache.debug(`Caching ${transformedCoins.length} trending tokens`);

    // Store trending list in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.TRENDING);

    // Also cache individual trending tokens in unified cache (async, non-blocking)
    cacheIndividualTrendingTokens(tokens);

    return NextResponse.json(transformedData, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    loggers.api.error("Error fetching trending data from Birdeye:", error);

    return NextResponse.json(FALLBACK_TRENDING_DATA, {
      status: 200,
      headers: {
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
