import "server-only";

import {
  getUnifiedProtocol,
  getManyUnifiedProtocols,
  setUnifiedProtocol,
  setManyUnifiedProtocols,
  toUnifiedProtocolData,
  mergeProtocolData,
  UnifiedProtocolData,
} from "./unified-protocol-cache";

import { getStaleWhileRevalidate } from "@/lib/cache/swr-cache";
import { CACHE_TTL } from "@/lib/cache";
import { DeFiLlamaProtocol, fetchHistoricalChainTVL, fetchProtocolHistoricalTVL, fetchSingleTVL, fetchTVL } from "@/lib/services/defillama";
import { DefiStatsAggregate, Protocol } from "@/lib/types/defi-stats";
import { loggers } from "@/lib/utils/logger";

// ============================================================================
// CONSTANTS
// ============================================================================

const CACHE_KEY_ALL_PROTOCOLS = "defi:protocols:all";
const TOP_PROTOCOLS_LIMIT = 6;

// ============================================================================
// PROTOCOL FILTERING & TRANSFORMATION
// ============================================================================

/**
 * Filter protocols that are exclusively on Solana (not multi-chain or CEX)
 */
function filterSolanaOnlyProtocols(protocols: DeFiLlamaProtocol[]): DeFiLlamaProtocol[] {
  return protocols.filter(
    (protocol) => protocol?.chains?.length === 1 && protocol.chains.includes("Solana") && protocol.category !== "CEX"
  );
}

export function deriveProtocolSlugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Transform DeFiLlama protocol to standardized Protocol format
 */
function transformProtocolToStandard(protocol: DeFiLlamaProtocol, dataSource: "overview" | "list" = "list"): Protocol {
  return {
    id: protocol.slug || deriveProtocolSlugFromName(protocol.name),
    name: protocol.name,
    logo: protocol.logo || "/logo.svg",
    // @ts-ignore - chainTvls exists but not in type definition
    tvl: dataSource === "list" ? protocol.chainTvls?.["Solana"] : protocol.currentChainTvls?.["Solana"],
    tvlChartData: protocol.chainTvls?.["Solana"],
    change1D: protocol.change_1d,
    change7D: protocol.change_7d,
    change1H: protocol.change_1h,
    category: protocol.category,
    chains: protocol.chains,
    slug: protocol.slug,
    description: protocol.description,
    url: protocol.url,
    twitter: protocol.twitter,
    github: protocol.github,
    otherProtocols: protocol.otherProtocols,
  };
}

// ============================================================================
// DATA CALCULATIONS
// ============================================================================

/**
 * Calculate 24-hour TVL change percentage from historical data
 */
function calculateTvlChange(historicalData: any[]): number {
  const dataLength = historicalData.length;

  if (dataLength < 2) {
    return 0;
  }

  const currentTvl = historicalData[dataLength - 1].tvl;
  const previousTvl = historicalData[dataLength - 2].tvl;

  return ((currentTvl - previousTvl) / previousTvl) * 100;
}

/**
 * Get current TVL from historical data
 */
function getCurrentTvl(historicalData: any[]): number {
  return historicalData[historicalData.length - 1]?.tvl ?? 0;
}

/**
 * Filter and sort protocols by 24h growth to get top performers
 */
function getTopProtocolsByGrowth(protocols: Protocol[], limit: number = TOP_PROTOCOLS_LIMIT): Protocol[] {
  return [...protocols]
    .filter((p) => p.change1D && p.change1D > 0)
    .sort((a, b) => (b.change1D || 0) - (a.change1D || 0))
    .slice(0, limit);
}

// ============================================================================
// CHART DATA GENERATION
// ============================================================================

/**
 * Format Unix timestamp to readable date string
 */
