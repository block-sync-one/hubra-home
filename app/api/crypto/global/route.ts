import { fetchStablecoinData } from "@/lib/data/stablecoin-data";
import { withCache, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

/**
 * GET /api/crypto/global
 *
 * Returns stablecoin market statistics only
 *
 * Response includes:
 * - Stablecoins TVL with 24h change (from DeFiLlama)
 *
 * Market data and Solana TVL are now calculated client-side from TokensPage data
 * Data is cached for 15 minutes via withCache
 */

export async function GET() {
  return withCache(cacheKeys.globalStats(), CACHE_TTL.GLOBAL_STATS, async () => {
    loggers.api.debug("[Global API] Fetching stablecoin data");

    const stablecoinData = await fetchStablecoinData().catch((err) => {
      loggers.api.error("[Global API] Stablecoin fetch failed:", err);

      return { totalCirculatingUSD: 0, change24h: 0 };
    });

    loggers.api.debug(`[Global API] Stablecoins TVL: $${stablecoinData.totalCirculatingUSD} (${stablecoinData.change24h}%)`);

    return {
      data: {
        stablecoins_tvl: stablecoinData.totalCirculatingUSD,
        stablecoins_tvl_change: stablecoinData.change24h,
        updated_at: Math.floor(Date.now() / 1000),
      },
    };
  });
}
