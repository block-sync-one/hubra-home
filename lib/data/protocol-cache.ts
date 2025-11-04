/**
 * Protocol Cache Utility
 * Provides batch caching operations for DeFi protocols
 * Similar to unified-token-cache.ts but for protocols
 */

import type { Protocol, ProtocolAggregate } from "@/lib/types/defi-stats";

import { redis } from "@/lib/cache/redis";
import { CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";
import { extractBaseName } from "@/lib/helpers";

// ============================================================================
// CACHE KEY HELPERS
// ============================================================================

/**
 * Generate cache key for a single protocol
 */
function getProtocolCacheKey(protocolId: string): string {
  return `defi:protocol:${extractBaseName(protocolId)}`;
}

// ============================================================================
// SINGLE PROTOCOL OPERATIONS
// ============================================================================

/**
 * Get a single protocol from cache
 */
export async function getCachedProtocol(protocolId: string): Promise<ProtocolAggregate | null> {
  try {
    const cacheKey = getProtocolCacheKey(protocolId);
    const cached = await redis.get<ProtocolAggregate>(cacheKey);

    if (cached) {
      loggers.cache.debug(`✓ Protocol cache HIT: ${protocolId}`);
    }

    return cached;
  } catch (error) {
    loggers.cache.error(`Failed to get cached protocol ${protocolId}:`, error);

    return null;
  }
}

/**
 * Set a single protocol in cache
 */
export async function setCachedProtocol(
  protocolId: string,
  data: ProtocolAggregate,
  ttl: number = CACHE_TTL.GLOBAL_STATS
): Promise<boolean> {
  try {
    const cacheKey = getProtocolCacheKey(protocolId);

    await redis.set(cacheKey, data, ttl);
    loggers.cache.debug(`✓ Cached protocol: ${protocolId}`);

    return true;
  } catch (error) {
    loggers.cache.error(`Failed to cache protocol ${protocolId}:`, error);

    return false;
  }
}

/**
 * Batch set multiple protocols in cache
 * Uses Redis MSET for efficient bulk writes
 *
 * Example usage:
 * ```typescript
 * await setManyProtocols([
 *   { id: 'jito', data: jitoProtocol },
 *   { id: 'marinade', data: marinadeProtocol }
 * ], CACHE_TTL.GLOBAL_STATS);
 * ```
 */
export async function setManyProtocols(
  protocols: Array<{ id: string; data: Protocol | ProtocolAggregate }>,
  ttl: number = CACHE_TTL.GLOBAL_STATS
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
      loggers.cache.debug(`✓ Batch cached ${protocols.length} protocols`);
    }

    return success;
  } catch (error) {
    loggers.cache.error(`Failed to batch set protocols:`, error);

    return false;
  }
}
