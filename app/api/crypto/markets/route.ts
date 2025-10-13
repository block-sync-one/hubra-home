import { NextResponse } from "next/server";

import { fetchMarketData } from "@/lib/data/market-data";
import { loggers } from "@/lib/utils/logger";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = parseInt(searchParams.get("limit") || "100", 10);
    const limit = Math.min(requestedLimit, 200); // Allow up to 200 tokens
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Use shared data fetching function (includes Redis caching)
    const marketData = await fetchMarketData(limit, offset);

    if (!marketData || marketData.length === 0) {
      loggers.api.warn("No market data available - Serving fallback data");

      return NextResponse.json(FALLBACK_MARKETS_DATA, {
        headers: { "X-Fallback-Data": "true" },
      });
    }

    return NextResponse.json(marketData);
  } catch (error) {
    loggers.api.error("Error fetching market data:", error);

    return NextResponse.json(FALLBACK_MARKETS_DATA, {
      status: 200,
      headers: {
        "X-Fallback-Data": "true",
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
