"use client";

import type { Token } from "@/lib/types/token";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { allAssets, gainers, losers, newlyListed } from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";
import { TabId } from "@/lib/models";
import { useFormatTokens } from "@/lib/hooks/useFormatTokens";

interface AllTokensClientProps {
  initialAllTokens: Token[];
  initialGainers: Token[];
  initialLosers: Token[];
  initialNewlyListed: Token[];
}

export default function AllTokensClient({ initialAllTokens, initialGainers, initialLosers, initialNewlyListed }: AllTokensClientProps) {
  const router = useRouter();

  // Format tokens for display
  const formattedAllTokens = useFormatTokens(initialAllTokens);
  const formattedGainers = useFormatTokens(initialGainers);
  const formattedLosers = useFormatTokens(initialLosers);
  const formattedNewlyListed = useFormatTokens(initialNewlyListed);

  // Update tab data with item counts
  const tableTabData = useMemo(
    () => [
      { ...allAssets, itemCount: formattedAllTokens.length },
      { ...losers, itemCount: formattedLosers.length },
      { ...gainers, itemCount: formattedGainers.length },
      { ...newlyListed, itemCount: formattedNewlyListed.length },
    ],
    [formattedAllTokens.length, formattedLosers.length, formattedGainers.length, formattedNewlyListed.length]
  );

  // Handle token row click - navigate to token details page
  const handleTokenClick = useCallback(
    (token: Token) => {
      router.push(`/tokens/${token.id}`);
    },
    [router]
  );

  // Prefetch token page on hover for instant navigation
  const handleTokenHover = useCallback(
    (token: Token) => {
      router.prefetch(`/tokens/${token.id}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-1 md:gap-6">
      <h2 className="text-lg md:text-2xl font-medium text-white">All Tokens</h2>

      <TableWrapper
        data={{
          [TabId.allAssets]: formattedAllTokens,
          [TabId.gainers]: formattedGainers,
          [TabId.losers]: formattedLosers,
          [TabId.newlyListed]: formattedNewlyListed,
        }}
        isLoading={false}
        tabs={tableTabData}
        onAssetClick={handleTokenClick}
        onAssetHover={handleTokenHover}
      />
    </div>
  );
}
