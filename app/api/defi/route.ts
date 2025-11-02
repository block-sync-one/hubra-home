import { withCache } from "@/lib/cache/api-cache";
import { CACHE_TTL } from "@/lib/cache";
import { fetchTVL } from "@/lib/services/defillama";
import { DefiStatsAggrigate, Protocol } from "@/lib/types/defi-stats";

const CACHE_KEY = "defi:protocols:all";

/**
 * GET /api/defi
 * Fetch aggregated DeFi statistics for Solana protocols
 */
export async function GET() {
  return withCache(
    CACHE_KEY,
    CACHE_TTL.GLOBAL_STATS,
    async () => {
      try {
        const tvlData = await fetchTVL();

        // Filter for Solana protocols
        const solanaProtocols = tvlData.protocols
          .filter((protocol: any) => protocol.chains?.includes("Solana") || protocol.chain === "Solana")
          .map(
            (protocol: any): Protocol => ({
              id: protocol.slug || protocol.name.toLowerCase().replace(/\s+/g, "-"),
              name: protocol.name,
              logo: protocol.logo || "/logo.svg",
              tvl: protocol.tvl || 0,
              change_1d: protocol.change_1d,
              change_7d: protocol.change_7d,
              change_1m: protocol.change_1m,
              category: protocol.category,
              chains: protocol.chains,
              slug: protocol.slug,
              description: protocol.description,
              url: protocol.url,
              twitter: protocol.twitter,
              github: protocol.github,
            })
          )
          .sort((a: Protocol, b: Protocol) => (b.tvl || 0) - (a.tvl || 0));

        // Calculate total TVL for Solana
        const totalTvl = solanaProtocols.reduce((sum: number, p: Protocol) => sum + (p.tvl || 0), 0);

        // Calculate 24h change weighted by TVL
        const change_1d = solanaProtocols.reduce((sum: number, p: Protocol) => {
          const weight = (p.tvl || 0) / totalTvl;

          return sum + (p.change_1d || 0) * weight;
        }, 0);

        // Get top protocols by 24h growth
        const hotProtocols = [...solanaProtocols]
          .filter((p: Protocol) => p.change_1d && p.change_1d > 0)
          .sort((a: Protocol, b: Protocol) => (b.change_1d || 0) - (a.change_1d || 0))
          .slice(0, 6);

        // Generate chart data (last 30 days)
        const chartData = generateChartData(totalTvl, change_1d);

        // Calculate fees and revenue (placeholder - would need actual data)
        const totalFees_1d = totalTvl * 0.001; // Estimated 0.1% daily
        const totalRevenue_1d = totalFees_1d * 0.3; // Estimated 30% revenue

        const result: DefiStatsAggrigate = {
          change_1d,
          chartData,
          inflows: {
            change_1d: change_1d * 0.5, // Estimated
            chartData: generateInflowsChartData(totalFees_1d, totalRevenue_1d),
          },
          solanaProtocols,
          hotProtocols,
          numberOfProtocols: solanaProtocols.length,
          totalTvl,
          totalRevenue_1d,
          totalFees_1d,
        };

        return result;
      } catch (error) {
        console.error("Error fetching DeFi data:", error);
        throw error;
      }
    },
    {
      change_1d: 0,
      chartData: [],
      inflows: { change_1d: 0, chartData: [] },
      solanaProtocols: [],
      hotProtocols: [],
      numberOfProtocols: 0,
      totalTvl: 0,
      totalRevenue_1d: 0,
      totalFees_1d: 0,
    }
  );
}

/**
 * Generate mock chart data for TVL history
 * In production, this would come from historical data
 */
function generateChartData(currentTvl: number, change_1d: number) {
  const days = 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    // Simple linear interpolation (would be real historical data in production)
    const progress = (days - i) / days;
    const value = currentTvl * (1 - (change_1d / 100) * (1 - progress));

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, value),
    });
  }

  return data;
}

/**
 * Generate mock chart data for inflows (fees & revenue)
 */
function generateInflowsChartData(fees: number, revenue: number) {
  const days = 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    // Add some variation
    const variation = 0.8 + Math.random() * 0.4;

    data.push({
      date: date.toISOString().split("T")[0],
      value: fees * variation,
      value2: revenue * variation,
    });
  }

  return data;
}
