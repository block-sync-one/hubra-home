"use server";

import { isNotNil } from "es-toolkit";

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

const DEFAULT_VOTES: CryptoPanicVotes = {
  negative: 0,
  positive: 0,
  important: 0,
  liked: 0,
  disliked: 0,
  lol: 0,
  toxic: 0,
  saved: 0,
  comments: 0,
};

const DEFAULT_CONTENT: CryptoPanicContent = {
  original: null,
  clean: null,
};

const CRYPTOPANIC_API_BASE = "https://cryptopanic.com/api/developer/v2/posts/";
const ALL_NEWS = "all_news";

const CURRENCY = "sol";

/**
 * Builds the CryptoPanic API URL for SOL
 */
function buildApiUrl(currency: string, apiKey: string): URL {
  const url = new URL(CRYPTOPANIC_API_BASE);

  url.searchParams.set("auth_token", apiKey);
  url.searchParams.set("currencies", currency);
  url.searchParams.set("public", "true");

  return url;
}

/**
 * Validates if a post has the minimum required fields
 */
function isValidPost(post: unknown): post is CryptoPanicPost {
  return (
    typeof post === "object" &&
    post !== null &&
    "id" in post &&
    "title" in post &&
    typeof (post as Record<string, unknown>).id === "number" &&
    typeof (post as Record<string, unknown>).title === "string"
  );
}

/**
 * Normalizes a raw post from the API to ensure all fields have defaults
 */
function normalizePost(post: CryptoPanicPost): CryptoPanicPost {
  return {
    ...post,
    source: post.source || undefined,
    original_url: post.original_url || post.url || "",
    description: post.description || "",
    instruments: post.instruments || [],
    votes: post.votes || DEFAULT_VOTES,
    content: post.content || DEFAULT_CONTENT,
  };
}

/**
 * Fetches all news from CryptoPanic API for SOL
 */
async function fetchNewsFromApi(apiKey: string): Promise<CryptoPanicPost[]> {
  const allPosts: CryptoPanicPost[] = [];
  let nextUrl: string | undefined = buildApiUrl(CURRENCY, apiKey).toString();

  while (nextUrl) {
    try {
      const response = await fetch(nextUrl, {
        headers: {
          "User-Agent": "HubraBot/1.0",
          "Accept": "application/json",
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        const errorText = await response.text();

        loggers.cache.error(`CryptoPanic API error ${response.status}: ${errorText.substring(0, 200)}`);

        if (response.status === 401 || response.status === 403) {
          loggers.cache.error("CryptoPanic API authentication failed. Check CRYPTOPANIC_API_KEY.");
        }

        break;
      }

      let apiResponse: CryptoPanicResponse;

      try {
        apiResponse = await response.json();
      } catch (parseError) {
        loggers.cache.error("Failed to parse CryptoPanic API response:", parseError);

        break;
      }

      if (!apiResponse || !Array.isArray(apiResponse.results)) {
        loggers.cache.error("CryptoPanic API returned invalid response structure", { apiResponse });

        break;
      }

      const normalizedPosts = apiResponse.results.filter(isValidPost).map(normalizePost);

      allPosts.push(...normalizedPosts);

      nextUrl = apiResponse.next || undefined;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      loggers.cache.error(`CryptoPanic fetch error:`, errorMessage);

      break;
    }
  }

  loggers.cache.debug(`Fetched ${allPosts.length} total news items from CryptoPanic for SOL`);

  return allPosts;
}

export async function fetchCryptoPanicNews(): Promise<CryptoPanicPost[]> {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) {
    loggers.cache.warn("CRYPTOPANIC_API_KEY not configured");

    return [];
  }

  const cacheKey = cacheKeys.cryptopanicNews(ALL_NEWS);
  const cachedNews = await redis.get<CryptoPanicPost[]>(cacheKey);

  if (isNotNil(cachedNews)) {
    loggers.cache.debug(`HIT: CryptoPanic SOL news cache`);

    return cachedNews;
  }

  loggers.cache.debug(`MISS: Fetching CryptoPanic SOL news`);

  const newsPosts = await fetchNewsFromApi(apiKey);

  await redis.set(cacheKey, newsPosts, CACHE_TTL.CRYPTOPANIC_NEWS).catch((err) => {
    loggers.cache.error(`Failed to cache CryptoPanic SOL news:`, err);
  });

  return newsPosts;
}
