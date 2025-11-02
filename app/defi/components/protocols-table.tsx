"use client";

/**
 * Protocols Table Component
 * Reuses UnifiedTable component with custom protocols configuration
 * Follows the same pattern as tokens table for consistency
 */

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import UnifiedTable from "@/components/table/unified-table";
import { protocolsTableConfig } from "@/components/table/configurations";
import { ProtocolListView } from "@/components/table/mobile-views/protocol-list-view";
import { SearchField } from "@/components/ui/search-field";
import { Protocol } from "@/lib/types/defi-stats";
import { prepareProtocolsForTable, filterProtocols, sortProtocols } from "@/lib/helpers/protocol";

interface ProtocolsTableProps {
  protocols: Protocol[];
}

export function ProtocolsTable({ protocols }: ProtocolsTableProps) {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");

  // Filter and sort protocols for mobile view
  const filteredAndSorted = useMemo(() => {
    let result = protocols;

    // Apply filter
    if (filterValue) {
      result = filterProtocols(result, filterValue);
    }

    // Default sort by TVL descending
    result = sortProtocols(result, "tvl", "descending");

    return result;
  }, [protocols, filterValue]);

  // Prepare protocols data for table (adds _index property)
  const tableData = useMemo(() => prepareProtocolsForTable(filteredAndSorted), [filteredAndSorted]);

  // Handle protocol row click
  const handleProtocolClick = (protocol: Protocol) => {
    router.push(`/defi/${protocol.id.toLowerCase()}`);
  };

  // Custom top content with search
  const topContent = useMemo(
    () => (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-white">All Protocols</h2>
        <div className="w-full md:max-w-xs">
          <SearchField placeholder="Search protocols..." value={filterValue} onChange={setFilterValue} onClear={() => setFilterValue("")} />
        </div>
      </div>
    ),
    [filterValue]
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      {topContent}

      {/* Mobile View - Custom protocol list */}
      <ProtocolListView protocols={tableData} onProtocolClick={handleProtocolClick} />

      {/* Desktop View - UnifiedTable */}
      <div className="hidden md:block">
        <UnifiedTable<Protocol>
          configuration={protocolsTableConfig}
          data={tableData}
          filterValue={filterValue}
          isLoading={false}
          onRowClick={handleProtocolClick}
        />
      </div>
    </div>
  );
}
