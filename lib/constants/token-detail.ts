/**
 * Token Detail Page Constants
 * Centralized configuration for token detail pages
 */

// Chart Time Periods
export const CHART_PERIODS = ["24h", "7d", "1M", "3M", "1Y", "All"] as const;

export type ChartPeriod = (typeof CHART_PERIODS)[number];

// Volume Display Defaults
export const VOLUME_DEFAULTS = {
  DEFAULT_PERCENT: 50, // When volume data is missing
  MIN_TOTAL_VOLUME: 1, // Minimum to avoid division by zero
} as const;

// Number Formatting
export const NUMBER_FORMAT = {
  DECIMAL_PLACES: 2,
  PRICE_DECIMAL_PLACES: 6,
} as const;

// Fallback Values
export const FALLBACK_VALUES = {
  NOT_AVAILABLE: "N/A",
  DEFAULT_LOGO: "/logo.svg",
  DEFAULT_DESCRIPTION_TEMPLATE: (name: string, symbol: string) => `${name} (${symbol}) is a token on the Solana blockchain.`,
} as const;
