"use client";

import type { Token } from "@/lib/types/token";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { allAssets, gainers, losers, newlyListed } from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";
import { useCurrentToken } from "@/lib/context/current-token-context";
import { useCurrency } from "@/lib/context";
import { formatBigNumbers } from "@/lib/utils";
import { TabId } from "@/lib/models";

interface AllTokensClientProps {
  initialAllTokens: Token[];
  initialGainers: Token[];
  initialLosers: Token[];
}

export default function AllTokensClient({ initialAllTokens, initialGainers, initialLosers }: AllTokensClientProps) {
  const router = useRouter();
  const { setCurrentToken } = useCurrentToken();
  const { formatPrice } = useCurrency();

  const tableTabData = [allAssets, gainers, losers, newlyListed];

  // Format tokens with user's currency preference (client-side)
  const formatTokens = useCallback(
    (tokens: Token[]) =>
      tokens.map((token) => ({
        ...token,
        price: token.rawPrice ? formatPrice(token.rawPrice) : "N/A",
        volume: formatBigNumbers(token.rawVolume),
      })),
    [formatPrice]
  );

  const formattedAllTokens = useMemo(() => formatTokens(initialAllTokens), [initialAllTokens, formatTokens]);
  const formattedGainers = useMemo(() => formatTokens(initialGainers), [initialGainers, formatTokens]);
  const formattedLosers = useMemo(() => formatTokens(initialLosers), [initialLosers, formatTokens]);

  // Handle token row click - navigate to token details page
  const handleTokenClick = useCallback(
    (token: Token) => {
      // Store token data in context for quick access
      setCurrentToken(token);

      // Navigate to token details page using the token ID
      router.push(`/tokens/${token.id}`);
    },
    [router, setCurrentToken]
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-white">All Tokens</h2>

      <TableWrapper
        data={{
          [TabId.allAssets]: formattedAllTokens,
          [TabId.gainers]: formattedGainers,
          [TabId.losers]: formattedLosers,
          [TabId.newlyListed]: [],
        }}
        isLoading={false}
        tabs={tableTabData}
        onAssetClick={handleTokenClick}
      />
    </div>
  );
}
