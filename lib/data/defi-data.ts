import "server-only";

import { getCachedProtocol, setCachedProtocol, setManyProtocols } from "./protocol-cache";

import { getStaleWhileRevalidate } from "@/lib/cache/swr-cache";
import { CACHE_TTL } from "@/lib/cache";
import { DeFiLlamaProtocol, fetchHistoricalChainTVL, fetchSingleTVL, fetchTVL } from "@/lib/services/defillama";
import { DefiStatsAggregate, ProtocolAggregate, Protocol } from "@/lib/types/defi-stats";
import { loggers } from "@/lib/utils/logger";
import { extractBaseName } from "@/lib/helpers";

// ============================================================================
// CONSTANTS
// ============================================================================

const CACHE_KEY_ALL_PROTOCOLS = "defi:protocols:all";
const TOP_PROTOCOLS_LIMIT = 6;
const JITO_ICON_URL = "https://icons.llamao.fi/icons/protocols/jito";

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

/**
 * Transform DeFiLlama protocol to standardized Protocol format
 */
function transformProtocolToStandard(protocol: DeFiLlamaProtocol): Protocol {
  return {
    id: protocol.slug || protocol.name.toLowerCase().replace(/\s+/g, "-"),
    name: protocol.name,
    logo: protocol.logo || "/logo.svg",
    // @ts-ignore - chainTvls exists but not in type definition
    tvl: protocol.chainTvls?.["Solana"] || 0,
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
  };
}

// ============================================================================
// PROTOCOL GROUPING & MERGING
// ============================================================================

/**
 * Group protocols by their base name (e.g., "Jito Stakes" and "Jito SOL" → "jito")
 */
function groupProtocolsByName(protocols: Protocol[]): Map<string, Protocol[]> {
  const groups = new Map<string, Protocol[]>();

  protocols.forEach((protocol) => {
    const baseName = extractBaseName(protocol.name);

    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }

    groups.get(baseName)!.push(protocol);
  });

  return groups;
}

/**
 * Calculate aggregated TVL for a group of protocols
 */
function calculateGroupTvl(protocols: Protocol[]): number {
  return protocols.reduce((sum, p) => sum + (p.tvl || 0), 0);
}

/**
 * Get maximum change value from a group of protocols
 */
function getMaxChange(protocols: Protocol[], field: "change1D" | "change7D" | "change1H"): number {
  return Math.max(...protocols.map((p) => p[field] || 0));
}

/**
 * Get protocol logo URL (special case for Jito)
 */
function getProtocolLogo(protocol: Protocol): string {
  const baseSlug = protocol.slug?.split("-")[0];

  return baseSlug === "jito" ? JITO_ICON_URL : protocol.logo;
}

/**
 * Merge a group of similar protocols into a single aggregated protocol
 */
function mergeProtocolGroup(group: Protocol[]): ProtocolAggregate {
  const firstProtocol = group[0];

  return {
    id: firstProtocol.slug?.split("-")[0] || firstProtocol.id,
    name: extractBaseName(firstProtocol.name),
    logo: getProtocolLogo(firstProtocol),
    tvl: calculateGroupTvl(group),
    change1D: getMaxChange(group, "change1D"),
    change7D: getMaxChange(group, "change7D"),
    change1H: getMaxChange(group, "change1H"),
    category: group.map((p) => p.category),
    breakdown: [...group],
  } as ProtocolAggregate;
}

/**
 * Merge all protocol groups into aggregated protocols
 */
function mergeProtocolGroups(groups: Map<string, Protocol[]>): ProtocolAggregate[] {
  return Array.from(groups.values()).map(mergeProtocolGroup);
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

/**
 * Generate mock TVL chart data for single protocol
 * TODO: Replace with real historical data when available
 */
function generateMockProtocolChartData(currentTvl: number, change24h: number) {
  const days = 30;
  const data = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    const progress = (days - i) / days;
    const value = currentTvl * (1 - (change24h / 100) * (1 - progress));

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, value),
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
  mergedProtocols: ProtocolAggregate[],
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
    solanaProtocols: mergedProtocols,
    hotProtocols,
    numberOfProtocols: mergedProtocols.length,
    totalTvl,
    totalRevenue_1d: totalRevenue,
    totalFees_1d: totalFees,
  };
}

// ============================================================================
// PROTOCOL SEARCH
// ============================================================================

