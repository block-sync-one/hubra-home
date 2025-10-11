/**
 * Token Type Definitions
 * Simple, clean interfaces following Next.js best practices
 */

/**
 * Token for display in lists (cards, tables)
 */
export interface Token {
  id: string; // Solana address
  name: string;
  symbol: string;
  imgUrl: string;
  price: string; // Formatted price
  change: number; // Price change % (for sorting/filtering)
  volume: string; // Formatted volume
  rawVolume: number; // Raw volume for sorting
  marketCap?: number; // Market cap for sorting
  rawPrice?: number; // Raw price for calculations
}

/**
 * Detailed token data for token detail page
 */
export interface TokenDetail {
  // Basic
  name: string;
  symbol: string;
  imgUrl: string;
  address: string; // Full address
  addressShort: string; // Shortened for display

  // Price
  price: string;
  priceChange: string; // Formatted with sign
  priceChangePercent: number; // Raw number

  // Market
  marketCap: string;
  volume24h: string;
  supply: string;

  // Trading
  buyVolume: string;
  sellVolume: string;
  buyPercent: number;
  sellPercent: number;

  // Stats
  holders: string;
  trades: string;

  // Info
  description: string;
  website: string;
  twitter: string;
}
