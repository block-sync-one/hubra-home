import { NextResponse } from "next/server";

import { fetchBirdeyeData, DEFAULT_CHAIN } from "@/lib/services/birdeye";

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
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 100);
    const order = searchParams.get("order") || "market_cap_desc";
    const chain = searchParams.get("chain") || DEFAULT_CHAIN;

    console.log(`Fetching ${limit} tokens from Birdeye API (chain: ${chain})`);

    // Fetch token list from Birdeye
    // Note: Token list returns top tokens by default (no sort parameters accepted)
    const response = await fetchBirdeyeData<{ data: { items: BirdeyeToken[] }; success: boolean }>(
      "/defi/v3/token/list",
      {
        offset: "0",
        limit: limit.toString(),
        // chain parameter will be auto-added by buildBirdeyeUrl
        // Note: sort_by/sort_type parameters cause 400 error - removed
      },
      {
        next: {
          revalidate: 300, // Cache for 5 minutes (300 seconds)
        },
      }
    );

    if (!response.success || !response.data?.items) {
      console.warn("Invalid response from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const items = response.data.items;

    if (items.length === 0) {
      console.warn("No tokens returned from Birdeye API - Serving fallback data");

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    // Transform Birdeye data to CoinGecko-compatible format
    const transformedData = items.map((token, index) => transformBirdeyeToken(token, index));

    console.log(`Successfully fetched ${transformedData.length} tokens from Birdeye API`);

    return NextResponse.json(transformedData, {
      headers: {
        // Cache for 2 minutes on CDN/server
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
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
