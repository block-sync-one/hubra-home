import "server-only";

import {
  getManyUnifiedProtocols,
  getUnifiedProtocol,
  mergeProtocolData,
  setManyUnifiedProtocols,
  setUnifiedProtocol,
  toUnifiedProtocolData,
  UnifiedProtocolData,
} from "./unified-protocol-cache";
import { isParentProtocol, type ProtocolResolutionResult } from "./protocol-utils";

import { getStaleWhileRevalidate } from "@/lib/cache/swr-cache";
import { CACHE_TTL, redis } from "@/lib/cache";
import {
  DeFiLlamaProtocol,
  FeeRevenueData,
  fetchDailyFees,
  fetchDailyRevenue,
  fetchHistoricalChainTVL,
  fetchProtocolFees,
  fetchProtocolHistoricalTVL,
  fetchProtocolRevenue,
  fetchSingleTVL,
  fetchTVL,
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
const MIN_TVL_THRESHOLD = 100000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function deriveProtocolSlugFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function isValidSolanaProtocol(protocol: DeFiLlamaProtocol): boolean {
  return protocol?.chains?.length === 1 && protocol.chains.includes("Solana") && protocol.category !== "CEX";
}

function extractValidCategories(category: string | string[] | undefined): string[] {
  const categories = Array.isArray(category) ? category : category ? [category] : [];

  return categories.filter((cat) => cat && cat !== "Uncategorized");
}

function collectParentCategories(parentSlug: string, category: string | string[] | undefined, categoryMap: Map<string, Set<string>>): void {
  const validCategories = extractValidCategories(category);

  if (validCategories.length === 0) {
    return;
  }

  if (categoryMap.has(parentSlug)) {
    const existingCategories = categoryMap.get(parentSlug)!;

    validCategories.forEach((cat) => existingCategories.add(cat));
  } else {
    categoryMap.set(parentSlug, new Set(validCategories));
  }
}

function filterAndTransformSolanaProtocols(protocols: DeFiLlamaProtocol[]): {
  standardized: Protocol[];
  hotProtocols: Protocol[];
  missingParentProtocolSlugsMap: Map<string, Set<string>>;
} {
  const standardized: Protocol[] = [];
  const hotProtocols: Protocol[] = [];
  const missingParentProtocolSlugs = new Map<string, Set<string>>();

  for (const protocol of protocols) {
    if (!isValidSolanaProtocol(protocol)) {
      continue;
    }

    const parentSlug = protocol.parentProtocolSlug;

    if (parentSlug) {
      collectParentCategories(parentSlug, protocol.category, missingParentProtocolSlugs);
      continue;
    }

    const transformed: Protocol = transformProtocolToStandard(protocol, "list");

    // Filter out protocols with TVL < MIN_TVL_THRESHOLD
    if (transformed.tvl < MIN_TVL_THRESHOLD) {
      continue;
    }

    standardized.push(transformed);

    if (transformed.change1D && transformed.change1D > 0) {
      hotProtocols.push(transformed);
    }
  }

  hotProtocols.sort((a, b) => (b.change1D || 0) - (a.change1D || 0));

  return {
    standardized,
    hotProtocols: hotProtocols.slice(0, TOP_PROTOCOLS_LIMIT),
    missingParentProtocolSlugsMap: missingParentProtocolSlugs,
  };
}

function extractTvlFromProtocol(protocol: DeFiLlamaProtocol, dataSource: "overview" | "parent" | "list"): number {
  if (dataSource === "list") {
    // @ts-ignore - chainTvls exists but not in type definition
    return protocol.chainTvls?.["Solana"] ?? 0;
  }

  const solanaTvl = protocol.currentChainTvls?.["Solana"];

  if (typeof solanaTvl === "string") {
    return parseFloat(solanaTvl) || 0;
  }
  if (typeof solanaTvl === "number") {
    return solanaTvl;
  }

  // @ts-ignore - chainTvls exists but not in type definition
  return getCurrentTvl(protocol.chainTvls?.["Solana"]);
}

/**
 * Transform DeFiLlama protocol to standardized Protocol format
 */
function transformProtocolToStandard(protocol: DeFiLlamaProtocol, dataSource: "overview" | "parent" | "list" = "list"): Protocol {
  const tvl = extractTvlFromProtocol(protocol, dataSource);
  const change1D = protocol.change_1d;

  return {
    id: protocol.slug || deriveProtocolSlugFromName(protocol.name),
    name: protocol.name,
    logo: protocol.logo || "",
    symbol: protocol.symbol && protocol.symbol !== "-" ? protocol.symbol : "",
    tvl,
    // @ts-ignore - chainTvls exists but not in type definition
    tvlChartData: protocol.chainTvls?.["Solana"],
    change1D,
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
    isParentProtocol: protocol.isParentProtocol,
    parentProtocol: protocol.parentProtocol,
    parentProtocolSlug: protocol.parentProtocolSlug,
    assetToken: protocol.assetToken,
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

  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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

  const successfulParents: Protocol[] = [];
  const {
    standardized: standardizedProtocols,
    hotProtocols,
    missingParentProtocolSlugsMap,
  } = filterAndTransformSolanaProtocols(allProtocols);

  const missingParentProtocolSlugs: string[] = Array.from(missingParentProtocolSlugsMap.keys());

  if (missingParentProtocolSlugs.length > 0) {
    const parentProtocolsData = await Promise.allSettled(missingParentProtocolSlugs.map((slug) => fetchSingleTVL(slug)));

    for (let i = 0; i < parentProtocolsData.length; i++) {
      const result = parentProtocolsData[i];
      const originalSlug = missingParentProtocolSlugs[i];

      if (result.status === "fulfilled" && result.value) {
        const fetchedSlug = result.value.slug || result.value.id;
        const categories = missingParentProtocolSlugsMap.get(originalSlug) || missingParentProtocolSlugsMap.get(fetchedSlug);

        if (categories && categories.size > 0) {
          result.value.category = Array.from(categories);
        }

        const transformed = transformProtocolToStandard(result.value, "overview");

        // Filter out protocols with TVL < MIN_TVL_THRESHOLD
        if (transformed.tvl < MIN_TVL_THRESHOLD) {
          continue;
        }

        transformed.isParentProtocol = true;
        successfulParents.push(transformed);
      }
    }
  }

  const protocolResult = successfulParents.concat(standardizedProtocols);

  const totalTvl = getCurrentTvl(historicalTVL);
  const tvlChange = calculateTvlChange(historicalTVL);
  const chartData = transformHistoricalDataToChartFormat(historicalTVL);

  const result = buildDefiStatsAggregate(
    protocolResult,
    hotProtocols,
    totalTvl,
    tvlChange,
    chartData,
    (feesData as FeeRevenueData) || {},
    (revenueData as FeeRevenueData) || {}
  );

  cacheIndividualProtocolsAsync(protocolResult);

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
    const result = await getStaleWhileRevalidate<DefiStatsAggregate>(CACHE_KEY_ALL_PROTOCOLS, CACHE_TTL.PROTOCOL, fetchFreshProtocolsData);

    return result || buildEmptyDefiStats();
  } catch (error) {
    loggers.data.error("Error fetching DeFi protocols data:", error);

    return buildEmptyDefiStats();
  }
}

/**
 * Fetch protocol data by slug (without resolution)
 * @param slug - Protocol slug
 * @param includeHistoricalTVL - Whether to fetch historical TVL chart data (default: true)
 */
export async function fetchProtocolDataRaw(slug: string, includeHistoricalTVL = true): Promise<UnifiedProtocolData | null> {
  try {
    const cached = await getUnifiedProtocol(slug);

    // Return cached data if we have full overview data
    if (cached && (cached.dataSource === "overview" || cached.dataSource === "merged")) {
      // For minimal fetch, require fees/revenue data
      if (!includeHistoricalTVL) {
        if (cached.totalFees_1d !== undefined || cached.totalRevenue_1d !== undefined) {
          return cached;
        }
      } else {
        // For full fetch, any cached overview/merged data is valid
        return cached;
      }
    }

    // Build promises array - include historical TVL if needed for parallel fetching
    const promises: Promise<any>[] = [
      fetchSingleTVL(slug),
      fetchProtocolFees(slug).catch(() => null),
      fetchProtocolRevenue(slug).catch(() => null),
    ];

    if (includeHistoricalTVL) {
      promises.push(fetchProtocolHistoricalTVL(slug).catch(() => []));
    }

    const results = await Promise.all(promises);
    const singleProtocol = results[0];
    const feesData = results[1];
    const revenueData = results[2];
    const historicalTVL = includeHistoricalTVL ? results[3] : undefined;

    const protocol = transformProtocolToStandard(singleProtocol, "overview");

    if (!protocol) {
      loggers.data.warn(`Protocol not found: ${slug}`);

      return null;
    }

    if (singleProtocol.isParentProtocol || !protocol.parentProtocol) {
      protocol.isParentProtocol = true;
    }

    if (includeHistoricalTVL && historicalTVL && Array.isArray(historicalTVL) && historicalTVL.length > 0) {
      protocol.tvlChartData = historicalTVL;
    }

    if (feesData && revenueData) {
      protocol.totalFees_1d = feesData.total24h || 0;
      protocol.totalRevenue_1d = revenueData.total24h || 0;
      protocol.feesChange_1d = feesData.change_1d || 0;

      if (includeHistoricalTVL) {
        const feesChart = feesData.totalDataChart || [];
        const revenueChart = revenueData.totalDataChart || [];

        protocol.feesRevenueChartData = transformFeeRevenueToChartFormat(feesChart, revenueChart);
      }
    }

    const unifiedData = toUnifiedProtocolData(protocol, "overview");
    const merged = cached ? mergeProtocolData(cached, unifiedData, "overview") : unifiedData;

    setUnifiedProtocol(slug, merged).catch((err) => {
      loggers.cache.error(`Failed to cache protocol ${slug}:`, err);
    });

    return merged;
  } catch (error) {
    loggers.data.error(`Error fetching protocol ${slug}:`, error);

    return null;
  }
}

/**
 * Fetch minimal protocol data (no historical TVL) for key metrics
 */
export async function fetchProtocolDataMinimal(slug: string): Promise<UnifiedProtocolData | null> {
  return fetchProtocolDataRaw(slug, false);
}

/**
 * Fetch protocol data with automatic parent resolution
 *
 * If the slug belongs to a child protocol, automatically resolves to the parent.
 * Returns resolution metadata for explicit handling in UI.
 *
 * @param slug - Protocol slug (can be child or parent)
 * @returns Resolution result with metadata, or null if not found
 */
export async function fetchProtocolWithResolution(slug: string): Promise<ProtocolResolutionResult | null> {
  const originalSlug = slug;

  // First, fetch the protocol to check if it's a child
  let protocol = await fetchProtocolDataRaw(slug);

  if (!protocol) {
    return null;
  }

  // If it's a child protocol, resolve to parent
  if (protocol.parentProtocolSlug && !isParentProtocol(protocol)) {
    const parentSlug = protocol.parentProtocolSlug;

    const parentProtocol = await fetchProtocolDataRaw(parentSlug);

    if (!parentProtocol) {
      loggers.data.warn(`Parent protocol ${parentSlug} not found for child ${slug}`);

      return null;
    }

    return {
      originalSlug,
      resolvedSlug: parentSlug,
      wasResolved: true,
      protocol: parentProtocol,
    };
  }

  // Already a parent protocol
  return {
    originalSlug,
    resolvedSlug: slug,
    wasResolved: false,
    protocol,
  };
}

const CACHE_KEY_CHILD_PROTOCOLS = (parentSlug: string) => `defi:children:${parentSlug}`;

export async function fetchChildProtocols(parentSlug: string, otherProtocols?: string[]): Promise<Protocol[]> {
  try {
    // 1. Check if children already exist in cache
    const cacheKey = CACHE_KEY_CHILD_PROTOCOLS(parentSlug);
    const cached = await redis.get<Protocol[]>(cacheKey);

    if (cached && Array.isArray(cached)) {
      return cached;
    }

    if (!otherProtocols || otherProtocols.length === 0) {
      return [];
    }

    // 2. Derive slugs from otherProtocols array, exclude parent protocol, and deduplicate
    const parentSlugNormalized = parentSlug.toLowerCase();
    const protocolSlugsSet = new Set<string>();

    for (const name of otherProtocols) {
      const slug = deriveProtocolSlugFromName(name);
      const slugNormalized = slug.toLowerCase();

      if (slugNormalized !== parentSlugNormalized) {
        protocolSlugsSet.add(slugNormalized);
      }
    }

    const protocolSlugs = Array.from(protocolSlugsSet);

    if (protocolSlugs.length === 0) {
      return [];
    }

    // 3. Fetch all in parallel (fetchProtocolDataMinimal handles its own caching and errors)
    const protocols = await Promise.allSettled(protocolSlugs.map((slug) => fetchProtocolDataMinimal(slug)));

    // 4. Normalize values - filter out null and parent protocols
    const children: Protocol[] = [];

    for (let i = 0; i < protocols.length; i++) {
      const result = protocols[i];

      if (result.status !== "fulfilled" || !result.value) continue;

      children.push(result.value);
    }

    // 5. Return
    // 6. Save in cache non-blocking
    if (children.length > 0) {
      redis.set(cacheKey, children, CACHE_TTL.PROTOCOL).catch((err) => {
        loggers.cache.error(`Failed to cache children for ${parentSlug}:`, err);
      });
    }

    return children;
  } catch (error) {
    loggers.data.error(`Error fetching child protocols for ${parentSlug}:`, error);

    return [];
  }
}
