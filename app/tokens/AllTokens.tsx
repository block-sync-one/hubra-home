import AllTokensClient from "./AllTokensClient";

import { Token } from "@/lib/types/token";

interface AllTokensProps {
  initialAllTokens: Token[];
  initialGainers: Token[];
  initialLosers: Token[];
}

/**
 * Server Component - Receives pre-fetched market data from parent
 * Data is fetched once at the page level and shared between HotTokens and AllTokens
 * This ensures both sections use the same data source
 */
export default function AllTokens({ initialAllTokens, initialGainers, initialLosers }: AllTokensProps) {
  return <AllTokensClient initialAllTokens={initialAllTokens} initialGainers={initialGainers} initialLosers={initialLosers} />;
}
