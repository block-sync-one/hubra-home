"use client";

import React, { useState } from "react";

import { gainers, losers, hotTokens, volume } from "@/lib/constants/tabs-data";
import { TabId, TabIdType } from "@/lib/models";
import { TabsUI, TokenListView } from "@/components/tabs";
import { useTokenData } from "@/lib/hooks/useTokenData";

export default function HotTokens() {
  const tableTabData = [hotTokens, losers, gainers, volume];
  const [selectedTab, setSelectedTab] = useState<TabIdType>(TabId.hotTokens);

  const { hotTokens: hotData, gainers: gainersData, losers: losersData, volume: volumeData, loading, error, retry } = useTokenData();

  const getTokensForTab = () => {
    switch (selectedTab) {
      case TabId.hotTokens:
        return hotData;
      case TabId.gainers:
        return gainersData;
      case TabId.losers:
        return losersData;
      case TabId.volume:
        return volumeData;
      default:
        return [];
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
