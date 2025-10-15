"use client";

import type { Token } from "@/lib/types/token";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

import { allAssets, gainers, losers, newlyListed } from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";
import { TabId } from "@/lib/models";
import { useFormatTokens } from "@/lib/hooks/useFormatTokens";

interface AllTokensClientProps {
  initialAllTokens: Token[];
  initialGainers: Token[];
  initialLosers: Token[];
}

export default function AllTokensClient({ initialAllTokens, initialGainers, initialLosers }: AllTokensClientProps) {
  const router = useRouter();
  const tableTabData = [allAssets, losers, gainers, newlyListed];

  const formattedAllTokens = useFormatTokens(initialAllTokens);
  const formattedGainers = useFormatTokens(initialGainers);
  const formattedLosers = useFormatTokens(initialLosers);

  // Handle token row click - navigate to token details page
  const handleTokenClick = useCallback(
    (token: Token) => {
      router.push(`/tokens/${token.id}`);
    },
    [router]
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
