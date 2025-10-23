import { fetchMarketData } from "@/lib/data/market-data";
import { fetchStablecoinData, fetchSolanaTVLData } from "@/lib/data/stablecoin-data";
import { withCache, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

/**
 * GET /api/crypto/global
 *
 * Returns global cryptocurrency market statistics
 *
 * Response includes:
 * - Total market cap and volume
 * - Market cap change percentage
 * - Active cryptocurrencies count
 * - Solana TVL with 24h change (from DeFiLlama)
 * - Stablecoins TVL with 24h change (from DeFiLlama)
 *
 * Data is cached for 15 minutes via withCache
 */

/**
 * Calculate weighted market cap change
 */
function calculateMarketCapChange(tokens: any[], totalMarketCap: number): number {
  return tokens.reduce((sum, token) => {
    const weight = (token.marketCap || 0) / (totalMarketCap || 1);

    return sum + weight * (token.change || 0);
  }, 0);
}

export async function GET() {
  return withCache(cacheKeys.globalStats(), CACHE_TTL.GLOBAL_STATS, async () => {
    loggers.api.debug("[Global API] Fetching global market data");

    const [tokens, stablecoinData, solanaTVLData] = await Promise.all([
      fetchMarketData(100, 0),
      fetchStablecoinData().catch((err) => {
        loggers.api.error("[Global API] Stablecoin fetch failed:", err);

        return { totalCirculating: 0, change24h: 0, peggedUSD: 0, peggedEUR: 0, peggedJPY: 0, peggedOther: 0 } as any;
      }),
      fetchSolanaTVLData().catch((err) => {
        loggers.api.error("[Global API] Solana TVL fetch failed:", err);

        return { tvl: 0, change24h: 0 };
      }),
    ]);

    const totalMarketCap = tokens.reduce((sum, t) => sum + (t.marketCap || 0), 0);
    const totalVolume = tokens.reduce((sum, t) => sum + (t.rawVolume || 0), 0);
    const totalMarketCapChange = calculateMarketCapChange(tokens, totalMarketCap);

    const solToken = tokens.find((t) => t.symbol === "SOL");

    loggers.api.debug(`[Global API] Total Market Cap: $${totalMarketCap}`);
    loggers.api.debug(`[Global API] Solana TVL: $${solanaTVLData.tvl} (${solanaTVLData.change24h}%)`);
    loggers.api.debug(`[Global API] Stablecoins TVL: $${stablecoinData.totalCirculatingUSD} (${stablecoinData.change24h}%)`);

    return {
      data: {
        active_cryptocurrencies: tokens.length,
        upcoming_icos: 0,
        ongoing_icos: 0,
        ended_icos: 0,
        markets: tokens.length * 2,
        total_market_cap: { usd: totalMarketCap },
        total_volume: { usd: totalVolume },
        market_cap_percentage: {
          sol: solToken?.marketCap ?? 0,
          usdc: 0,
        },
        market_cap_change_percentage_24h_usd: totalMarketCapChange,
        updated_at: Math.floor(Date.now() / 1000),
        new_tokens: 0,
        solana_tvl: solanaTVLData.tvl,
        solana_tvl_change: solanaTVLData.change24h,
        stablecoins_tvl: stablecoinData.totalCirculatingUSD,
        stablecoins_tvl_change: stablecoinData.change24h,
      },
    };
  });
}
