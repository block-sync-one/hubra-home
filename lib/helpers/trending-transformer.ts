import { Token } from "@/lib/types/token";
import { TrendingData } from "@/lib/data/trending-data";

/**
 * Transform trending API data to Token format
 */
export function transformTrendingToTokens(trendingData: TrendingData): Token[] {
  if (!trendingData?.tokens || trendingData.tokens.length === 0) {
    return [];
  }

  return trendingData.tokens.map((coin) => ({
    id: coin.item.coin_id || coin.item.id,
    name: coin.item.name === "Wrapped SOL" ? "Solana" : coin.item.name,
    symbol: coin.item.symbol.toUpperCase(),
    logoURI: coin.item.small || coin.item.large || "",
    price: "",
    change: coin.item.data?.price_change_percentage_24h?.usd || 0,
    volume: "",
    rawVolume: coin.item.data?.volume_24h_usd || 0,
    rawPrice: coin.item.data?.price || 0,
    marketCap: coin.item.data?.marketcap || 0,
    fdv: coin.item.data?.marketcap || 0, // Use marketcap as fdv fallback for trending
  }));
}
