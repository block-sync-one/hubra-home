import { NextResponse } from "next/server";

import { fetchBirdeyeData, DEFAULT_CHAIN } from "@/lib/services/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";

/**
 * Fallback cryptocurrency market data for when Birdeye API fails
 * Provides sample Solana tokens with zero values to maintain data structure
 */
const FALLBACK_MARKETS_DATA = [
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 0,
    market_cap: 0,
    market_cap_rank: 1,
    fully_diluted_valuation: 0,
    total_volume: 0,
    high_24h: 0,
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: 0,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 0,
    max_supply: null,
    ath: 0,
    ath_change_percentage: 0,
    ath_date: new Date().toISOString(),
    atl: 0,
    atl_change_percentage: 0,
    atl_date: new Date().toISOString(),
    roi: null,
    last_updated: new Date().toISOString(),
  },
];

/**
 * Birdeye Token Interface
 * Based on actual API response structure (snake_case fields)
 */
interface BirdeyeToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo_uri?: string;
  liquidity?: number;
  volume_24h_usd?: number;
  volume_24h_change_percent?: number;
  price?: number;
  price_change_24h_percent?: number;
  market_cap?: number;
  holder?: number;
}

/**
 * Transform Birdeye token data to CoinGecko-compatible format
 */
function transformBirdeyeToken(token: BirdeyeToken, index: number) {
  const currentPrice = token.price || 0;
  const priceChangePercent = token.price_change_24h_percent || 0;
  const marketCap = token.market_cap || 0;
  const volume24h = token.volume_24h_usd || 0;

  return {
    id: token.address,
    symbol: token.symbol.toLowerCase(),
    name: token.name,
    image: token.logo_uri || "",
    current_price: currentPrice,
    market_cap: marketCap,
    market_cap_rank: index + 1,
    fully_diluted_valuation: marketCap,
    total_volume: volume24h,
    high_24h: currentPrice * 1.05, // Approximation
    low_24h: currentPrice * 0.95, // Approximation
    price_change_24h: (currentPrice * priceChangePercent) / 100,
    price_change_percentage_24h: priceChangePercent,
    market_cap_change_24h: 0, // Not provided by Birdeye
    market_cap_change_percentage_24h: 0, // Not provided by Birdeye
    circulating_supply: currentPrice > 0 ? marketCap / currentPrice : 0,
    total_supply: currentPrice > 0 ? marketCap / currentPrice : 0,
    max_supply: null,
    ath: currentPrice * 1.5, // Approximation
    ath_change_percentage: -33.33, // Approximation
    ath_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    atl: currentPrice * 0.5, // Approximation
    atl_change_percentage: 100, // Approximation
    atl_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    roi: null,
    last_updated: new Date().toISOString(),
  };
}

