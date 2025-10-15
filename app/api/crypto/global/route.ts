import { fetchMarketData } from "@/lib/data/market-data";
import { withCache, cacheKeys, CACHE_TTL } from "@/lib/cache";

export async function GET() {
  return withCache(cacheKeys.globalStats(), CACHE_TTL.GLOBAL_STATS, async () => {
    const tokens = await fetchMarketData(100, 0);

    const totalMarketCap = tokens.reduce((sum, t) => sum + (t.marketCap || 0), 0);
    const totalVolume = tokens.reduce((sum, t) => sum + (t.rawVolume || 0), 0);
    const totalMarketCapChange = tokens.reduce((sum, t) => {
      const weight = (t.marketCap || 0) / totalMarketCap;

      return sum + weight * (t.change || 0);
    }, 0);

    const solToken = tokens.find((t) => t.symbol === "SOL");

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
          sol: solToken?.marketCap || 0,
          usdc: 0,
        },
        market_cap_change_percentage_24h_usd: totalMarketCapChange,
        updated_at: Math.floor(Date.now() / 1000),
        new_tokens: 0,
        sol_tvl: 0,
        sol_tvl_change: 0,
        stablecoins_tvl: 0,
        stablecoins_tvl_change: 0,
      },
    };
  });
}
