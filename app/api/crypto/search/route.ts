import { NextRequest, NextResponse } from "next/server";

import { searchTokens } from "@/lib/data/search-token";

/**
 * GET /api/crypto/search
 * Search for tokens using Birdeye API
 * Note: No caching - search queries are user-specific and diverse
 * @query keyword - Search term (required)
 * @returns { data: Token[], success: boolean }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json({ data: [], success: true }, { status: 200 });
    }

    const normalizedKeyword = keyword.toLowerCase().trim();

    console.log(`Searching for: ${normalizedKeyword}`);

    // Fetch from API directly (no cache - each search is unique)
    const tokens = await searchTokens(normalizedKeyword);

    return NextResponse.json(
      { data: tokens, success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // Don't cache user-specific searches
        },
      }
    );
  } catch (error) {
    console.error("Error in search API:", error);

    return NextResponse.json({ error: "Failed to search tokens", success: false }, { status: 500 });
  }
}
