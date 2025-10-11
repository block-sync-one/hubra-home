import AllTokensClient from "./AllTokensClient";

import { fetchMarketData } from "@/lib/data/market-data";
import { TokenFilter } from "@/lib/helpers/token";

/**
 * Server Component - Fetches market data server-side
 * Uses shared Birdeye service for data fetching
 * Returns raw data; client component formats with user's currency preference
 */
export default async function AllTokens() {
  // Fetch 200 tokens server-side using shared Birdeye service
  const tokens = await fetchMarketData(200, 0, { revalidate: 120 });

  // Use TokenFilter helper for consistent sorting logic (count = array length to show all)
  const allAssetsSorted = TokenFilter.byMarketCap(tokens, tokens.length);
  const gainersSorted = TokenFilter.gainers(tokens, tokens.length);
  const losersSorted = TokenFilter.losers(tokens, tokens.length);

  return <AllTokensClient initialAllTokens={allAssetsSorted} initialGainers={gainersSorted} initialLosers={losersSorted} />;
}
