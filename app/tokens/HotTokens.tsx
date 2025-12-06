"use client";

import React, { useState } from "react";
import Image from "next/image";

import { gainers, losers, hotTokens, volume } from "@/lib/constants/tabs-data";
import { TabId, TabIdType } from "@/lib/models";
import { TabsUI, TokenListView } from "@/components/tabs";
import { Token } from "@/lib/types/token";

interface HotTokensProps {
  initialGainers: Token[];
  initialLosers: Token[];
  initialVolume: Token[];
  initialTrending: Token[];
}

export default function HotTokens({ initialGainers, initialLosers, initialVolume, initialTrending }: HotTokensProps) {
  const tableTabData = [hotTokens, losers, gainers, volume];
  const [selectedTab, setSelectedTab] = useState<TabIdType>(TabId.hotTokens);

  const getTokensForTab = () => {
    switch (selectedTab) {
      case TabId.hotTokens:
        return initialTrending;
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

  return (
    <div className="relative w-full py-8 md:py-20 ">
      <div
        className="absolute inset-0"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          zIndex: 0,
        }}>
        <div className="w-screen h-full">
          <Image
            fill
            priority
            alt="hot token bg"
            className="object-cover object-center"
            quality={85}
            sizes="100vw"
            src="/image/hot-tokens-bg.png"
          />
        </div>
      </div>

      {/* Content */}
      <div className="md:max-w-7xl mx-auto w-full flex flex-col items-start justify-center ">
        <TabsUI className="mb-8 border-b border-gray-30" selectedTab={selectedTab} tabsData={tableTabData} onTabChange={setSelectedTab} />
        <TokenListView error={null} loading={false} tokens={getTokensForTab()} />
      </div>
    </div>
  );
}
