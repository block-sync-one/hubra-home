import { getUnifiedToken, mergeTokenData, setUnifiedToken, UnifiedTokenData } from "./unified-token-cache";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { BirdEyeTokenOverview } from "@/lib/types/birdeye";
import { CACHE_TTL, cacheKeys, getStaleWhileRevalidate } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

type TokenData = BirdEyeTokenOverview["data"];

/**
 * Fetch fresh token overview from Birdeye API (pure data fetching, NO caching)
 * All caching is handled centrally by getStaleWhileRevalidate
 */
async function fetchFreshTokenOverview(tokenAddress: string, cachedUnified: UnifiedTokenData | null): Promise<UnifiedTokenData> {
  const overviewResponse = await fetchBirdeyeData<BirdEyeTokenOverview>("/defi/token_overview", {
    address: tokenAddress,
    ui_amount_mode: "scaled",
  });

  if (!overviewResponse.success || !overviewResponse.data) {
    // If we have cached list data, use it as fallback
    if (cachedUnified) {
      return cachedUnified;
    }

    throw new Error(`Token not found: ${tokenAddress}`);
  }

  const tokenData = overviewResponse.data;

  // Replace "Wrapped SOL" with "Solana"
  if (tokenData.name === "Wrapped SOL") {
    tokenData.name = "Solana";
  }

  const newUnifiedData: Partial<UnifiedTokenData> = {
    address: tokenData.address,
    symbol: tokenData.symbol,
    name: tokenData.name,
    logoURI: tokenData.logoURI || "",
    price: tokenData.price,
    priceChange24hPercent: tokenData.priceChange24hPercent,
    v24hUSD: tokenData.v24hUSD,
    v24hChangePercent: tokenData.v24hChangePercent,
    vBuy24hUSD: tokenData.vBuy24hUSD,
    vSell24hUSD: tokenData.vSell24hUSD,
    marketCap: tokenData.marketCap,
    liquidity: tokenData.liquidity,
    holder: tokenData.holder,
    decimals: tokenData.decimals,
    fdv: tokenData.fdv,
    totalSupply: tokenData.totalSupply,
    circulatingSupply: tokenData.circulatingSupply,
    trade24h: tokenData.trade24h,
    buy24h: tokenData.buy24h,
    sell24h: tokenData.sell24h,
    uniqueWallet24h: tokenData.uniqueWallet24h,
    extensions: tokenData.extensions,
  };

  // Merge with existing cache (list data takes precedence for prices if newer)
  return mergeTokenData(cachedUnified, newUnifiedData, "overview");
}

/**
 * Fetch token data with stale-while-revalidate pattern
 *
 * STRATEGY:
 * 1. Check cache - if fresh, return immediately
 * 2. If stale (TTL < 60s) - return stale data, refresh in background
 * 3. If overview data exists - return it (no upgrade needed)
 * 4. If only list data - upgrade to overview
 * 5. If no cache - fetch fresh overview
 */
export async function fetchTokenData(tokenAddress: string): Promise<TokenData | null> {
  try {
    const cacheKey = cacheKeys.tokenDetail(tokenAddress);

    // Use SWR pattern: returns stale data instantly, refreshes in background
    const result = await getStaleWhileRevalidate<UnifiedTokenData>(cacheKey, CACHE_TTL.TOKEN_DETAIL, async () => {
      const cachedUnified = await getUnifiedToken(tokenAddress);

      // Check if we already have full overview data
      if (cachedUnified && (cachedUnified.dataSource === "overview" || cachedUnified.dataSource === "merged")) {
        loggers.cache.debug(`✓ Using existing overview data: ${cachedUnified.symbol}`);

        return cachedUnified;
      }

      // Upgrade list data to overview or fetch fresh
      if (cachedUnified) {
        loggers.cache.debug(`→ Upgrading list data to overview: ${cachedUnified.symbol}`);
      } else {
        loggers.cache.debug(`→ Fetching overview from Birdeye: ${tokenAddress}`);
      }

      return await fetchFreshTokenOverview(tokenAddress, cachedUnified);
    });

    if (!result) {
      return null;
    }

    if (result.dataSource === "list") {
      loggers.cache.debug(`↻ Upgrading list token to overview for details: ${result.symbol}`);

      const upgraded = await fetchFreshTokenOverview(tokenAddress, result);

      await setUnifiedToken(tokenAddress, upgraded, CACHE_TTL.TOKEN_DETAIL);

      return transformUnifiedToTokenData(upgraded);
    }

    return transformUnifiedToTokenData(result);
  } catch (error) {
    loggers.data.error("Error fetching token data:", error);

    return null;
  }
}

/**
 * Transform unified token data to legacy TokenData format
 */
function transformUnifiedToTokenData(unified: UnifiedTokenData): TokenData {
  return {
    address: unified.address,
    symbol: unified.symbol,
    name: unified.name,
    logoURI: unified.logoURI,
    price: unified.price,
    priceChange24hPercent: unified.priceChange24hPercent,
    v24hUSD: unified.v24hUSD,
    marketCap: unified.marketCap,
    liquidity: unified.liquidity || 0,
    holder: unified.holder || 0,
    decimals: unified.decimals || 0,
    fdv: unified.fdv || 0,
    totalSupply: unified.totalSupply || 0,
    circulatingSupply: unified.circulatingSupply || 0,
    trade24h: unified.trade24h || 0,
    buy24h: unified.buy24h || 0,
    sell24h: unified.sell24h || 0,
    uniqueWallet24h: unified.uniqueWallet24h || 0,
    v24h: 0,
    vHistory24h: 0,
    vHistory24hUSD: 0,
    v24hChangePercent: unified.v24hChangePercent || 0,
    vBuy24h: 0,
    vBuy24hUSD: unified.vBuy24hUSD || 0,
    vBuyHistory24h: 0,
    vBuyHistory24hUSD: 0,
    vBuy24hChangePercent: 0,
    vSell24h: 0,
    vSell24hUSD: unified.vSell24hUSD || 0,
    vSellHistory24h: 0,
    vSellHistory24hUSD: 0,
    vSell24hChangePercent: 0,
    history24hPrice: 0,
    uniqueWalletHistory24h: 0,
    uniqueWallet24hChangePercent: 0,
    tradeHistory24h: 0,
    trade24hChangePercent: 0,
    sellHistory24h: 0,
    sell24hChangePercent: 0,
    buyHistory24h: 0,
    buy24hChangePercent: 0,
    numberMarkets: 0,
    lastTradeUnixTime: 0,
    lastTradeHumanTime: "",
    extensions: unified.extensions || {
      coingeckoId: "",
      description: "",
      discord: "",
      twitter: "",
      website: "",
    },
    isScaledUiToken: false,
    multiplier: null,
  } as TokenData;
}
