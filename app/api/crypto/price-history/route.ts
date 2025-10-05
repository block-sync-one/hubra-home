import { NextResponse } from "next/server";

/**
 * Fallback price history data for when CoinGecko API fails
 * Provides sample data points for chart rendering (7 days)
 */
const FALLBACK_PRICE_HISTORY = {
  prices: [
    [Date.now() - 6 * 24 * 60 * 60 * 1000, 45000],
    [Date.now() - 5 * 24 * 60 * 60 * 1000, 46000],
    [Date.now() - 4 * 24 * 60 * 60 * 1000, 44000],
    [Date.now() - 3 * 24 * 60 * 60 * 1000, 47000],
    [Date.now() - 2 * 24 * 60 * 60 * 1000, 48000],
    [Date.now() - 1 * 24 * 60 * 60 * 1000, 46000],
    [Date.now(), 47000],
  ],
};

/**
 * Cryptocurrency price history endpoint
 *
 * Fetches historical price data for a specific cryptocurrency including:
 * - Price points over time (7 days by default)
 * - Market cap history
 * - Volume history
 *
 * @description This endpoint provides historical cryptocurrency price data
 * from CoinGecko API with 5-minute caching and fallback data support.
 * Useful for generating price charts and trend analysis.
 *
 * @param {Request} request - The incoming HTTP request
 * @param {string} request.url - The request URL containing query parameters
 *
 * @returns {Promise<NextResponse>} JSON response containing price history data
 *
 * @example
 * ```typescript
 * // Fetch 7-day price history for Bitcoin
 * const response = await fetch('/api/crypto/price-history?id=bitcoin&days=7');
 * const data = await response.json();
 *
 * console.log(data.prices[0]); // [timestamp, price]
 * ```
 *
 * @param {string} [id=bitcoin] - Cryptocurrency ID (e.g., 'bitcoin', 'ethereum')
 * @param {string} [days=7] - Number of days of history (1-365)
 * @param {string} [vs_currency=usd] - Target currency for prices (usd, eur, btc, etc.)
 *
 * @throws {Error} When CoinGecko API is unavailable, returns fallback data with 200 status
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @see {@link https://docs.coingecko.com/reference/coins-market-chart} CoinGecko Market Chart API Documentation
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "bitcoin";
    const days = searchParams.get("days") || "7";
    const vs_currency = searchParams.get("vs_currency") || "usd";

    // Check for API key
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

    // Construct URL with API key if available
    const url = apiKey
      ? `${baseUrl}/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}&x_cg_pro_api_key=${apiKey}`
      : `${baseUrl}/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`;

    console.log(`Fetching price history for ${id} (${days} days) from CoinGecko API`);

    const response = await fetch(url, {
      next: { revalidate: 300 }, // 5-minute cache
      headers: {
        "Accept": "application/json",
        "User-Agent": "Hubra-App/1.0",
      },
    });

    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status} ${response.statusText}`);

      return NextResponse.json(FALLBACK_PRICE_HISTORY, {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const data = await response.json();

    // Validate response structure
    if (!data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
      console.warn("Invalid price history data structure from CoinGecko API");

      return NextResponse.json(FALLBACK_PRICE_HISTORY, {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    console.log(`Successfully fetched ${data.prices.length} price points for ${id}`);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        "X-Fallback-Data": "false",
      },
    });
  } catch (error) {
    console.error("Error fetching price history:", error);

    return NextResponse.json(FALLBACK_PRICE_HISTORY, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
        "X-Fallback-Data": "true",
      },
    });
  }
}
