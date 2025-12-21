"use server";

import { loggers } from "@/lib/utils/logger";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache/redis";

export interface CryptoPanicInstrument {
  code: string;
  title: string;
  slug: string;
  url: string;
  market_cap_usd?: number;
  price_in_usd?: number;
  price_in_btc?: number;
  price_in_eth?: number;
  price_in_eur?: number;
  market_rank?: number;
}

export interface CryptoPanicSource {
  title: string;
  region: string;
  domain: string;
  type: "feed" | "blog" | "twitter" | "media" | "reddit";
}

export interface CryptoPanicVotes {
  negative: number;
  positive: number;
  important: number;
  liked: number;
  disliked: number;
  lol: number;
  toxic: number;
  saved: number;
  comments: number;
}

export interface CryptoPanicContent {
  original: string | null;
  clean: string | null;
}

export interface CryptoPanicPost {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  published_at: string;
  created_at?: string;
  kind?: "news" | "media" | "blog" | "twitter" | "reddit";
  source?: CryptoPanicSource;
  original_url?: string;
  url: string;
  image?: string;
  instruments?: CryptoPanicInstrument[];
  votes?: CryptoPanicVotes;
  panic_score?: number;
  panic_score_1h?: number;
  author?: string;
  content?: CryptoPanicContent;
}

export interface CryptoPanicResponse {
  results: CryptoPanicPost[];
  count: number;
  next?: string;
  previous?: string;
}

/**
 * Fetch news from CryptoPanic API with 1-hour Redis caching
 * Only fetches from API if cache doesn't exist
 * @param key - Token symbol (e.g., "SOL", "BTC")
 * @returns Array of news posts or empty array on error
 */
export async function fetchCryptoPanicNews(key: string): Promise<CryptoPanicPost[]> {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) {
    loggers.cache.warn("CRYPTOPANIC_API_KEY not configured");

    return [];
  }

  const cacheKey = cacheKeys.cryptopanicNews(key);

  // Check cache first
  const cached = await redis.get<CryptoPanicPost[]>(cacheKey);

  if (cached) {
    loggers.cache.debug(`HIT: CryptoPanic news cache for ${key}`);

    return cached;
  }

  loggers.cache.debug(`MISS: Fetching CryptoPanic news for ${key}`);

  try {
    const url = new URL(`https://cryptopanic.com/api/developer/v2/posts/?auth_token=${apiKey}&currencies=${key.toUpperCase()}&public=true`);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "HubraBot/1.0",
        "Accept": "application/json",
      },
      next: { revalidate: 0 }, // No Next.js cache, using Redis instead
    });

    if (!response.ok) {
      const errorText = await response.text();

      loggers.cache.error(`CryptoPanic API error ${response.status}: ${errorText.substring(0, 200)}`);

      // Check if it's an authentication error
      if (response.status === 401 || response.status === 403) {
        loggers.cache.error("CryptoPanic API authentication failed. Check CRYPTOPANIC_API_KEY.");
      }

      return [];
    }

    let data: CryptoPanicResponse;

    try {
      data = await response.json();
    } catch (parseError) {
      loggers.cache.error("Failed to parse CryptoPanic API response:", parseError);

      return [];
    }

    if (!data || !Array.isArray(data.results)) {
      loggers.cache.error("CryptoPanic API returned invalid response structure", { data });

      return [];
    }

    loggers.cache.debug(`CryptoPanic API returned ${data.results.length} total results for ${key}`);

    // Filter and validate posts
    const validPosts = data.results
      .filter((post) => {
        if (!post) {
          loggers.cache.debug("Filtered out null/undefined post");

          return false;
        }
        if (!post.id) {
          loggers.cache.debug("Filtered out post without id:", post);

          return false;
        }
        if (!post.title) {
          loggers.cache.debug("Filtered out post without title:", { id: post.id });

          return false;
        }

        return true;
      })
      .map((post) => ({
        ...post,
        // Ensure required fields have defaults
        source: post.source || undefined,
        original_url: post?.original_url || post.url || "",
        description: post.description || "",
        instruments: post.instruments || [],
        votes: post.votes || {
          negative: 0,
          positive: 0,
          important: 0,
          liked: 0,
          disliked: 0,
          lol: 0,
          toxic: 0,
          saved: 0,
          comments: 0,
        },
        content: post.content || { original: null, clean: null },
      }));

    loggers.cache.debug(
      `Fetched ${validPosts.length} valid news items from CryptoPanic for ${key} (filtered from ${data.results.length} total)`
    );

    // Cache the result for 1 hour
    await redis.set(cacheKey, validPosts, CACHE_TTL.CRYPTOPANIC_NEWS).catch((err) => {
      loggers.cache.error(`Failed to cache CryptoPanic news for ${key}:`, err);
    });

    return validPosts;
  } catch (error: any) {
    loggers.cache.error("CryptoPanic fetch error:", error);

    return [];
  }
}
