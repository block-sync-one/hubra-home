import { NextRequest, NextResponse } from "next/server";

import { fetchTokenData } from "@/lib/data/token-data";
import { loggers } from "@/lib/utils/logger";

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Token address is required" }, { status: 400 });
    }

    // Use shared data fetching function (includes Redis caching)
    const tokenData = await fetchTokenData(token);

    if (!tokenData) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json(tokenData);
  } catch (error) {
    loggers.api.error("Error fetching token data:", error);

    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 });
  }
}
