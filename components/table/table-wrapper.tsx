"use client";

import type { TableWrapperProps } from "./types";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import UnifiedTable from "./unified-table";
import { tokensTableConfig } from "./configurations";

import { TabId, TabIdType } from "@/lib/models";
import { newlyListed } from "@/lib/constants/tabs-data";
import { TabsUI } from "@/components/tabs";

const TableWrapper: React.FC<TableWrapperProps> = ({ tabs, data, isLoading, onAssetClick }) => {
  // State
  const [filterValue, setFilterValue] = useState("");
  const [summaryValue, setSummaryValue] = useState(0);
  const [tab, setTab] = useState<TabIdType>(tabs[0]?.id || TabId.allAssets);

  // Memoized table data per tab
  const [tableDataMap, setTableDataMap] = useState<Record<string, any[]>>({});

  const currentData = useMemo(() => {
    return tableDataMap[tab] || [];
  }, [tableDataMap, tab]);

  // Ensure the selected tab is always valid when tabs/data change
  useEffect(() => {
    if (!tabs?.length) return;
    if (!tabs.some((t) => t.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [tabs, tab]);

  // Update tableDataMap when data or tab changes
  useEffect(() => {
    if (data && data.aggregated && tab) {
      const newData = data.aggregated[tab] ?? [];

      setTableDataMap((prev) => {
        return { ...prev, [tab]: newData };
      });

      setSummaryValue(data.summary.aggregated[tab + "Value"] ?? 0);
    }
  }, [data, tab]);

  // Reset filter and selected asset when tab changes
  useEffect(() => {
    setFilterValue("");
  }, [tab]);

  // Get current configuration based on tab
  const currentConfiguration = useMemo(() => {
    switch (tab) {
      case TabId.tradable:
        return tokensTableConfig;
      default:
        return newlyListed;
    }
  }, [tab]);

  // Callbacks
  const handleAssetClick = useCallback(
    (asset: any) => {
      alert("navigate to asset page");
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
    [tab, tabs, filterValue, handleFilterChange, handleFilterClear, summaryValue]
  );

  return (
    <div className="w-full mx-auto flex flex-col">
      {topContent}

      <UnifiedTable
        configuration={currentConfiguration as any}
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
