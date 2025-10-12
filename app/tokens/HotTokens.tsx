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
    <section className="py-12">
      <TabsUI className="mb-4" selectedTab={selectedTab} tabsData={tableTabData} onTabChange={setSelectedTab} />
      <TokenListView error={error} loading={loading} tokens={getTokensForTab()} onRetry={retry} />
    </section>
  );
}
