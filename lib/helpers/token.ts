import type { Token } from "@/lib/types/token";

/**
 * Filter and sort tokens for different tabs
 */
export class TokenFilter {
  static gainers(tokens: Token[], count = 4): Token[] {
    return tokens
      .filter((t) => t.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, count);
  }

  static losers(tokens: Token[], count = 4): Token[] {
    return tokens
      .filter((t) => t.change < 0)
      .sort((a, b) => a.change - b.change) // Ascending = biggest losers first (-20, -10, -5)
      .slice(0, count);
  }

  static byVolume(tokens: Token[], count = 4): Token[] {
    return tokens.sort((a, b) => b.rawVolume - a.rawVolume).slice(0, count);
  }

  static byMarketCap(tokens: Token[], count = 4): Token[] {
    return [...tokens].sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, count);
  }
}
