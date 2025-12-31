/**
 * Unified Protocol Cache
 *
 * Provides a unified caching layer that ensures data consistency
 * between the protocol list page and protocol details page.
 *
 * Key Principles:
 * 1. Each protocol has ONE cache entry: defi:protocol:<slug>
 * 2. List endpoint populates individual protocol caches (dataSource: "list")
 * 3. Details endpoint reads from OR updates the unified cache (dataSource: "overview")
 * 4. List data takes precedence for TVL/change metrics
 * 5. Overview data provides otherProtocols and detailed fields
 */

import { redis, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";
import { extractBaseName } from "@/lib/helpers";
import { Protocol } from "@/lib/types/defi-stats";

/**
 * Generate cache key for a single protocol
 */
function getProtocolCacheKey(protocolId: string): string {
  return `defi:protocol:${extractBaseName(protocolId)}`;
}

export interface UnifiedProtocolData extends Protocol {
  lastUpdated: number;
  dataSource: "list" | "overview" | "merged";
  currentChainTvls?: {
    [key: string]: string;
  };
  isParentProtocol?: boolean;
}

/**
 * Transform protocol data to unified format
 */
export function toUnifiedProtocolData(protocol: any, dataSource: "list" | "overview" = "list"): UnifiedProtocolData {
  const tvlChartData = dataSource === "list" ? protocol.tvlChartData : protocol?.tvlChartData.tvl;

  return {
    ...protocol,
    lastUpdated: Date.now(),
    dataSource,
    tvlChartData,
  };
}

/**
 * Get unified protocol data from cache
 */
export async function getUnifiedProtocol(protocolId: string): Promise<UnifiedProtocolData | null> {
  try {
    const cacheKey = getProtocolCacheKey(protocolId);

    return await redis.get<UnifiedProtocolData>(cacheKey);
  } catch (error) {
    loggers.cache.error(`Failed to get unified protocol ${protocolId}:`, error);

    return null;
  }
}

/**
 * Set unified protocol data in cache
 */
export async function setUnifiedProtocol(
  protocolId: string,
  data: UnifiedProtocolData,
  ttl: number = CACHE_TTL.PROTOCOL
): Promise<boolean> {
  try {
    const cacheKey = getProtocolCacheKey(protocolId);

    redis.set(cacheKey, data, ttl).catch((err) => {
      loggers.cache.error(`Failed to cache unified protocol ${protocolId}:`, err);
    });

    loggers.cache.debug(`✓ Caching unified protocol: ${data.name}`);

    return true;
  } catch (error) {
    loggers.cache.error(`Failed to cache unified protocol ${protocolId}:`, error);

    return false;
  }
}

/**
 * Batch get multiple unified protocols from cache
 * Uses Redis MGET for efficient bulk retrieval
 */
export async function getManyUnifiedProtocols(protocolIds: string[]): Promise<Map<string, UnifiedProtocolData | null>> {
  const result = new Map<string, UnifiedProtocolData | null>();

  if (protocolIds.length === 0) return result;

  try {
    const keys = protocolIds.map((id) => getProtocolCacheKey(id));
    const cached = await redis.mget<UnifiedProtocolData>(keys);

    protocolIds.forEach((protocolId, index) => {
      const key = keys[index];
      const data = cached.get(key);

      result.set(protocolId, data || null);

      if (data) {
        loggers.cache.debug(`✓ Batch unified protocol: ${protocolId}`);
      }
    });

    return result;
  } catch (error) {
    loggers.cache.error(`Failed to batch get unified protocols:`, error);

    // Return empty results on error
    protocolIds.forEach((id) => result.set(id, null));

    return result;
  }
}

/**
 * Batch set multiple unified protocols in cache
 * Uses Redis pipeline with SETEX for efficient bulk writes
 */
export async function setManyUnifiedProtocols(
  protocols: Array<{ id: string; data: UnifiedProtocolData }>,
  ttl: number = CACHE_TTL.PROTOCOL
): Promise<boolean> {
  if (protocols.length === 0) return true;

  try {
    const entries = protocols.map((protocol) => ({
      key: getProtocolCacheKey(protocol.id),
      value: protocol.data,
      ttl,
    }));

    const success = await redis.mset(entries);

    if (success) {
      loggers.cache.debug(`✓ Batch cached ${protocols.length} unified protocols`);
    }

    return success;
  } catch (error) {
    loggers.cache.error(`Failed to batch set unified protocols:`, error);

    return false;
  }
}

/**
 * Merge data from list and overview endpoints
 * List data takes precedence for TVL/change metrics
 * Overview data provides otherProtocols and detailed fields
 */
export function mergeProtocolData(
  existing: UnifiedProtocolData | null,
  newData: Partial<UnifiedProtocolData>,
  dataSource: "list" | "overview"
): UnifiedProtocolData {
  if (!existing) {
    return {
      ...newData,
      dataSource,
      lastUpdated: Date.now(),
    } as UnifiedProtocolData;
  }

  if (dataSource === "list") {
    return {
      ...existing,
      ...newData,
      tvl: newData.tvl ?? existing.tvl,
      change1D: newData.change1D ?? existing.change1D,
      change7D: newData.change7D ?? existing.change7D,
      change1H: newData.change1H ?? existing.change1H,
      // Preserve tvlChartData from existing if new data doesn't have it
      tvlChartData: newData.tvlChartData ?? existing.tvlChartData,
      otherProtocols: existing.otherProtocols ?? newData.otherProtocols,
      description: existing.description ?? newData.description,
      url: existing.url ?? newData.url,
      twitter: existing.twitter ?? newData.twitter,
      github: existing.github ?? newData.github,
      assetToken: existing.assetToken ?? newData.assetToken,
      address: existing.address ?? newData.address,
      dataSource: existing.dataSource === "overview" ? "merged" : "list",
      lastUpdated: Date.now(),
    };
  }

  return {
    ...newData,
    ...existing,
    otherProtocols: newData.otherProtocols ?? existing.otherProtocols,
    description: newData.description ?? existing.description,
    url: newData.url ?? existing.url,
    twitter: newData.twitter ?? existing.twitter,
    github: newData.github ?? existing.github,
    assetToken: newData.assetToken ?? existing.assetToken,
    address: newData.address ?? existing.address,
    tvl: existing.tvl ?? newData.currentChainTvls?.["Solana"],
    change1D: existing.change1D ?? newData.change1D,
    change7D: existing.change7D ?? newData.change7D,
    change1H: existing.change1H ?? newData.change1H,
    // Preserve tvlChartData from new data (overview) if available, otherwise keep existing
    tvlChartData: newData.tvlChartData ?? existing.tvlChartData,
    dataSource: "merged",
    lastUpdated: Date.now(),
  } as UnifiedProtocolData;
}