/**
 * Cryptocurrency market data endpoint
 *
 * Fetches detailed market information for cryptocurrencies including:
 * - Current prices and market capitalization
 * - 24-hour price changes and volume
 * - Market rankings and supply information
 * - Token metadata and logos
 *
 * @description This endpoint provides real-time cryptocurrency market data
 * from Birdeye API with 5-minute caching and fallback data support.
 * Supports filtering, sorting, and pagination.
 *
 * @param {Request} request - The incoming HTTP request
 * @param {string} request.url - The request URL containing query parameters
 *
 * @returns {Promise<NextResponse>} JSON response containing array of cryptocurrency market data
 *
 * @example
 * ```typescript
 * // Fetch top 10 cryptocurrencies by market cap
 * const response = await fetch('/api/crypto/markets?limit=10');
 * const data = await response.json();
 *
 * console.log(data[0].name); // Solana
 * console.log(data[0].current_price); // Current price in USD
 * console.log(data[0].price_change_percentage_24h); // 24h change %
 * ```
 *
 * @example
 * ```typescript
 * // Fetch cryptocurrencies ordered by volume
 * const response = await fetch('/api/crypto/markets?limit=50&order=volume_desc');
 * const data = await response.json();
 * ```
 *
 * @param {string} [limit=100] - Number of cryptocurrencies to return (1-100)
 * @param {string} [order=market_cap_desc] - Sort order (market_cap_desc, volume_desc, etc.)
 * @param {string} [chain=solana] - Blockchain network to query
 *
 * @throws {Error} When Birdeye API is unavailable, returns fallback data with 200 status
 *
 * @since 1.0.0
 * @version 2.0.0
 *
 * @see {@link https://docs.birdeye.so/reference/get-defi-v3-token-list} Birdeye Token List API Documentation
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get("limit") || "100", 10);
    const limit = Math.min(requestedLimit, 200); // Allow up to 200 tokens
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const order = searchParams.get("order") || "price_change_desc"; // Default to price change
    const chain = searchParams.get("chain") || DEFAULT_CHAIN;

    // Generate cache key
    const cacheKey = cacheKeys.marketData(limit, offset);

    console.log(`Fetching ${limit} tokens from Birdeye API (chain: ${chain}, offset: ${offset})`);

    // Try Redis cache first
    const cachedData = await redis.get<any[]>(cacheKey);

    if (cachedData) {
      console.log(`Cache HIT for markets: limit=${limit}, offset=${offset}`);

      return NextResponse.json(cachedData, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, max-age=120",
        },
      });
    }

    console.log(`Cache MISS for markets: limit=${limit}, offset=${offset}`);

    // Birdeye API has a max limit of 100 per request
    // If more than 100 is requested, make multiple parallel requests
    const BIRDEYE_MAX_LIMIT = 100;
    let allItems: BirdeyeToken[] = [];

    if (limit <= BIRDEYE_MAX_LIMIT) {
      // Single request for 100 or fewer tokens
      const response = await fetchBirdeyeData<{ data: { items: BirdeyeToken[] }; success: boolean }>("/defi/v3/token/list", {
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (!response.success || !response.data?.items) {
        console.warn("Invalid response from Birdeye API - Serving fallback data");

        return NextResponse.json(FALLBACK_MARKETS_DATA, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            "X-Fallback-Data": "true",
          },
        });
      }

      allItems = response.data.items;
    } else {
      // Multiple parallel requests for more than 100 tokens
      const numRequests = Math.ceil(limit / BIRDEYE_MAX_LIMIT);
      const requests = [];

      for (let i = 0; i < numRequests; i++) {
        const batchOffset = offset + i * BIRDEYE_MAX_LIMIT;
        const batchLimit = Math.min(BIRDEYE_MAX_LIMIT, limit - i * BIRDEYE_MAX_LIMIT);

        requests.push(
          fetchBirdeyeData<{ data: { items: BirdeyeToken[] }; success: boolean }>("/defi/v3/token/list", {
            offset: batchOffset.toString(),
            limit: batchLimit.toString(),
          })
        );
      }

      const responses = await Promise.all(requests);

      // Combine all results
      for (const response of responses) {
        if (response.success && response.data?.items) {
          allItems.push(...response.data.items);
        }
      }

      if (allItems.length === 0) {
        console.warn("No tokens returned from Birdeye API - Serving fallback data");

        return NextResponse.json(FALLBACK_MARKETS_DATA, {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
            "X-Fallback-Data": "true",
          },
        });
      }
    }

    if (allItems.length === 0) {
      console.warn("No tokens returned from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    // Transform Birdeye data to CoinGecko-compatible format
    const transformedData = allItems.map((token, index) => transformBirdeyeToken(token, offset + index));

    // Sort by the requested order (default: market_cap_desc)
    if (order === "volume_desc") {
      transformedData.sort((a, b) => b.total_volume - a.total_volume);
    } else if (order === "price_change_desc") {
      transformedData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (order === "price_change_asc") {
      transformedData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
    } else {
      // Default: market_cap_desc
      transformedData.sort((a, b) => b.market_cap - a.market_cap);
    }

    console.log(`Successfully fetched ${transformedData.length} tokens from Birdeye API`);

    // Store in Redis cache
    await redis.set(cacheKey, transformedData, CACHE_TTL.MARKET_DATA);

    return NextResponse.json(transformedData, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, max-age=120",
      },
    });
  } catch (error) {
    console.error("Error fetching market data from Birdeye:", error);

    return NextResponse.json(FALLBACK_MARKETS_DATA, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
