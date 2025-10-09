"use client";

import React, { useMemo } from "react";

import { tradable, allAssets, gainers, losers, newlyListed } from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";

export default function AllTokens() {
  const data = [] as any[];
  const isLoading = false;
  const tableTabData = [tradable, allAssets, gainers, losers, newlyListed];

  const tabTableData = useMemo(() => {
    if (!data) return tableTabData;

    return tableTabData.map((item: any) => ({
      id: item.id,
      label: item.label,
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-white">All Tokens</h2>

      <TableWrapper data={data} isLoading={isLoading} tabs={tabTableData} />
    </div>
  );
}
