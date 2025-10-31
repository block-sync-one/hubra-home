/**
 * Market Data Constants
 * Centralized configuration for market data fetching and filtering
 */

// Token Limits
export const TOKEN_LIMITS = {
  DEFAULT: 100,
  TOKENS_PAGE: 400,
  HOT_TOKENS: 4,
  SEARCH_MAX: 50,
} as const;

// Time Windows (in seconds)
export const TIME_WINDOWS = {
  ONE_HOUR: 60 * 60,
  ONE_DAY: 24 * 60 * 60,
  ONE_WEEK: 7 * 24 * 60 * 60,
  ONE_MONTH: 30 * 24 * 60 * 60,
} as const;

// Market Cap Filters (in USD)
export const MARKET_CAP_FILTERS = {
  MIN_VIABLE: 10_000, // $10k minimum to filter spam tokens
  SMALL_CAP: 100_000, // $100k
  MID_CAP: 1_000_000, // $1M
  LARGE_CAP: 100_000_000, // $100M
} as const;

// Birdeye API Query Params Presets
export const BIRDEYE_QUERY_PRESETS = {
  DEFAULT: {
    sort_by: "holder",
    sort_type: "desc",
    min_holder: "10",
    min_volume_24h_usd: "10",
    min_trade_24h_count: "10",
  },
  NEWLY_LISTED: {
    sort_by: "volume_24h_usd",
    sort_type: "desc",
  },
  HIGH_VOLUME: {
    sort_by: "volume_24h_usd",
    sort_type: "desc",
    min_volume_24h_usd: "1000",
  },
  TOP_GAINERS: {
    sort_by: "price_change_24h_percent",
    sort_type: "desc",
  },
  TOP_LOSERS: {
    sort_by: "price_change_24h_percent",
    sort_type: "asc",
  },
} as const;

// Birdeye API Limits
export const BIRDEYE_LIMITS = {
  MAX_PER_REQUEST: 100,
  BATCH_SIZE: 50, // For async caching
} as const;

// Helper function to get timestamp N seconds ago
export function getTimestampSecondsAgo(seconds: number): number {
  return Math.floor(Date.now() / 1000) - seconds;
}

// Helper function to build newly listed query params
export function buildNewlyListedQuery(hoursAgo: number = 24): Record<string, string> {
  const timestamp = getTimestampSecondsAgo(hoursAgo * 60 * 60);

  return {
    ...BIRDEYE_QUERY_PRESETS.NEWLY_LISTED,
    min_recent_listing_time: timestamp.toString(),
  };
}
