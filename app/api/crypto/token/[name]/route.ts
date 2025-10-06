import { NextRequest, NextResponse } from "next/server";

import { getTokenId } from "@/lib/utils/token-ids";

/**
 * API route to fetch detailed token information by name
 *
 * @description Fetches comprehensive token data from CoinGecko API including
 * current price, market data, historical data, and token metadata.
 *
 * @param request - The incoming request object
 * @param params - Route parameters containing the token name
 * @returns JSON response with token data or error
 *
 * @example
 * GET /api/crypto/token/bitcoin
 * GET /api/crypto/token/ethereum
 *
 * @throws {Error} When API request fails or token not found
 * @since 1.0.0
 * @version 1.0.0
 * @see {@link https://docs.coingecko.com/reference/coins-id}
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: "Token name is required" }, { status: 400 });
    }

    // Get the proper CoinGecko token ID using our mapping
    const tokenId = getTokenId(name);

    // Construct API URL
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

    const url = `${baseUrl}/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`;

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
      if (response.status === 404) {
        // Try to search for the token first
        try {
          const searchResponse = await fetch(`${baseUrl}/search?query=${encodeURIComponent(name)}`, {
            method: "GET",
            headers,
            next: { revalidate: 300 },
          });

          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            const firstResult = searchData.coins?.[0];

            if (firstResult) {
              // Retry with the found token ID
              const retryUrl = `${baseUrl}/coins/${firstResult.id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`;
              const retryResponse = await fetch(retryUrl, {
                method: "GET",
                headers,
                next: { revalidate: 300 },
              });

              if (retryResponse.ok) {
                const retryData = await retryResponse.json();
                const transformedData = {
                  id: retryData.id,
                  name: retryData.name,
                  symbol: retryData.symbol.toUpperCase(),
                  image: retryData.image,
                  market_data: {
                    current_price: retryData.market_data?.current_price || { usd: 0 },
                    market_cap: retryData.market_data?.market_cap || { usd: 0 },
                    total_volume: retryData.market_data?.total_volume || { usd: 0 },
                    price_change_percentage_24h: retryData.market_data?.price_change_percentage_24h || 0,
                    market_cap_change_percentage_24h: retryData.market_data?.market_cap_change_percentage_24h || 0,
                    high_24h: retryData.market_data?.high_24h || { usd: 0 },
                    low_24h: retryData.market_data?.low_24h || { usd: 0 },
                  },
                  market_cap_rank: retryData.market_cap_rank || 0,
                  coingecko_rank: retryData.coingecko_rank || 0,
                  coingecko_score: retryData.coingecko_score || 0,
                  developer_score: retryData.developer_score || 0,
                  community_score: retryData.community_score || 0,
                  liquidity_score: retryData.liquidity_score || 0,
                  public_interest_score: retryData.public_interest_score || 0,
                  description: retryData.description?.en || "",
                  links: retryData.links || {},
                  categories: retryData.categories || [],
                  last_updated: retryData.last_updated,
                };

                return NextResponse.json(transformedData, {
                  status: 200,
                  headers: {
                    "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
                  },
                });
              }
            }
          }
        } catch (searchError) {
          console.error("Search fallback failed:", searchError);
        }

        return NextResponse.json({ error: "Token not found" }, { status: 404 });
      }

      // Return fallback data for other errors
      const fallbackData = {
        id: tokenId,
        name: tokenId.charAt(0).toUpperCase() + tokenId.slice(1),
        symbol: tokenId.substring(0, 3).toUpperCase(),
        image: {
          thumb: "/logo.svg",
          small: "/logo.svg",
          large: "/logo.svg",
        },
        market_data: {
          current_price: { usd: 0 },
          market_cap: { usd: 0 },
          total_volume: { usd: 0 },
          price_change_percentage_24h: 0,
          market_cap_change_percentage_24h: 0,
          high_24h: { usd: 0 },
          low_24h: { usd: 0 },
        },
        market_cap_rank: 0,
        coingecko_rank: 0,
        coingecko_score: 0,
        developer_score: 0,
        community_score: 0,
        liquidity_score: 0,
        public_interest_score: 0,
      };

      return NextResponse.json(fallbackData, {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
          "X-Fallback-Data": "true",
        },
      });
    }

    const data = await response.json();

    // Transform the data to match our expected format
    const transformedData = {
      id: data.id,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      image: data.image,
      market_data: {
        current_price: data.market_data?.current_price || { usd: 0 },
        market_cap: data.market_data?.market_cap || { usd: 0 },
        total_volume: data.market_data?.total_volume || { usd: 0 },
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        market_cap_change_percentage_24h: data.market_data?.market_cap_change_percentage_24h || 0,
        high_24h: data.market_data?.high_24h || { usd: 0 },
        low_24h: data.market_data?.low_24h || { usd: 0 },
      },
      market_cap_rank: data.market_cap_rank || 0,
      coingecko_rank: data.coingecko_rank || 0,
      coingecko_score: data.coingecko_score || 0,
      developer_score: data.developer_score || 0,
      community_score: data.community_score || 0,
      liquidity_score: data.liquidity_score || 0,
      public_interest_score: data.public_interest_score || 0,
      description: data.description?.en || "",
      links: data.links || {},
      categories: data.categories || [],
      last_updated: data.last_updated,
    };

    return NextResponse.json(transformedData, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching token data:", error);

    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 });
  }
}
