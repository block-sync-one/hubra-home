import { fetchStablecoinData, type StablecoinData } from "@/lib/data/stablecoin-data";
import { withCache, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";
import { formatBigNumbers } from "@/lib/utils";

/**
 * Build standardized stablecoin API response
 */
function buildStablecoinResponse(data: StablecoinData) {
  return {
    success: true,
    data: {
      chain: data.name,
      symbol: data.symbol,
      totalCirculating: data.totalCirculating,
      totalCirculatingUSD: data.totalCirculatingUSD,
      change24h: data.change24h,
      breakdown: {
        usd: data.peggedUSD,
        eur: data.peggedEUR,
        jpy: data.peggedJPY,
        chf: data.peggedCHF,
        aud: data.peggedAUD,
        brl: data.peggedBRL,
        gbp: data.peggedGBP,
        try: data.peggedTRY,
        other: data.peggedOther,
      },
      geckoId: data.geckoId,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * GET /api/crypto/stablecoins
 *
 * Returns Solana stablecoin market data from DeFiLlama
 *
 * Response includes:
 * - Total circulating for Solana chain
 * - Breakdown by currency type (USD, EUR, JPY, Other)
 *
 * Data is cached for 24 hours via withCache
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/crypto/stablecoins');
 * const { data } = await response.json();
 * console.log(`Total: $${data.totalCirculating}`);
 * ```
 */
export async function GET() {
  return withCache(cacheKeys.stablecoinChains(), CACHE_TTL.STABLECOIN_DATA, async () => {
    loggers.api.debug("[Stablecoins API] Fetching data");

    const data = await fetchStablecoinData();

    loggers.api.debug(`[Stablecoins API] ✓ $${formatBigNumbers(data.totalCirculatingUSD)} USD total`);

    return buildStablecoinResponse(data);
  });
}