/**
 * Find a protocol by slug, id, or name
 */
function findProtocolBySlug(protocols: DeFiLlamaProtocol[], slug: string): DeFiLlamaProtocol | undefined {
  const normalizedSlug = slug.toLowerCase();

  return protocols.find(
    (p) => p.slug === normalizedSlug || p.id === normalizedSlug || p.name.toLowerCase().replace(/\s+/g, "-") === normalizedSlug
  );
}

/**
 * Build protocol detail statistics
 */
function buildProtocolStats(protocol: DeFiLlamaProtocol): DefiStatsAggregate {
  const protocolTvl = protocol.tvl || 0;
  const protocolChange = protocol.change_1d || 0;

  // Calculate estimated fees and revenue
  const totalFees = protocolTvl * 0.001; // 0.1% daily estimate
  const totalRevenue = totalFees * 0.3; // 30% revenue estimate

  return {
    change1D: protocolChange,
    chartData: generateMockProtocolChartData(protocolTvl, protocolChange),
    inflows: {
      change_1d: protocolChange * 0.5,
      chartData: generateInflowsChartData(totalFees, totalRevenue),
    },
    solanaProtocols: [],
    hotProtocols: [],
    numberOfProtocols: 1,
    totalTvl: protocolTvl,
    totalRevenue_1d: totalRevenue,
    totalFees_1d: totalFees,
    name: protocol.name,
    description: protocol.description,
    logo: protocol.logo,
    tvl: protocolTvl,
    twitter: protocol.twitter,
    github: protocol.github,
    url: protocol.url,
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
  const standardizedProtocols = solanaOnlyProtocols.map(transformProtocolToStandard);

  // Group and merge similar protocols
  const protocolGroups = groupProtocolsByName(standardizedProtocols);
  const mergedProtocols = mergeProtocolGroups(protocolGroups);

  // Calculate statistics
  const totalTvl = getCurrentTvl(historicalTVL);
  const tvlChange = calculateTvlChange(historicalTVL);
  const hotProtocols = getTopProtocolsByGrowth(standardizedProtocols);

  // Generate chart data
  const chartData = transformHistoricalDataToChartFormat(historicalTVL);

  // Build result
  const result = buildDefiStatsAggregate(mergedProtocols, hotProtocols, totalTvl, tvlChange, chartData);

  // Batch cache individual protocols for detail pages (non-blocking)
  cacheIndividualProtocolsAsync(mergedProtocols);

  return result;
}

/**
 * Cache individual protocols asynchronously (fire-and-forget)
 * Uses batch operations for efficiency
 */
function cacheIndividualProtocolsAsync(protocols: ProtocolAggregate[]): void {
  (async () => {
    try {
      const startTime = performance.now();

      const batchData = protocols.map((protocol) => ({
        id: protocol.id,
        data: protocol,
      }));

      await setManyProtocols(batchData, CACHE_TTL.GLOBAL_STATS);

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
 * 6. Group and merge similar protocols
 * 7. Calculate aggregated statistics
 * 8. Store in cache for 5 minutes
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
 * 1. Check Redis cache first
 * 2. If cached → return immediately
 * 3. If no cache → fetch from DeFiLlama
 * 4. Find the specific protocol
 * 5. Build protocol statistics
 * 6. Store in cache for 5 minutes
 *
 * Called directly from the protocol detail page (Server Component)
 */
export async function fetchProtocolData(slug: string): Promise<ProtocolAggregate | null> {
  try {
    // Check cache
    const cached = await getCachedProtocol(slug);

    if (cached) return cached;

    loggers.cache.debug(`→ Fetching from DeFiLlama: ${slug}`);

    const singleProtocol = await fetchSingleTVL(slug);

    // Find specific protocol
    const protocol = transformProtocolToStandard(singleProtocol);

    if (!protocol) {
      loggers.data.warn(`Protocol not found: ${slug}`);

      return null;
    }

    // Build protocol statistics
    const result = mergeProtocolGroup([protocol]);

    // Cache result (non-blocking)
    setCachedProtocol(slug, result).catch((err) => {
      loggers.cache.error(`Failed to cache protocol ${slug}:`, err);
    });

    return result;
  } catch (error) {
    loggers.data.error(`Error fetching protocol ${slug}:`, error);

    return null;
  }
}
