import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { Token } from "@/lib/types/token";

/**
 * Birdeye Search API Response Item
 * Based on actual API response structure
 */
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

/**
 * Transform Birdeye search item to our Token format
 */
function transformSearchItemToToken(item: BirdeyeSearchItem): Token {
  const rawVolume = item.volume_24h_usd || 0;
  const rawPrice = item.price || 0;

  console.log(item);

  return {
    id: item.address,
    name: item.name === "Wrapped SOL" ? "Solana" : item.name || "Unknown Token",
    symbol: item.symbol?.toUpperCase() || "???",
    imgUrl: item.logo_uri || "/logo.svg",
    price: "", // Will be formatted by the caller based on currency preference
    change: item.price_change_24h_percent || 0,
    volume: "", // Will be formatted by the caller
    rawVolume,
    marketCap: item.market_cap || 0,
    rawPrice,
  };
}

/**
 * Search for tokens using Birdeye API
 * Searches by token name with target=token
 * @param keyword - Search keyword (token name)
 * @returns Array of tokens in our standard Token format
 */
export async function searchTokens(keyword: string): Promise<Token[]> {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }

  try {
    const params = {
      keyword,
      target: "token",
      search_by: "name",
      sort_by: "marketcap",
      ui_amount_mode: "scaled",
      verify: "true",
    };

    const data = await fetchBirdeyeData<BirdeyeSearchResponse>("/defi/v3/search", params);

    console.log("Search response:", data);

    // Birdeye v3 search returns: { data: { items: [{ result: [...] }] }, success: true }
    // Extract the actual token results
    const searchItems: BirdeyeSearchItem[] = data?.data?.items?.[0]?.result || [];

    // Transform to our Token format
    const tokens = searchItems.map(transformSearchItemToToken);

    return tokens;
  } catch (error) {
    console.error("Error searching tokens:", error);
    throw error;
  }
}
