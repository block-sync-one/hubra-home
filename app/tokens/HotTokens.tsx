import React, { useState } from "react";

import { gainers, losers, hotTokens, volume } from "@/lib/constants/tabs-data";
import { TabId, TabIdType } from "@/lib/models";
import { TabContent, TabsUI } from "@/components/tabs";

export default function HotTokens() {
  const tableTabData = [hotTokens, losers, gainers, volume];

  const [selectedTab, setSelectedTab] = useState<TabIdType>(TabId.hotTokens);

  return (
    <section className="py-12">
      <TabsUI
        className="mb-4"
        selectedTab={selectedTab}
        tabsData={tableTabData}
        onTabChange={setSelectedTab}
      />
      <TabContent tabId={selectedTab} />
    </section>
  );
}
