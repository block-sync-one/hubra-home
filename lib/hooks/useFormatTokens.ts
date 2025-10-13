/**
 * Shared hook for formatting token data with user's currency preference
 * Formats rawPrice and rawVolume into display strings
 */

import { useMemo } from "react";

import { Token } from "@/lib/types/token";
import { useCurrency } from "@/lib/context/currency-format";
import { formatBigNumbers } from "@/lib/utils";

/**
 * Format tokens with user's currency preference
 * Converts raw numeric values to formatted display strings
 *
 * @param tokens - Array of tokens with rawPrice and rawVolume
 * @returns Array of tokens with formatted price and volume strings
 */
export function useFormatTokens(tokens: Token[]): Token[] {
  const { formatPrice } = useCurrency();

  return useMemo(() => {
    return tokens.map((token) => ({
      ...token,
      price: token.price || formatPrice(token.rawPrice || 0),
      volume: token.volume || formatBigNumbers(token.rawVolume || 0),
    }));
  }, [tokens, formatPrice]);
}