function formatChartDate(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Transform historical TVL data to chart format
 */
function transformHistoricalDataToChartFormat(historicalData: any[]) {
  return historicalData.map((item) => ({
    date: formatChartDate(item.date),
    value: item.tvl,
  }));
}

/**
 * Generate mock inflows chart data (fees & revenue)
 * TODO: Replace with real data when available
 */
function generateInflowsChartData(fees: number, revenue: number) {
  const days = 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const variation = 0.8 + Math.random() * 0.4;

    data.push({
      date: date.toISOString().split("T")[0],
      value: fees * variation,
      value2: revenue * variation,
    });
  }

  return data;
}

// ============================================================================
// HELPER DATA STRUCTURES
// ============================================================================

/**
 * Build empty DeFi statistics (fallback for errors)
 */
function buildEmptyDefiStats(): DefiStatsAggregate {
  return {
    change1D: 0,
    chartData: [],
    inflows: { change_1d: 0, chartData: [] },
    solanaProtocols: [],
    hotProtocols: [],
    numberOfProtocols: 0,
    totalTvl: 0,
    totalRevenue_1d: 0,
    totalFees_1d: 0,
  };
}

/**
 * Build complete DeFi statistics aggregate
 */
function buildDefiStatsAggregate(
  protocols: Protocol[],
  hotProtocols: Protocol[],
  totalTvl: number,
  tvlChange: number,
  chartData: any[]
): DefiStatsAggregate {
  const totalFees = 0; // TODO: Fetch real fees data
  const totalRevenue = 0; // TODO: Fetch real revenue data

  return {
    change1D: tvlChange,
    chartData,
    inflows: {
      change_1d: tvlChange * 0.5, // Estimated relationship
      chartData: generateInflowsChartData(totalFees, totalRevenue),
    },
    solanaProtocols: protocols,
    hotProtocols,
    numberOfProtocols: protocols.length,
    totalTvl,
    totalRevenue_1d: totalRevenue,
    totalFees_1d: totalFees,
  };
}

// ============================================================================
// CACHE OPERATIONS
// ============================================================================

/**
 * Get cached DeFi statistics
 */
async function fetchFreshProtocolsData(): Promise<DefiStatsAggregate> {
  loggers.cache.debug(`→ Fetching from DeFiLlama: All protocols`);

  // Fetch data from DeFiLlama
  const [allProtocols, historicalTVL] = await Promise.all([fetchTVL(), fetchHistoricalChainTVL()]);

  // Filter and transform protocols
  const solanaOnlyProtocols = filterSolanaOnlyProtocols(allProtocols);
  const standardizedProtocols = solanaOnlyProtocols.map((p) => transformProtocolToStandard(p));

  // Calculate statistics
  const totalTvl = getCurrentTvl(historicalTVL);
  const tvlChange = calculateTvlChange(historicalTVL);
  const hotProtocols = getTopProtocolsByGrowth(standardizedProtocols);

  // Generate chart data
  const chartData = transformHistoricalDataToChartFormat(historicalTVL);

  // Build result - use individual protocols instead of merged aggregates
  const result = buildDefiStatsAggregate(standardizedProtocols, hotProtocols, totalTvl, tvlChange, chartData);

  // Batch cache individual protocols for detail pages (non-blocking)
  cacheIndividualProtocolsAsync(standardizedProtocols);

  return result;
}

/**
 * Cache individual protocols asynchronously (fire-and-forget)
 * Uses batch operations for efficiency
 * Merges with existing cache to preserve overview data (otherProtocols)
 */
