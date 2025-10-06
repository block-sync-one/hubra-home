import { NextRequest, NextResponse } from "next/server";

/**
 * API route to search for tokens by name or symbol
 *
 * @description Searches for cryptocurrency tokens using CoinGecko's search API
 * to find the correct token ID for a given name or symbol.
 *
 * @param request - The incoming request object
 * @returns JSON response with search results or error
 *
 * @example
 * GET /api/crypto/search?q=ethereum
 * GET /api/crypto/search?q=bitcoin
 * GET /api/crypto/search?q=lido
 *
 * @throws {Error} When API request fails or search fails
 * @since 1.0.0
 * @version 1.0.0
 * @see {@link https://docs.coingecko.com/reference/search}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    // Construct API URL
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

    const url = `${baseUrl}/search?query=${encodeURIComponent(query)}`;

    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (apiKey) {
      headers["x-cg-pro-api-key"] = apiKey;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to search tokens" }, { status: response.status });
    }

    const data = await response.json();

    // Transform the search results
    const transformedResults = {
      coins:
        data.coins?.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          market_cap_rank: coin.market_cap_rank,
          thumb: coin.thumb,
          large: coin.large,
        })) || [],
      exchanges: data.exchanges || [],
      categories: data.categories || [],
    };

    return NextResponse.json(transformedResults, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error searching tokens:", error);

    return NextResponse.json({ error: "Failed to search tokens" }, { status: 500 });
  }
}
