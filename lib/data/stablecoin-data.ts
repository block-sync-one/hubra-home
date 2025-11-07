import "server-only";

import {
  fetchSolanaStablecoins,
  fetchSolanaStablecoinsWithChange,
  fetchSolanaTVLWithChange,
  type StablecoinChainData,
  getTotalCirculating,
} from "@/lib/services/defillama";
import { fetchExchangeRatesWithCache, convertToUSD, EXCLUDED_CURRENCIES } from "@/lib/services/coingecko";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

export interface StablecoinData {
  id: string;
  name: string;
  symbol: string;
  totalCirculating: number;
  totalCirculatingUSD: number;
  change24h: number;
  peggedUSD: number;
  peggedEUR: number;
  peggedJPY: number;
  peggedCHF: number;
  peggedAUD: number;
  peggedBRL: number;
  peggedGBP: number;
  peggedTRY: number;
  peggedOther: number;
  geckoId: string | null;
}

export interface SolanaTVLCachedData {
  tvl: number;
  change24h: number;
}

/**
 * Extract pegged currency values
 */
function extractPeggedValues(pegged: StablecoinChainData["totalCirculatingUSD"]) {
  return {
    usd: pegged.peggedUSD ?? 0,
    eur: pegged.peggedEUR ?? 0,
    jpy: pegged.peggedJPY ?? 0,
    chf: pegged.peggedCHF ?? 0,
    aud: pegged.peggedAUD ?? 0,
    brl: pegged.peggedREAL ?? 0, // REAL → BRL mapping
    gbp: pegged.peggedGBP ?? 0,
    try: pegged.peggedTRY ?? 0,
  };
}

/**
 * Calculate "other" currencies excluding known and excluded ones
 */
function calculateOtherPegs(pegged: StablecoinChainData["totalCirculatingUSD"]): number {
  const knownKeys = ["peggedUSD", "peggedEUR", "peggedJPY", "peggedCHF", "peggedAUD", "peggedREAL", "peggedGBP", "peggedTRY"];

  return Object.entries(pegged)
    .filter(([key]) => !knownKeys.includes(key) && !EXCLUDED_CURRENCIES.includes(key.replace("pegged", "") as any))
    .reduce((sum, [, value]) => sum + (value ?? 0), 0);
}

/**
 * Transform DeFiLlama stablecoin chain data to our StablecoinData type
 * Converts all pegged currencies to USD using CoinGecko exchange rates
 */
async function transformStablecoinData(chainData: StablecoinChainData, change24h: number = 0): Promise<StablecoinData> {
  const totalCirculating = getTotalCirculating(chainData);
  const pegged = extractPeggedValues(chainData.totalCirculatingUSD);
  const peggedOther = calculateOtherPegs(chainData.totalCirculatingUSD);

  // Fetch exchange rates with 1-hour cache and convert to USD
  const exchangeRates = await fetchExchangeRatesWithCache().catch((err) => {
    loggers.data.warn("Failed to fetch exchange rates, using raw values:", err);

    return null;
  });

  const totalCirculatingUSD = exchangeRates
    ? pegged.usd +
      convertToUSD(pegged.eur, exchangeRates.eur) +
      convertToUSD(pegged.jpy, exchangeRates.jpy) +
      convertToUSD(pegged.chf, exchangeRates.chf) +
      convertToUSD(pegged.aud, exchangeRates.aud) +
      convertToUSD(pegged.brl, exchangeRates.brl) +
      convertToUSD(pegged.gbp, exchangeRates.gbp) +
      convertToUSD(pegged.try, exchangeRates.try ?? 0) +
      peggedOther
    : totalCirculating;

  return {
    id: chainData.name.toLowerCase().replace(/\s+/g, "-"),
    name: chainData.name,
    symbol: chainData.tokenSymbol,
    totalCirculating,
    totalCirculatingUSD,
    change24h,
    peggedUSD: pegged.usd,
    peggedEUR: pegged.eur,
    peggedJPY: pegged.jpy,
    peggedCHF: pegged.chf,
    peggedAUD: pegged.aud,
    peggedBRL: pegged.brl,
    peggedGBP: pegged.gbp,
    peggedTRY: pegged.try,
    peggedOther,
    geckoId: chainData.gecko_id,
  };
}

/**
 * Generic cache wrapper for data fetching
 */
async function withDataCache<T>(cacheKey: string, fetchFn: () => Promise<T>, cacheName: string): Promise<T> {
  const cached = await redis.get<T>(cacheKey);

  if (cached) {
    loggers.cache.debug(`HIT: ${cacheName} (15min cache)`);

    return cached;
  }

  loggers.cache.debug(`MISS: Fetching ${cacheName} from DeFiLlama`);

  const data = await fetchFn();

  redis.set(cacheKey, data, CACHE_TTL.STABLECOIN_DATA).catch((err) => {
    loggers.cache.error(`${cacheName} cache failed:`, err);
  });

  return data;
}

/**
 * Fetch Solana stablecoin data with 24h change and USD conversion
 *
 * Caching strategy:
 * - Cache key: global:stablecoin
 * - TTL: 15 minutes
 * - Includes 24h change calculation from historical data
 * - Converts all currencies to USD using CoinGecko exchange rates
 * - Shared cache between API routes and server components
 *
 * @returns Solana stablecoin data with 24h change and USD conversion
 */
export async function fetchStablecoinData(): Promise<StablecoinData> {
  return withDataCache(
    cacheKeys.stablecoinChains(),
    async () => {
      const [solanaChainData, historicalData] = await Promise.all([
        fetchSolanaStablecoins(),
        fetchSolanaStablecoinsWithChange().catch(() => null),
      ]);

      const finalData = await transformStablecoinData(solanaChainData, historicalData?.change24h ?? 0);

      loggers.cache.debug(
        `✓ Solana stablecoin: Raw $${(finalData.totalCirculating / 1e9).toFixed(2)}B, ` +
          `USD $${(finalData.totalCirculatingUSD / 1e9).toFixed(2)}B (${finalData.change24h.toFixed(2)}%)`
      );

      return finalData;
    },
    "Solana stablecoin data"
  );
}

/**
 * Fetch Solana TVL data with 24h change from DeFiLlama API
 *
 * Caching strategy:
 * - Cache key: global:totalTVL
 * - TTL: 15 minutes
 * - Includes 24h change calculation from historical data
 * - Shared cache between API routes and server components
 *
 * @returns Solana TVL data with 24h change
 */
export async function fetchSolanaTVLData(): Promise<SolanaTVLCachedData> {
  return withDataCache(
    cacheKeys.globalSolanaTVL(),
    async () => {
      const tvlData = await fetchSolanaTVLWithChange();

      loggers.cache.debug(`✓ Solana TVL: $${(tvlData.tvl / 1e9).toFixed(2)}B (${tvlData.change24h.toFixed(2)}%)`);

      return tvlData;
    },
    "Solana TVL data"
  );
}
