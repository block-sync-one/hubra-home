"use client";

import type { Token } from "@/lib/types/token";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

import { allAssets, gainers, losers, newlyListed } from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";
import { useCurrentToken } from "@/lib/context/current-token-context";
import { TabId } from "@/lib/models";
import { useEagerPrefetch } from "@/lib/hooks/useEagerPrefetch";
import { useFormatTokens } from "@/lib/hooks/useFormatTokens";

interface AllTokensClientProps {
  initialAllTokens: Token[];
  initialGainers: Token[];
  initialLosers: Token[];
}

export default function AllTokensClient({ initialAllTokens, initialGainers, initialLosers }: AllTokensClientProps) {
  const router = useRouter();
  const { setCurrentToken } = useCurrentToken();

  const tableTabData = [allAssets, losers, gainers, newlyListed];

  // Eagerly prefetch top 30 tokens (visible in initial viewport)
  // This warms up Redis cache for instant navigation
  useEagerPrefetch(initialAllTokens, { limit: 30 });

  // Format tokens with user's currency preference (shared hook)
  const formattedAllTokens = useFormatTokens(initialAllTokens);
  const formattedGainers = useFormatTokens(initialGainers);
  const formattedLosers = useFormatTokens(initialLosers);

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
