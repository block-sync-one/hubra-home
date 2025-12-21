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
import {
  DeFiLlamaProtocol,
  fetchDailyFees,
  fetchDailyRevenue,
  fetchHistoricalChainTVL,
  fetchProtocolFees,
  fetchProtocolHistoricalTVL,
  fetchProtocolRevenue,
  fetchSingleTVL,
  fetchTVL,
  FeeRevenueData,
} from "@/lib/services/defillama";
import { DefiStatsAggregate, Protocol } from "@/lib/types/defi-stats";
import { loggers } from "@/lib/utils/logger";

interface InflowsChartDataPoint {
  date: string;
  value: number;
  value2: number;
}

const CACHE_KEY_ALL_PROTOCOLS = "defi:protocols:all";
const TOP_PROTOCOLS_LIMIT = 6;

export function deriveProtocolSlugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function filterAndTransformSolanaProtocols(protocols: DeFiLlamaProtocol[]): { standardized: Protocol[]; hotProtocols: Protocol[] } {
  const standardized: Protocol[] = [];
  const hotProtocols: Protocol[] = [];

  for (const protocol of protocols) {
    if (protocol?.chains?.length !== 1 || !protocol.chains.includes("Solana") || protocol.category === "CEX") {
      continue;
    }

    const transformed: Protocol = {
      id: protocol.slug || deriveProtocolSlugFromName(protocol.name),
      name: protocol.name,
      logo: protocol.logo || "/logo.svg",
      // @ts-ignore
      tvl: protocol.chainTvls?.["Solana"] ?? 0,
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

    standardized.push(transformed);

    if (transformed.change1D && transformed.change1D > 0) {
      hotProtocols.push(transformed);
    }
  }

  hotProtocols.sort((a, b) => (b.change1D || 0) - (a.change1D || 0));

  return {
    standardized,
    hotProtocols: hotProtocols.slice(0, TOP_PROTOCOLS_LIMIT),
  };
}

/**
 * Transform DeFiLlama protocol to standardized Protocol format
 */
function transformProtocolToStandard(protocol: DeFiLlamaProtocol, dataSource: "overview" | "list" = "list"): Protocol {
  return {
    id: protocol.slug || deriveProtocolSlugFromName(protocol.name),
    name: protocol.name,
    logo: protocol.logo || "/logo.svg",
    symbol: protocol.symbol || "",
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

/**
 * Calculate 24-hour TVL change percentage from historical data
 */
function calculateTvlChange(historicalData: any[]): number {
  if (historicalData.length < 2) {
    return 0;
  }
  const currentTvl = historicalData[historicalData.length - 1].tvl;
  const previousTvl = historicalData[historicalData.length - 2].tvl;

  return ((currentTvl - previousTvl) / previousTvl) * 100;
}

/**
 * Get current TVL from historical data
 */
function getCurrentTvl(historicalData: any[]): number {
  return historicalData[historicalData.length - 1]?.tvl ?? 0;
}

function formatChartDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Transform fee and revenue data to chart format
 * Matches dates between fee and revenue arrays for dual-line chart
 */
function transformFeeRevenueToChartFormat(fees: Array<[number, number]>, revenue: Array<[number, number]>): InflowsChartDataPoint[] {
  if (!fees || fees.length === 0) {
    return [];
  }

  const revenueMap = new Map<number, number>();

  for (const [date, value] of revenue || []) {
    revenueMap.set(date, value);
  }

  const result: InflowsChartDataPoint[] = new Array(fees.length);

  for (let i = 0; i < fees.length; i++) {
    const [date, feeValue] = fees[i];

    result[i] = {
      date: formatChartDate(date),
      value: feeValue,
      value2: revenueMap.get(date) ?? 0,
    };
  }

  return result;
}

/**
 * Transform historical TVL data to chart format
 */
function transformHistoricalDataToChartFormat(historicalData: any[]) {
  const result = new Array(historicalData.length);

  for (let i = 0; i < historicalData.length; i++) {
    result[i] = {
      date: formatChartDate(historicalData[i].date),
      value: historicalData[i].tvl,
    };
  }

  return result;
}

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
  chartData: any[],
  feesData: FeeRevenueData,
  revenueData: FeeRevenueData
): DefiStatsAggregate {
  const feesChart = feesData?.totalDataChart || [];
  const revenueChart = revenueData?.totalDataChart || [];

  return {
    change1D: tvlChange,
    chartData,
    inflows: {
      change_1d: feesData?.change_1d || 0,
      chartData: transformFeeRevenueToChartFormat(feesChart, revenueChart),
    },
    solanaProtocols: protocols,
    hotProtocols,
    numberOfProtocols: protocols.length,
    totalTvl,
    totalRevenue_1d: revenueData?.total24h || 0,
    totalFees_1d: feesData?.total24h || 0,
  };
}

async function fetchFreshProtocolsData(): Promise<DefiStatsAggregate> {
  loggers.cache.debug(`→ Fetching from DeFiLlama: All protocols`);

  const [feesData, revenueData, allProtocols, historicalTVL] = await Promise.all([
    fetchDailyFees().catch((error) => {
      loggers.data.error("Failed to fetch daily fees:", error);

      return null;
    }),
    fetchDailyRevenue().catch((error) => {
      loggers.data.error("Failed to fetch daily revenue:", error);

      return null;
    }),
    fetchTVL(),
    fetchHistoricalChainTVL(),
  ]);

  const { standardized: standardizedProtocols, hotProtocols } = filterAndTransformSolanaProtocols(allProtocols);

  const totalTvl = getCurrentTvl(historicalTVL);
  const tvlChange = calculateTvlChange(historicalTVL);
  const chartData = transformHistoricalDataToChartFormat(historicalTVL);

  const result = buildDefiStatsAggregate(
    standardizedProtocols,
    hotProtocols,
    totalTvl,
    tvlChange,
    chartData,
    (feesData as FeeRevenueData) || {},
    (revenueData as FeeRevenueData) || {}
  );

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
      const protocolIds = protocols.map((p) => p.slug || p.id);
      const existingCache = await getManyUnifiedProtocols(protocolIds);

      const batchData = protocols.map((protocol) => {
        const protocolId = protocol.slug || protocol.id;
        const existing = existingCache.get(protocolId);
        const unifiedData = toUnifiedProtocolData(protocol, "list");
        const merged = existing ? mergeProtocolData(existing, unifiedData, "list") : unifiedData;

        return {
          id: protocolId,
          data: merged,
        };
      });

      await setManyUnifiedProtocols(batchData, CACHE_TTL.PROTOCOL);
    } catch (error) {
      loggers.cache.error("Failed to batch cache individual protocols:", error);
    }
  })();
}

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

    const [singleProtocol, historicalTVL, feesData, revenueData] = await Promise.all([
      fetchSingleTVL(slug),
      fetchProtocolHistoricalTVL(slug).catch((error) => {
        loggers.data.debug(`Failed to fetch historical TVL for ${slug}:`, error);

        return [];
      }),
      fetchProtocolFees(slug).catch((error) => {
        loggers.data.debug(`Failed to fetch fees for ${slug}:`, error);

        return null;
      }),
      fetchProtocolRevenue(slug).catch((error) => {
        loggers.data.debug(`Failed to fetch revenue for ${slug}:`, error);

        return null;
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

    // Add fees and revenue data if available
    if (feesData && revenueData) {
      const feesChart = feesData.totalDataChart || [];
      const revenueChart = revenueData.totalDataChart || [];

      protocol.feesRevenueChartData = transformFeeRevenueToChartFormat(feesChart, revenueChart);
      protocol.totalFees_1d = feesData.total24h || 0;
      protocol.totalRevenue_1d = revenueData.total24h || 0;
      protocol.feesChange_1d = feesData.change_1d || 0;
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
