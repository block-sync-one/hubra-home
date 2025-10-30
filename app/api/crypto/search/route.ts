import { NextRequest, NextResponse } from "next/server";

import { searchTokens } from "@/lib/data/search-token";
import { loggers } from "@/lib/utils/logger";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json({ data: [], success: true }, { status: 200 });
    }

    const normalizedKeyword = keyword.toLowerCase().trim();

    loggers.api.debug("Search query", normalizedKeyword);

    // Fetch from API directly (no cache - each search is unique)
    const tokens = await searchTokens(normalizedKeyword);

    return NextResponse.json({ data: tokens, success: true }, { status: 200 });
  } catch (error) {
    loggers.api.error("Search API failed", error);

    return NextResponse.json({ error: "Failed to search tokens", success: false }, { status: 500 });
  }
}
