/**
 * CoinGecko API Service
 *
 * Provides access to CoinGecko API for exchange rates
 * @see https://docs.coingecko.com/
 */

import "server-only";

import Coingecko from "@coingecko/coingecko-typescript";

import { cacheKeys, CACHE_TTL, redis } from "@/lib/cache/redis";
import { loggers } from "@/lib/utils/logger";

// Initialize a single, reusable client
export const coingeckoClient = new Coingecko({
  proAPIKey: process.env.COINGECKO_PRO_API_KEY,
  environment: process.env.COINGECKO_PRO_API_KEY ? "pro" : "demo",
  maxRetries: 3,
});

export const CURRENCY_MAPPING = {
  USD: "usd",
  EUR: "eur",
  JPY: "jpy",
  CHF: "chf",
  AUD: "aud",
  REAL: "brl", // Brazilian Real
  GBP: "gbp",
  TRY: "try",
} as const;

export const EXCLUDED_CURRENCIES = ["VAR"] as const;

export type SupportedCurrency = keyof typeof CURRENCY_MAPPING;

export interface ExchangeRates {
  usd: number;
  eur: number;
  jpy: number;
  chf: number;
  aud: number;
  brl: number;
  gbp: number;
  try?: number;
}

/**
 * Fetch exchange rates from CoinGecko
 *
 * @returns Exchange rates for supported currencies vs USD
 * @throws {Error} When API request fails
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const params: Coingecko.Simple.PriceGetParams = {
      ids: "usd",
      vs_currencies: "usd,eur,jpy,chf,aud,brl,gbp,try",
    };

    const response = await coingeckoClient.simple.price.get(params);

    if (!response || !response.usd) {
      throw new Error("Invalid response from CoinGecko API");
    }

    return response.usd as ExchangeRates;
  } catch (err) {
    if (err instanceof Coingecko.RateLimitError) {
      throw new Error("CoinGecko rate limit exceeded. Please try again later.");
    } else if (err instanceof Coingecko.APIError) {
      throw new Error(`CoinGecko API error: ${err.name} (Status: ${err.status})`);
    } else {
      throw new Error("Failed to fetch exchange rates from CoinGecko");
    }
  }
}

/**
 * Fetch exchange rates with Redis caching (1 hour TTL)
 *
 * Caches exchange rates for 1 hour since they change slowly.
 * Falls back to fresh fetch if cache fails.
 *
 * @returns Exchange rates for supported currencies vs USD
 * @throws {Error} When both cache and API request fail
 */
export async function fetchExchangeRatesWithCache(): Promise<ExchangeRates> {
  const cacheKey = cacheKeys.exchangeRates();

  // Try cache first
  const cached = await redis.get<ExchangeRates>(cacheKey);

  if (cached) {
    loggers.cache.debug("HIT: Exchange rates (1h cache)");

    return cached;
  }

  // Cache miss - fetch fresh data
  loggers.cache.debug("MISS: Exchange rates - fetching from CoinGecko");
  const rates = await fetchExchangeRates();

  // Cache for 1 hour (exchange rates change slowly)
  await redis.set(cacheKey, rates, CACHE_TTL.EXCHANGE_RATES).catch((err) => {
    loggers.cache.error("Failed to cache exchange rates:", err);
  });

  return rates;
}

/**
 * Convert currency value to USD using exchange rate
 *
 * @param value - Amount in the foreign currency
 * @param rate - Exchange rate (1 USD = X currency)
 * @returns Value in USD
 */
export function convertToUSD(value: number, rate: number): number {
  if (rate === 0) return 0;

  return value / rate;
}
