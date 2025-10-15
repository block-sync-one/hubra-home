import { getUnifiedToken, setUnifiedToken, mergeTokenData, UnifiedTokenData } from "./unified-token-cache";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { BirdEyeTokenOverview } from "@/lib/types/birdeye";
import { CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

type TokenData = BirdEyeTokenOverview["data"];

/**
 * Fetch token data using unified cache with ON-DEMAND overview fetching
 *
 * STRATEGY:
 * 1. Check cache for existing data
 * 2. If full overview exists → return it
 * 3. If only list data exists → fetch full overview (1 API call)
 * 4. If no cache → fetch full overview (1 API call)
 *
 * Overview is only fetched when a user visits a specific token detail page.
 */
export async function fetchTokenData(tokenAddress: string): Promise<TokenData | null> {
  try {
    // Check unified cache first
    const cachedUnified = await getUnifiedToken(tokenAddress);

    if (cachedUnified) {
      loggers.cache.debug(`✓ Unified cache HIT: ${cachedUnified.symbol}`);

      // If we have full overview data, return it (no API call needed)
      if (cachedUnified.dataSource === "overview" || cachedUnified.dataSource === "merged") {
        return transformUnifiedToTokenData(cachedUnified);
      }

      // We only have basic list data, upgrade to full overview
      loggers.cache.debug(`→ Upgrading list data to full overview: ${cachedUnified.symbol}`);
    }

    loggers.cache.debug(`→ Fetching overview from Birdeye: ${tokenAddress}`);

    // Fetch token overview from Birdeye (ON-DEMAND - only when user visits this token)
    const overviewResponse = await fetchBirdeyeData<BirdEyeTokenOverview>("/defi/token_overview", {
      address: tokenAddress,
      ui_amount_mode: "scaled",
    });

    if (!overviewResponse.success || !overviewResponse.data) {
      loggers.data.warn(`Token not found: ${tokenAddress}`);

      // If we have cached list data, return it
      if (cachedUnified) {
        return transformUnifiedToTokenData(cachedUnified);
      }

      return null;
    }

    const tokenData = overviewResponse.data;

    // Replace "Wrapped SOL" with "Solana"
    if (tokenData.name === "Wrapped SOL") {
      tokenData.name = "Solana";
    }

    // Create unified data from overview
    const newUnifiedData: Partial<UnifiedTokenData> = {
      address: tokenData.address,
      symbol: tokenData.symbol,
      name: tokenData.name,
      logoURI: tokenData.logoURI || "/logo.svg",
      price: tokenData.price,
      priceChange24hPercent: tokenData.priceChange24hPercent,
      v24hUSD: tokenData.v24hUSD,
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
    };

    // Merge with existing cache (list data takes precedence for prices if newer)
    const merged = mergeTokenData(cachedUnified, newUnifiedData, "overview");

    // Store in unified cache
    await setUnifiedToken(tokenAddress, merged, CACHE_TTL.TOKEN_DETAIL);

    loggers.cache.debug(`✓ Cached unified token: ${merged.symbol} (source: ${merged.dataSource})`);

    return transformUnifiedToTokenData(merged);
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
    // Add default values for other required fields
    v24h: 0,
    vHistory24h: 0,
    vHistory24hUSD: 0,
    v24hChangePercent: 0,
    vBuy24h: 0,
    vBuy24hUSD: 0,
    vBuyHistory24h: 0,
    vBuyHistory24hUSD: 0,
    vBuy24hChangePercent: 0,
    vSell24h: 0,
    vSell24hUSD: 0,
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
    extensions: {
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
