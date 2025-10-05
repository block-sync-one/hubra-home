import { NextResponse } from "next/server";

/**
 * Fallback cryptocurrency market data for when CoinGecko API fails
 * Provides a single Bitcoin entry with zero values to maintain data structure
 */
const FALLBACK_MARKETS_DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
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
    max_supply: 21000000,
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
 * Cryptocurrency market data endpoint
 *
 * Fetches detailed market information for cryptocurrencies including:
 * - Current prices and market capitalization
 * - 24-hour price changes and volume
 * - Market rankings and supply information
 * - Historical price data (ATH/ATL)
 *
 * @description This endpoint provides real-time cryptocurrency market data
 * from CoinGecko API with 5-minute caching and fallback data support.
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
 * console.log(data[0].name); // Bitcoin
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
 * @param {string} [limit=100] - Number of cryptocurrencies to return (1-250)
 * @param {string} [order=market_cap_desc] - Sort order (market_cap_desc, volume_desc, etc.)
 * @param {string} [vs_currency=usd] - Target currency for prices (usd, eur, btc, etc.)
 *
 * @throws {Error} When CoinGecko API is unavailable, returns fallback data with 200 status
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @see {@link https://docs.coingecko.com/reference/coins-markets} CoinGecko Markets API Documentation
 */
export async function GET(request: Request) {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100";
    const order = searchParams.get("order") || "market_cap_desc";
    const vsCurrency = searchParams.get("vs_currency") || "usd";

    // Build query parameters
    const queryParams = new URLSearchParams({
      vs_currency: vsCurrency,
      order: order,
      per_page: limit,
      page: "1",
      sparkline: "false",
      price_change_percentage: "24h",
    });

    if (apiKey) {
      queryParams.append("x_cg_pro_api_key", apiKey);
    }

    const url = `${baseUrl}/coins/markets?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 300, // Cache for 5 minutes (300 seconds)
      },
    });

    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status} - Serving fallback data`);

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const data = await response.json();

    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Invalid or empty data from CoinGecko API - Serving fallback data");

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "CDN-Cache-Control": "public, s-maxage=300",
        "Vercel-CDN-Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (error) {
    console.error("Error fetching market data:", error);

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
