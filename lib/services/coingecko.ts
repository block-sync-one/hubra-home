/**
 * CoinGecko API Service
 *
 * Provides access to CoinGecko API for exchange rates
 * @see https://docs.coingecko.com/
 */

import "server-only";

import { cacheKeys, CACHE_TTL, redis } from "@/lib/cache/redis";
import { loggers } from "@/lib/utils/logger";

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
 * Fetch exchange rates from CoinGecko using Bitcoin as reference
 *
 * Uses Bitcoin price in multiple currencies to calculate relative exchange rates.
 * Example: if BTC = 50000 USD and BTC = 45000 EUR, then 1 USD = 0.9 EUR
 *
 * @returns Exchange rates for supported currencies vs USD
 * @throws {Error} When API request fails
 */
export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Determine API base URL based on whether we have a Pro API key
    const isPro = !!process.env.COINGECKO_PRO_API_KEY;
    const baseUrl = isPro ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";

    // Build query parameters
    const params = new URLSearchParams({
      ids: "bitcoin",
      vs_currencies: "usd,eur,jpy,chf,aud,brl,gbp,try",
    });

    // Add API key if using Pro
    if (isPro && process.env.COINGECKO_PRO_API_KEY) {
      params.append("x_cg_pro_api_key", process.env.COINGECKO_PRO_API_KEY);
    }

    const url = `${baseUrl}/simple/price?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("CoinGecko rate limit exceeded. Please try again later.");
      }
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.bitcoin) {
      throw new Error("Invalid response from CoinGecko API");
    }

    const btcPrices = data.bitcoin;
    const usdPrice = btcPrices.usd;

    if (!usdPrice || usdPrice === 0) {
      throw new Error("Invalid USD price from CoinGecko");
    }

    // Calculate exchange rates relative to USD (1 USD = X currency)
    return {
      usd: 1,
      eur: (btcPrices.eur || 0) / usdPrice,
      jpy: (btcPrices.jpy || 0) / usdPrice,
      chf: (btcPrices.chf || 0) / usdPrice,
      aud: (btcPrices.aud || 0) / usdPrice,
      brl: (btcPrices.brl || 0) / usdPrice,
      gbp: (btcPrices.gbp || 0) / usdPrice,
      try: btcPrices.try ? btcPrices.try / usdPrice : undefined,
    };
  } catch (err) {
    loggers.data.error("Failed to fetch exchange rates from CoinGecko:", err);
    throw new Error("Failed to fetch exchange rates from CoinGecko");
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
