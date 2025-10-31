/**
 * Token Data Formatting Utilities
 * Reusable formatting functions for token data display
 */

import { FALLBACK_VALUES } from "@/lib/constants/token-detail";

/**
 * Format a number with optional prefix
 * Returns "N/A" if value is falsy
 */
export function formatNumberWithPrefix(value: number | undefined | null, formatter: (value: number) => string, prefix = ""): string {
  if (!value && value !== 0) {
    return FALLBACK_VALUES.NOT_AVAILABLE;
  }

  return prefix + formatter(value);
}

/**
 * Calculate buy/sell volume percentages
 * Returns default percentages if calculation not possible
 */
export function calculateVolumePercentages(
  buyVolume: number | undefined,
  sellVolume: number | undefined,
  totalVolume: number | undefined,
  defaultPercent: number = 50
): { buyPercent: number; sellPercent: number } {
  const safeTotal = totalVolume && totalVolume > 0 ? totalVolume : 1;
  const safeBuy = buyVolume ?? 0;
  const safeSell = sellVolume ?? 0;

  if (safeTotal <= 0 || (safeBuy === 0 && safeSell === 0)) {
    return {
      buyPercent: defaultPercent,
      sellPercent: defaultPercent,
    };
  }

  return {
    buyPercent: (safeBuy / safeTotal) * 100,
    sellPercent: (safeSell / safeTotal) * 100,
  };
}

/**
 * Safely get logo URL with fallback
 */
export function getSafeLogoUrl(logoUri: string | undefined | null): string {
  return logoUri || FALLBACK_VALUES.DEFAULT_LOGO;
}

/**
 * Generate fallback token description
 */
export function getTokenDescription(name: string, symbol: string, customDescription?: string): string {
  return customDescription || FALLBACK_VALUES.DEFAULT_DESCRIPTION_TEMPLATE(name, symbol);
}
