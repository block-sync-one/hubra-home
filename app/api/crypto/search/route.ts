import { NextRequest, NextResponse } from "next/server";

import { searchTokens } from "@/lib/data/search-token";

/**
 * GET /api/crypto/search
 * Search for tokens using Birdeye API (target=token, search_by=name)
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

    console.log(`Searching for: ${keyword}`);

    // Call the search function from lib/data - returns Token[] format
    const tokens = await searchTokens(keyword?.toLowerCase());

    return NextResponse.json(
      { data: tokens, success: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error in search API:", error);

    return NextResponse.json({ error: "Failed to search tokens", success: false }, { status: 500 });
  }
}
