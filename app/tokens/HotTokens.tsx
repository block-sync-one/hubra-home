"use client";

import React, { useState } from "react";

import { gainers, losers, hotTokens, volume } from "@/lib/constants/tabs-data";
import { TabId, TabIdType } from "@/lib/models";
import { TabsUI, TokenListView } from "@/components/tabs";
import { useEagerPrefetch } from "@/lib/hooks/useEagerPrefetch";
import { Token } from "@/lib/types/token";

interface HotTokensProps {
  initialGainers: Token[];
  initialLosers: Token[];
  initialVolume: Token[];
}

export default function HotTokens({ initialGainers, initialLosers, initialVolume }: HotTokensProps) {
  const tableTabData = [hotTokens, losers, gainers, volume];
  const [selectedTab, setSelectedTab] = useState<TabIdType>(TabId.hotTokens);

  // Use trending data for Hot Tokens tab, market data for others
  const [hotData, setHotData] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending tokens only for Hot Tokens tab
  React.useEffect(() => {
    if (selectedTab === TabId.hotTokens) {
      const fetchTrending = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch("/api/crypto/trending?limit=4");

          if (!response.ok) {
            throw new Error("Failed to fetch trending tokens");
          }

          const data = await response.json();

          if (data?.coins) {
            // Transform trending data to match Token interface
            const trendingTokens: Token[] = data.coins.map((item: any) => ({
              id: item.item.coin_id || item.item.address,
              name: item.item.name === "Wrapped SOL" ? "Solana" : item.item.name,
              symbol: item.item.symbol.toUpperCase(),
              imgUrl: item.item.small || item.item.logoURI || "/logo.svg",
              price: "", // Will be formatted by client
              change: item.item.data?.price_change_percentage_24h?.usd || 0,
              volume: "", // Will be formatted by client
              rawVolume: item.item.data?.volume_24h_usd || 0,
              rawPrice: item.item.data?.price || 0,
              marketCap: item.item.data?.marketcap || 0,
            }));

            setHotData(trendingTokens);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load trending tokens");
        } finally {
          setLoading(false);
        }
      };

      fetchTrending();
    }
  }, [selectedTab]);

  // Eagerly prefetch all visible tokens
  useEagerPrefetch(initialGainers.concat(initialLosers, initialVolume, hotData), { limit: 12 });

  const getTokensForTab = () => {
    switch (selectedTab) {
      case TabId.hotTokens:
        return hotData;
      case TabId.gainers:
        return initialGainers;
      case TabId.losers:
        return initialLosers;
      case TabId.volume:
        return initialVolume;
      default:
        return [];
    }
  };

  const retry = () => {
    // Trigger re-fetch for hot tokens
    if (selectedTab === TabId.hotTokens) {
      setHotData([]);
      setError(null);
    }
  };

  return (
    <div className="relative w-full py-8 md:py-20">
      {/* Full Width Background - breaks out of container */}
      <div
        className="absolute inset-0 w-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/image/hot-tokens-bg.png')",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full flex flex-col items-start justify-center">
        <TabsUI className="mb-4 border-b border-gray-30" selectedTab={selectedTab} tabsData={tableTabData} onTabChange={setSelectedTab} />
        <TokenListView error={error} loading={loading} tokens={getTokensForTab()} onRetry={retry} />
      </div>
    </div>
  );
}
