import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { Token } from "@/lib/types/token";
import { MARKET_CAP_FILTERS } from "@/lib/constants/market";

export interface BirdeyeSearchItem {
  name: string;
  symbol: string;
  address: string;
  network: string;
  decimals: number;
  verified: boolean;
  fdv?: number;
  market_cap?: number;
  liquidity?: number;
  price?: number;
  price_change_24h_percent?: number;
  sell_24h?: number;
  sell_24h_change_percent?: number | null;
  buy_24h?: number;
  buy_24h_change_percent?: number | null;
  unique_wallet_24h?: number;
  unique_wallet_24h_change_percent?: number | null;
  trade_24h?: number;
  trade_24h_change_percent?: number | null;
  volume_24h_change_percent?: number | null;
  volume_24h_usd?: number;
  last_trade_unix_time?: number;
  last_trade_human_time?: string;
  updated_time?: number;
  creation_time?: string;
  is_scaled_ui_token?: boolean;
  multiplier?: number | null;
  logo_uri?: string; // Optional: some tokens may have this field
}

interface BirdeyeSearchResponse {
  data: {
    items: Array<{
      result: BirdeyeSearchItem[];
    }>;
  };
  success: boolean;
}

function transformSearchItemToToken(item: BirdeyeSearchItem): Token {
  const rawVolume = item.volume_24h_usd || 0;
  const rawPrice = item.price || 0;

  return {
    id: item.address,
    name: item.name === "Wrapped SOL" ? "Solana" : item.name || "Unknown Token",
    symbol: item.symbol?.toUpperCase() || "???",
    logoURI: item.logo_uri || "/logo.svg",
    price: "", // Will be formatted by the caller based on currency preference
    change: item.price_change_24h_percent || 0,
    volume: "", // Will be formatted by the caller
    rawVolume,
    fdv: item.fdv || 0,
    marketCap: item.market_cap || 0,
    rawPrice,
  };
}

/**
 * Search for tokens using Birdeye API
 * Filters out spam tokens with market cap below threshold
 *
 * @param keyword - Search term (token name, symbol, or address)
 * @returns Array of matching tokens sorted by volume
 */
export async function searchTokens(keyword: string): Promise<Token[]> {
  // Return empty array for invalid input
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  try {
    const params = {
      keyword: keyword.trim(),
      target: "token",
      search_mode: "fuzzy",
      search_by: "combination",
      sort_by: "volume_24h_usd",
      sort_type: "desc",
      ui_amount_mode: "scaled",
    };

    const data = await fetchBirdeyeData<BirdeyeSearchResponse>("/defi/v3/search", params);

    const searchItems: BirdeyeSearchItem[] = data?.data?.items?.[0]?.result || [];

    // Filter out spam/dead tokens using constant threshold
    return searchItems
      .map(transformSearchItemToToken)
      .filter((token) => token.marketCap && token.marketCap > MARKET_CAP_FILTERS.MIN_VIABLE);
  } catch (error) {
    // Re-throw error to be handled by caller
    throw error;
  }
}
