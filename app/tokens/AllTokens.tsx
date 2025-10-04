import React, { useMemo } from "react";

import { useAllTokens } from "@/lib/context/allTokens";
import {
  tradable,
  allAssets,
  gainers,
  losers,
  newlyListed,
} from "@/lib/constants/tabs-data";
import { TableWrapper } from "@/components/table";

export default function AllTokens() {
  const { data, isLoading } = useAllTokens();
  const tableTabData = [tradable, allAssets, gainers, losers, newlyListed];

  const tabTableData = useMemo(() => {
    if (!data) return tableTabData;

    return tableTabData.map((item: any) => ({
      id: item.id,
      label: item.label,
    }));
  }, [data]);

  return (
    <section>
      <h2 className="text-xl font-semibold">All Tokens</h2>
      <TableWrapper data={data} isLoading={isLoading} tabs={tabTableData} />
    </section>
  );
}
