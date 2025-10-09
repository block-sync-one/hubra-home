/**
 * Token Helper Functions
 * Simple, pure functions following Next.js best practices
 */

import type { Token, TokenDetail } from "@/lib/types/token";

import { fixedNumber, formatBigNumbers } from "@/lib/utils";

// Define minimal types we need here
type BirdeyeTokenRaw = {
  address: string;
  name: string;
  symbol: string;
  logo_uri?: string;
  price?: number;
  price_change_24h_percent?: number;
  volume_24h_usd?: number;
  liquidity?: number;
};

type BirdeyeTokenOverview = {
  address: string;
  name: string;
  symbol: string;
  logo_uri?: string;
  price: number;
  price_change_24h_percent: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  trade_count_24h: number;
  holder: number;
  buy_volume_24h: number | null;
  sell_volume_24h: number | null;
  buy_volume_percent: number | null;
  sell_volume_percent: number | null;
  extensions?: {
    description?: string;
    website?: string;
    twitter?: string;
  };
};

/**
 * Format number or return fallback
 */
function formatOr(value: number | null | undefined, formatter: (n: number) => string, fallback = "N/A"): string {
  if (value == null || value <= 0) return fallback;

  return formatter(value);
}

/**
 * Shorten Solana address
 */
export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return "...";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get best available image URL
 */
export function getTokenImage(apiData: { logo_uri?: string; logoURI?: string; image?: string }, contextImgUrl?: string): string {
  return contextImgUrl || apiData.logo_uri || (apiData as any).logoURI || (apiData as any).image || "/logo.svg";
}

/**
 * Transform Birdeye token to simple list item
 */
export function toTokenListItem(token: BirdeyeTokenRaw, formatPrice: (n: number) => string): Token {
  const rawVolume = token.volume_24h_usd || 0;

  return {
    id: token.address,
    name: token.name,
    symbol: token.symbol.toUpperCase(),
    imgUrl: token.logo_uri || "/logo.svg",
    price: formatPrice(token.price || 0),
    change: token.price_change_24h_percent || 0,
    volume: formatBigNumbers(rawVolume),
    rawVolume,
  };
}

/**
 * Transform Birdeye token overview to detailed token
 */
export function toTokenDetail(
  apiData: BirdeyeTokenOverview,
  formatPrice: (n: number, full?: boolean) => string,
  contextImgUrl?: string
): TokenDetail {
  // Buy/sell volumes
  const hasBuySell = apiData.buy_volume_24h != null && apiData.sell_volume_24h != null;
  const buyVolume = hasBuySell ? formatPrice(apiData.buy_volume_24h!) : "-";
  const sellVolume = hasBuySell ? formatPrice(apiData.sell_volume_24h!) : "-";
  const buyPercent = apiData.buy_volume_percent ?? 50;
  const sellPercent = apiData.sell_volume_percent ?? 50;

  // Description
  const description = apiData.extensions?.description || `${apiData.name} (${apiData.symbol}) is a token on the Solana blockchain.`;

  return {
    // Basic
    name: apiData.name,
    symbol: apiData.symbol,
    imgUrl: getTokenImage(apiData, contextImgUrl),
    address: apiData.address,
    addressShort: shortenAddress(apiData.address),

    // Price
    price: formatPrice(apiData.price, true),
    priceChange: fixedNumber(apiData.price_change_24h_percent),
    priceChangePercent: apiData.price_change_24h_percent,

    // Market
    marketCap: formatOr(apiData.market_cap, formatPrice),
    volume24h: formatOr(apiData.volume_24h, formatPrice),
    supply: formatOr(apiData.circulating_supply, formatBigNumbers),

    // Trading
    buyVolume,
    sellVolume,
    buyPercent,
    sellPercent,

    // Stats
    holders: formatOr(apiData.holder, (n) => n.toLocaleString()),
    trades: formatOr(apiData.trade_count_24h, (n) => n.toLocaleString()),

    // Info
    description,
    website: apiData.extensions?.website || "https://hubra.app",
    twitter: apiData.extensions?.twitter || "https://twitter.com/hubra",
  };
}

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
      .sort((a, b) => a.change - b.change)
      .slice(0, count);
  }

  static byVolume(tokens: Token[], count = 4): Token[] {
    return tokens.sort((a, b) => b.rawVolume - a.rawVolume).slice(0, count);
  }

  static hot(tokens: Token[], count = 4): Token[] {
    return tokens.slice(0, count);
  }
}
