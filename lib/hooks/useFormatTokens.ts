import { useMemo } from "react";

import { Token } from "@/lib/types/token";
import { useCurrency } from "@/lib/context/currency-format";
import { formatBigNumbers } from "@/lib/utils";

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
