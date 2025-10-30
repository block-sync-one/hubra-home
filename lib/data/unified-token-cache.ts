/**
 * Unified Token Cache - Single Source of Truth
 *
 * This module provides a unified caching layer that ensures price consistency
 * between the token list page and token details page.
 *
 * Key Principles:
 * 1. Each token has ONE cache entry: token:<address>
 * 2. List endpoint populates individual token caches
 * 3. Details endpoint reads from OR updates the unified cache
 * 4. Price from list endpoint takes precedence (when available)
 */

import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

export function toUnifiedTokenData(token: any, dataSource: "list" | "overview" = "list"): UnifiedTokenData {
  return {
    address: token.address,
    symbol: token.symbol?.toUpperCase() || "",
    name: token.name === "Wrapped SOL" ? "Solana" : token.name,
    logoURI: token.logoURI || token.logo_uri || "/logo.svg",
    price: token.price || 0,
    priceChange24hPercent: token.priceChange24hPercent || token.price24hChangePercent || token.price_change_24h_percent || 0,
    v24hUSD: token.v24hUSD || token.volume24hUSD || token.volume_24h_usd || 0,
    v24hChangePercent: token.v24hChangePercent,
    vBuy24hUSD: token.vBuy24hUSD,
    vSell24hUSD: token.vSell24hUSD,
    marketCap: token.marketCap || token.marketcap || token.market_cap || 0,
    liquidity: token.liquidity,
    holder: token.holder,
    decimals: token.decimals,
    extensions: token.extensions,
    lastUpdated: Date.now(),
    dataSource,
  };
}

/**
 * Unified token data structure
 * Contains data from both /token/list and /token_overview endpoints
 */
export interface UnifiedTokenData {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;

  price: number;
  priceChange24hPercent: number;

  v24hUSD: number;
  v24hChangePercent?: number;
  vBuy24hUSD?: number;
  vSell24hUSD?: number;
  marketCap: number;

  liquidity?: number;
  holder?: number;
  decimals?: number;
  fdv?: number;
  totalSupply?: number;
  circulatingSupply?: number;

  trade24h?: number;
  buy24h?: number;
  sell24h?: number;
  uniqueWallet24h?: number;

  extensions?: {
    twitter?: string;
    website?: string;
    description?: string;
    coingeckoId?: string;
    discord?: string;
  };

  lastUpdated: number;
  dataSource: "list" | "overview" | "merged";
}

/**
 * Get unified token data from cache
 */
export async function getUnifiedToken(address: string): Promise<UnifiedTokenData | null> {
  try {
    const cached = await redis.get<UnifiedTokenData>(cacheKeys.tokenDetail(address));

    if (cached) {
      loggers.cache.debug(`✓ Unified token: ${address}`);
    }

    return cached;
  } catch (error) {
    loggers.cache.error(`Failed to get unified token ${address}:`, error);

    return null;
  }
}

/**
 * Set unified token data in cache
 */
export async function setUnifiedToken(address: string, data: UnifiedTokenData, ttl: number = CACHE_TTL.TOKEN_DETAIL): Promise<boolean> {
  try {
    await redis.set(cacheKeys.tokenDetail(address), data, ttl);
    loggers.cache.debug(`✓ Cached unified token: ${data.symbol}`);

    return true;
  } catch (error) {
    loggers.cache.error(`Failed to cache unified token ${address}:`, error);

    return false;
  }
}

/**
 * Merge data from list and overview endpoints
 * List data takes precedence for price/change/volume
 */
export function mergeTokenData(
  existing: UnifiedTokenData | null,
  newData: Partial<UnifiedTokenData>,
  dataSource: "list" | "overview"
): UnifiedTokenData {
  if (!existing) {
    return {
      ...newData,
      dataSource,
      lastUpdated: Date.now(),
    } as UnifiedTokenData;
  }

  // If new data is from list endpoint, it's the source of truth for prices
  if (dataSource === "list") {
    return {
      ...existing,
      ...newData,
      // List data always wins for these fields
      price: newData.price ?? existing.price,
      priceChange24hPercent: newData.priceChange24hPercent ?? existing.priceChange24hPercent,
      v24hUSD: newData.v24hUSD ?? existing.v24hUSD,
      marketCap: newData.marketCap ?? existing.marketCap,
      dataSource: existing.dataSource === "overview" ? "merged" : "list",
      lastUpdated: Date.now(),
    };
  }

  // If new data is from overview, only update fields not in list
  return {
    ...newData,
    ...existing, // Existing data takes precedence
    // Add overview-only fields
    liquidity: newData.liquidity ?? existing.liquidity,
    holder: newData.holder ?? existing.holder,
    decimals: newData.decimals ?? existing.decimals,
    fdv: newData.fdv ?? existing.fdv,
    totalSupply: newData.totalSupply ?? existing.totalSupply,
    circulatingSupply: newData.circulatingSupply ?? existing.circulatingSupply,
    trade24h: newData.trade24h ?? existing.trade24h,
    buy24h: newData.buy24h ?? existing.buy24h,
    sell24h: newData.sell24h ?? existing.sell24h,
    uniqueWallet24h: newData.uniqueWallet24h ?? existing.uniqueWallet24h,
    dataSource: "merged",
    lastUpdated: Date.now(),
  } as UnifiedTokenData;
}
