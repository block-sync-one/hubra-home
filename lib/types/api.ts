/**
 * API Response Types
 * Clean type definitions for API responses
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

/**
 * Birdeye token from /defi/v3/token/list
 */
export interface BirdeyeTokenRaw {
  address: string;
  symbol: string;
  name: string;
  logo_uri?: string;
  decimals: number;
  price?: number;
  price_change_24h_percent?: number;
  market_cap?: number;
  volume_24h_usd?: number;
  liquidity?: number;
  holder?: number;
}

/**
 * Birdeye token overview from /defi/token_overview
 */
export interface BirdeyeTokenOverview {
  address: string;
  symbol: string;
  name: string;
  logo_uri?: string;
  decimals: number;
  price: number;
  price_change_24h_percent: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  trade_count_24h: number;
  holder: number;
  liquidity: number;
  extensions?: {
    description?: string;
    website?: string;
    twitter?: string;
    coingeckoId?: string;
  };
}

/**
 * Birdeye OHLCV data point
 */
export interface BirdeyeOHLCV {
  unixTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Price history response
 */
export interface PriceHistoryResponse {
  success: boolean;
  data: Array<{
    timestamp: number;
    price: number;
  }>;
  timeRange?: string;
}
