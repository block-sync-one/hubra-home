import { NextResponse } from "next/server";

import { redis } from "./redis";

import { loggers } from "@/lib/utils/logger";

export async function withCache<T>(cacheKey: string, ttl: number, fetcher: () => Promise<T>, fallback?: T): Promise<NextResponse> {
  try {
    const cached = await redis.get<T>(cacheKey);

    if (cached) {
      return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
    }

    const data = await fetcher();

    await redis.set(cacheKey, data, ttl);

    return NextResponse.json(data, { headers: { "X-Cache": "MISS" } });
  } catch (error) {
    loggers.api.error(`API error:`, error);

    if (fallback) {
      return NextResponse.json(fallback, {
        status: 200,
        headers: { "X-Fallback-Data": "true" },
      });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