function cacheIndividualProtocolsAsync(protocols: Protocol[]): void {
  (async () => {
    try {
      const startTime = performance.now();

      // Get existing cache entries for merging
      const protocolIds = protocols.map((p) => p.slug || p.id);
      const existingCache = await getManyUnifiedProtocols(protocolIds);

      // Merge list data with existing cache (preserves overview data)
      const batchData = protocols.map((protocol) => {
        const protocolId = protocol.slug || protocol.id;
        const existing = existingCache.get(protocolId);

        const unifiedData = toUnifiedProtocolData(protocol, "list");

        // Merge with existing cache if present
        const merged = existing ? mergeProtocolData(existing, unifiedData, "list") : unifiedData;

        return {
          id: protocolId,
          data: merged,
        };
      });

      await setManyUnifiedProtocols(batchData, CACHE_TTL.GLOBAL_STATS);

      const duration = performance.now() - startTime;

      loggers.cache.debug(`✓ Cached ${protocols.length} individual protocols in ${duration.toFixed(0)}ms (batched)`);
    } catch (error) {
      loggers.cache.error("Failed to batch cache individual protocols:", error);
    }
  })();
}

// ============================================================================
// MAIN DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch all Solana DeFi protocols with aggregated statistics
 *
 * STRATEGY:
 * Uses centralized SWR (Stale-While-Revalidate) pattern:
 * 1. Check Redis cache first
 * 2. If cached and fresh → return immediately
 * 3. If cached but stale → return stale data, refresh in background
 * 4. If no cache → fetch from DeFiLlama and cache
 * 5. Filter Solana-only protocols
 * 6. Calculate aggregated statistics
 * 7. Store in cache for 5 minutes
 *
 * Called directly from the DeFi page (Server Component)
 */
export async function fetchProtocolsData(): Promise<DefiStatsAggregate> {
  try {
    const result = await getStaleWhileRevalidate<DefiStatsAggregate>(
      CACHE_KEY_ALL_PROTOCOLS,
      CACHE_TTL.MARKET_DATA,
      fetchFreshProtocolsData
    );

    return result || buildEmptyDefiStats();
  } catch (error) {
    loggers.data.error("Error fetching DeFi protocols data:", error);

    return buildEmptyDefiStats();
  }
}

/**
 * Fetch a specific DeFi protocol by slug
 *
 * STRATEGY:
 * 1. Check unified cache first
 * 2. If cached with overview data → return immediately
 * 3. If no cache or only list data → fetch from DeFiLlama
 * 4. Merge overview data with existing cache
 * 5. Store merged result in cache
 *
 * Called directly from the protocol detail page
 */
export async function fetchProtocolData(slug: string): Promise<UnifiedProtocolData | null> {
  try {
    const cached = await getUnifiedProtocol(slug);

    // Check if we already have full overview data
    if (cached && (cached.dataSource === "overview" || cached.dataSource === "merged")) {
      loggers.cache.debug(`✓ Using existing overview data: ${cached.name}`);

      return cached;
    }

    loggers.cache.debug(`→ Fetching from DeFiLlama: ${slug}${cached ? " (upgrading list to overview)" : ""}`);

    const [singleProtocol, historicalTVL] = await Promise.all([
      fetchSingleTVL(slug),
      fetchProtocolHistoricalTVL(slug).catch((error) => {
        // If historical data fetch fails, continue without it
        loggers.data.debug(`Failed to fetch historical TVL for ${slug}:`, error);

        return [];
      }),
    ]);

    // Transform to standard protocol format
    const protocol = transformProtocolToStandard(singleProtocol, "overview");

    if (!protocol) {
      loggers.data.warn(`Protocol not found: ${slug}`);

      return null;
    }

    // Add historical TVL chart data if available
    if (historicalTVL && historicalTVL.length > 0) {
      protocol.tvlChartData = historicalTVL;
    }

    // Merge with existing cache (preserves list data for TVL/change)
    const unifiedData = toUnifiedProtocolData(protocol, "overview");
    const merged = cached ? mergeProtocolData(cached, unifiedData, "overview") : unifiedData;

    // Cache merged result (non-blocking)
    setUnifiedProtocol(slug, merged).catch((err) => {
      loggers.cache.error(`Failed to cache protocol ${slug}:`, err);
    });

    return merged;
  } catch (error) {
    loggers.data.error(`Error fetching protocol ${slug}:`, error);

    return null;
  }
}
