/**
 * BirdEye API Response Type Definitions
 *
 * @description Type definitions for all BirdEye API responses used in the application.
 * These interfaces represent the raw data structure from BirdEye API.
 *
 * @see {@link https://docs.birdeye.so/reference} BirdEye API Documentation
 * @since 2.0.0
 */

/**
 * BirdEye Token Overview Response
 * Endpoint: /defi/token_overview?ui_amount_mode=scaled
 */
export interface BirdEyeTokenOverview {
  data: {
    address: string;
    decimals: number;
    symbol: string;
    name: string;
    marketCap: number;
    fdv: number;
    extensions: {
      coingeckoId: string;
      description: string;
      twitter: string;
      website: string;
      discord: string;
    };
    logoURI: string;
    liquidity: number;
    lastTradeUnixTime: number;
    lastTradeHumanTime: string;
    price: number;
    history24hPrice: number;
    priceChange24hPercent: number;
    uniqueWallet24h: number;
    uniqueWalletHistory24h: number;
    uniqueWallet24hChangePercent: number;
    totalSupply: number;
    circulatingSupply: number;
    holder: number;
    trade24h: number;
    tradeHistory24h: number;
    trade24hChangePercent: number;
    sell24h: number;
    sellHistory24h: number;
    sell24hChangePercent: number;
    buy24h: number;
    buyHistory24h: number;
    buy24hChangePercent: number;
    v24h: number;
    v24hUSD: number;
    vHistory24h: number;
    vHistory24hUSD: number;
    v24hChangePercent: number;
    vBuy24h: number;
    vBuy24hUSD: number;
    vBuyHistory24h: number;
    vBuyHistory24hUSD: number;
    vBuy24hChangePercent: number;
    vSell24h: number;
    vSell24hUSD: number;
    vSellHistory24h: number;
    vSellHistory24hUSD: number;
    vSell24hChangePercent: number;
    numberMarkets: number;
    isScaledUiToken: boolean;
    multiplier: any;
  };
  success: boolean;
}

/**
 * BirdEye Trade Item
 */
export interface BirdEyeTradeItem {
  blockUnixTime: number;
  price: number;
  volume: number;
}

/**
 * Generic BirdEye API Response Wrapper
 */
export interface BirdEyeApiResponse<T> {
  data: T;
  success: boolean;
}
