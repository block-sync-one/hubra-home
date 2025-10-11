"use client";

import type { TableWrapperProps } from "./types";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import UnifiedTable from "./unified-table";
import { tokensTableConfig } from "./configurations";

import { TabId, TabIdType } from "@/lib/models";
import { TabsUI } from "@/components/tabs";

const TableWrapper: React.FC<TableWrapperProps> = ({ tabs, data, isLoading, onAssetClick }) => {
  // State
  const [filterValue, setFilterValue] = useState("");
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

  // Reset filter and selected asset when tab changes
  useEffect(() => {
    setFilterValue("");
  }, [tab]);

  // Callbacks
  const handleAssetClick = useCallback(
    (asset: any) => {
      onAssetClick?.(asset);
    },
    [onAssetClick, tab]
  );

  const handleFilterChange = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const handleFilterClear = useCallback(() => {
    setFilterValue("");
  }, []);

  // Memoized top content
  const topContent = useMemo(
    () => (
      <div className="w-full lg:bg-card lg:px-4 lg:pt-4 pb-0 rounded-t-lg">
        <div className="w-full relative mb-4">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-30" />
          <div className="flex flex-row items-center justify-between">
            <div className="hidden lg:flex">
              <TabsUI
                selectedTab={tab}
                tabsData={tabs.map((t) => ({
                  id: t.id,
                  label: t.label,
                  itemCount: t.itemCount,
                }))}
                onTabChange={setTab}
              />
            </div>
            {/* <Button className=" lg:flex mb-3" color="primary" size="sm" variant="flat">
              <Icon icon="carbon:clean" width={18} /> Clean your wallet
            </Button> */}
          </div>
        </div>
        <div className=" lg:hidden">
          <TabsUI
            selectedTab={tab}
            tabsData={tabs.map((t) => ({
              id: t.id,
              label: t.label,
              itemCount: t.itemCount,
            }))}
            onTabChange={setTab}
          />
        </div>
      </div>
    ),
    [tab, tabs, filterValue, handleFilterChange, handleFilterClear]
  );

  return (
    <div className="w-full mx-auto flex flex-col">
      {topContent}

      <UnifiedTable
        configuration={tokensTableConfig as any}
        data={currentData}
        filterValue={filterValue}
        isLoading={isLoading}
        selectedTab={tab}
        onRowClick={handleAssetClick}
      />
    </div>
  );
};

export default React.memo(TableWrapper);
