"use server";

import { isNotNil } from "es-toolkit";

import { loggers } from "@/lib/utils/logger";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache/redis";
import { apiQueue } from "@/lib/utils/request-queue";

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
const FALLBACK_CURRENCY = "sol";
const MIN_NEWS_COUNT = 4;

/**
 * Builds the CryptoPanic API URL for a given entity
 */
function buildApiUrl(entity: string, apiKey: string): URL {
  const url = new URL(CRYPTOPANIC_API_BASE);

  url.searchParams.set("auth_token", apiKey);
  url.searchParams.set("currencies", entity);
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
 * Fetches and processes news from CryptoPanic API for a given entity
 */
async function fetchNewsFromApi(entity: string, apiKey: string): Promise<CryptoPanicPost[]> {
  const apiUrl = buildApiUrl(entity, apiKey);

  try {
    const response = await fetch(apiUrl.toString(), {
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

      return [];
    }

    let apiResponse: CryptoPanicResponse;

    try {
      apiResponse = await response.json();
    } catch (parseError) {
      loggers.cache.error("Failed to parse CryptoPanic API response:", parseError);

      return [];
    }

    if (!apiResponse || !Array.isArray(apiResponse.results)) {
      loggers.cache.error("CryptoPanic API returned invalid response structure", { apiResponse });

      return [];
    }

    loggers.cache.debug(`CryptoPanic API returned ${apiResponse.results.length} total results for ${entity}`);

    const normalizedPosts = apiResponse.results.filter(isValidPost).map(normalizePost);

    loggers.cache.debug(
      `Fetched ${normalizedPosts.length} valid news items from CryptoPanic for ${entity} (filtered from ${apiResponse.results.length} total)`
    );

    return normalizedPosts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    loggers.cache.error(`CryptoPanic fetch error for ${entity}:`, errorMessage);

    return [];
  }
}

/**
 * Determines if fallback news should be used based on news count and entity
 */
function shouldUseFallback(newsCount: number, entity: string): boolean {
  return newsCount <= MIN_NEWS_COUNT && entity !== FALLBACK_CURRENCY;
}

/**
 * Merges news arrays without duplicates based on post ID
 */
function mergeNewsWithoutDuplicates(original: CryptoPanicPost[], fallback: CryptoPanicPost[]): CryptoPanicPost[] {
  const originalIds = new Set(original.map((p) => p.id));
  const uniqueFallback = fallback.filter((p) => !originalIds.has(p.id));

  return [...original, ...uniqueFallback];
}

/**
 * Enriches news with fallback SOL news when the requested entity has insufficient news
 */
async function enrichWithFallbackNews(
  apiKey: string,
  requestedCurrency: string,
  originalNews: CryptoPanicPost[]
): Promise<CryptoPanicPost[]> {
  loggers.cache.debug(
    `Insufficient news for ${requestedCurrency} (${originalNews.length} items), trying ${FALLBACK_CURRENCY.toUpperCase()} as fallback`
  );

  const solCacheKey = cacheKeys.cryptopanicNews(FALLBACK_CURRENCY);
  const cachedSolNews = await redis.get<CryptoPanicPost[]>(solCacheKey);

  if (cachedSolNews && cachedSolNews.length > 0) {
    loggers.cache.debug(`Using cached ${FALLBACK_CURRENCY.toUpperCase()} news as fallback for ${requestedCurrency}`);

    return mergeNewsWithoutDuplicates(originalNews, cachedSolNews);
  }

  loggers.cache.debug(`Fetching fresh ${FALLBACK_CURRENCY.toUpperCase()} news as fallback for ${requestedCurrency}`);
  const solNews = await fetchNewsFromApi(FALLBACK_CURRENCY, apiKey);

  if (solNews.length > 0) {
    await redis.set(solCacheKey, solNews, CACHE_TTL.CRYPTOPANIC_NEWS).catch(() => {});
    loggers.cache.debug(`Returning ${solNews.length} ${FALLBACK_CURRENCY.toUpperCase()} news items as fallback for ${requestedCurrency}`);
  }

  return mergeNewsWithoutDuplicates(originalNews, solNews);
}

async function fetchCryptoPanicNewsInternal(entity: string): Promise<CryptoPanicPost[]> {
  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) {
    loggers.cache.warn("CRYPTOPANIC_API_KEY not configured");

    return [];
  }

  const normalizedCurrency = entity.toLowerCase();
  const cacheKey = cacheKeys.cryptopanicNews(normalizedCurrency);

  const cachedNews = await redis.get<CryptoPanicPost[]>(cacheKey);

  if (isNotNil(cachedNews)) {
    loggers.cache.debug(`HIT: CryptoPanic news cache for ${normalizedCurrency}`);

    if (shouldUseFallback(cachedNews.length, normalizedCurrency)) {
      return await enrichWithFallbackNews(apiKey, normalizedCurrency, cachedNews);
    }

    return cachedNews;
  }

  loggers.cache.debug(`MISS: Fetching CryptoPanic news for ${normalizedCurrency}`);

  const newsPosts = await fetchNewsFromApi(normalizedCurrency, apiKey);

  await redis.set(cacheKey, newsPosts, CACHE_TTL.CRYPTOPANIC_NEWS).catch((err) => {
    loggers.cache.error(`Failed to cache CryptoPanic news for ${normalizedCurrency}:`, err);
  });

  if (shouldUseFallback(newsPosts.length, normalizedCurrency)) {
    return await enrichWithFallbackNews(apiKey, normalizedCurrency, newsPosts);
  }

  return newsPosts;
}

export async function fetchCryptoPanicNews(entity: string): Promise<CryptoPanicPost[]> {
  const normalizedCurrency = entity.toLowerCase();
  const dedupeKey = `cryptopanic:news:${normalizedCurrency}`;

  return await apiQueue.dedupe(dedupeKey, () => fetchCryptoPanicNewsInternal(entity));
}
