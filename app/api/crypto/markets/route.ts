import { NextResponse } from "next/server";

import { fetchMarketData } from "@/lib/data/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200);
  const offset = parseInt(searchParams.get("offset") || "0");

  const result = await fetchMarketData(limit, offset);

  return NextResponse.json({
    data: result.data,
    stats: result.stats,
  });
}
