"use client";

import type { TableWrapperProps } from "./types";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import UnifiedTable from "./unified-table";
import { tokensTableConfig } from "./configurations";
import { SearchInput } from "./search-input";

import { TabId, TabIdType } from "@/lib/models";
import { TabsUI } from "@/components/tabs";

const TableWrapper: React.FC<TableWrapperProps> = ({ tabs, data, isLoading, onAssetClick }) => {
  // State
  const [tab, setTab] = useState<TabIdType>(tabs[0]?.id || TabId.allAssets);

  const currentData = useMemo(() => {
    return data?.[tab] || [];
  }, [data, tab]);

  useEffect(() => {
    if (!tabs?.length) return;
    if (!tabs.some((t) => t.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [tabs, tab]);

  // Callbacks
  const handleAssetClick = useCallback(
    (asset: any) => {
      onAssetClick?.(asset);
    },
    [onAssetClick]
  );

  // Memoized top content
  const topContent = useMemo(
    () => (
      <div className="w-full lg:bg-card lg:px-4 lg:pt-4 pb-0 rounded-t-lg">
        <div className="w-full relative mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Tabs - Desktop */}
            <div className="hidden lg:flex">
              <TabsUI
                className="border-b-1 border-gray-30"
                selectedTab={tab}
                tabsData={tabs.map((t) => ({
                  id: t.id,
                  label: t.label,
                }))}
                onTabChange={setTab}
              />
            </div>
            <div className="w-full md:max-w-xs">
              <SearchInput />
            </div>
          </div>
        </div>

        {/* Tabs - Mobile */}
        <div className="lg:hidden mb-4">
          <TabsUI
            selectedTab={tab}
            tabsData={tabs.map((t) => ({
              id: t.id,
              label: t.label,
            }))}
            onTabChange={setTab}
          />
        </div>
      </div>
    ),
    [tab, tabs]
  );

  return (
    <div className="w-full mx-auto flex flex-col">
      {topContent}

      <UnifiedTable
        configuration={tokensTableConfig as any}
        data={currentData}
        filterValue=""
        isLoading={isLoading}
        selectedTab={tab}
        onRowClick={handleAssetClick}
      />
    </div>
  );
};

const MemoizedTableWrapper = React.memo(TableWrapper);

MemoizedTableWrapper.displayName = "TableWrapper";

export default MemoizedTableWrapper;
