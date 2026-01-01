"use client";

/**
 * Protocols Table Component
 * Reuses UnifiedTable component with custom protocols configuration
 * Uses shared UI components for consistency
 */

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import UnifiedTable from "@/components/table/unified-table";
import { protocolsTableConfig } from "@/components/table/configurations";
import { TableToolbar, MobileListLayout, type MobileListItem } from "@/components/ui";
import { Protocol } from "@/lib/types/defi-stats";
import { prepareProtocolsForTable, filterProtocols } from "@/lib/helpers/protocol";
import { formatCurrency } from "@/lib/utils/helper";

interface ProtocolsTableProps {
  protocols: Protocol[];
}

export function ProtocolsTable({ protocols }: ProtocolsTableProps) {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");

  const filteredAndSorted = useMemo(() => {
    let result = protocols;

    // Apply filter
    if (filterValue) {
      result = filterProtocols(result, filterValue);
    }

    // Sort by TVL descending
    result.sort((a, b) => (b.tvl || 0) - (a.tvl || 0));

    return result;
  }, [protocols, filterValue]);

  // Prepare protocols data for table (adds _index property)
  const tableData = useMemo(() => prepareProtocolsForTable(filteredAndSorted), [filteredAndSorted]);

  // Handle protocol row click
  const handleProtocolClick = useCallback(
    (protocol: Protocol | MobileListItem) => {
      const protocolId = "id" in protocol ? protocol.id : protocol.key;

      router.push(`/defi/${protocolId.toLowerCase()}`);
    },
    [router]
  );

  // Convert protocols to mobile list format
  const mobileListItems = useMemo<MobileListItem[]>(() => {
    return tableData.map((protocol) => {
      return {
        key: protocol.id,
        logo: protocol.logo,
        name: protocol.name,
        subtitle: protocol.assetToken || protocol.symbol || "-",
        primaryValue: formatCurrency(protocol.tvl, true),
      };
    });
  }, [tableData]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Toolbar with title and search */}
      <TableToolbar
        showSearch
        searchPlaceholder="Search protocols..."
        searchValue={filterValue}
        title="All Protocols"
        variant="simple"
        onSearchChange={setFilterValue}
      />

      {/* Mobile View - Shared mobile list layout */}
      <MobileListLayout emptyMessage="No protocols available" items={mobileListItems} onItemClick={handleProtocolClick} />

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

// Memoized version for performance
export const MemoizedProtocolsTable = React.memo(ProtocolsTable);
