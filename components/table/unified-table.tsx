"use client";

import type { TableProps } from "./types";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { SortDescriptor, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

import TableSkeleton from "./skeleton/table-skeleton";

import { MobileListLayout, type MobileListItem } from "@/components/ui/mobile-list-layout";
import { TablePagination } from "@/components/ui/table-pagination";
import { fixedNumber } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/helper";

const get = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

function getAlignmentClass(align?: "left" | "right" | "center"): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "left":
    default:
      return "text-left";
  }
}

function getCellContent(item: any, column: any): React.ReactNode {
  try {
    if (column.render) {
      return column.render(item, get(item, String(column.key))) || "-";
    }

    const value = get(item, String(column.key));

    return value !== null && value !== undefined ? String(value) : "-";
  } catch {
    return "-";
  }
}

const ROWS_PER_PAGE = 100;

interface ReusableTableProps<T> extends TableProps<T> {
  selectedTab?: string;
}

const UnifiedTable = <T extends Record<string, any>>({
  data,
  configuration,
  isLoading,
  onRowClick,
  onRowHover,
  filterValue = "",
  selectedTab,
}: ReusableTableProps<T>) => {
  // Validate configuration *after* hooks are guaranteed to run to avoid conditional hook calls
  const invalidConfig = !configuration || !configuration.columns || configuration.columns.length === 0;

  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(configuration.defaultSort || { column: "", direction: "ascending" });

  const rowsPerPage = configuration?.rowsPerPage || ROWS_PER_PAGE;

  useEffect(() => {
    setPage(1);
    // Reset sorting to default when switching tabs
    setSortDescriptor({ column: "", direction: "ascending" });
  }, [selectedTab]);

  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .map((item, index) => {
        if (!item || typeof item !== "object") return null;

        const stableKey = item.id || item.key || item.address || `item-${index}`;

        return {
          ...item,
          key: stableKey,
          _index: index,
        };
      })
      .filter(Boolean);
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!Array.isArray(processedData)) return [];

    if (!filterValue || !configuration.searchFields) return processedData;

    const searchTerm = filterValue.toLowerCase();

    return processedData.filter((item) => {
      if (!item || typeof item !== "object") return false;

      return configuration.searchFields!.some((field) => {
        const value = get(item, field);

        return value?.toString().toLowerCase().includes(searchTerm);
      });
    });
  }, [processedData, filterValue, configuration.searchFields]);

  const sortedItems = useMemo(() => {
    if (!Array.isArray(filteredItems)) return [];

    // Extract column key - ensure it's a string
    const columnKey = typeof sortDescriptor.column === "string" ? sortDescriptor.column : String(sortDescriptor.column || "");

    // No sorting applied - return original order from API
    if (!columnKey) return filteredItems;

    // Single-column sorting only (no combined sorts)
    const items = filteredItems.slice();

    return items.sort((a, b) => {
      if (!a || !b || typeof a !== "object" || typeof b !== "object") return 0;

      // Get the value directly from the item using the column key
      const getValue = (item: T) => {
        // Try direct property access first
        if (columnKey in item) {
          return item[columnKey];
        }

        // Fallback to nested property access
        return get(item, columnKey);
      };

      const first = getValue(a);
      const second = getValue(b);

      // Handle undefined/null values - put them at the end
      if (first === undefined || first === null) {
        return 1; // Put undefined first at the end
      }
      if (second === undefined || second === null) {
        return -1; // Put undefined second at the end
      }

      // Handle number comparison
      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle string comparison
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  const headerColumns = useMemo(() => {
    const cols = configuration?.columns ?? [];

    return cols.map((column) => ({
      ...column,
      sortDirection: column.key === sortDescriptor.column ? sortDescriptor.direction : undefined,
    }));
  }, [configuration.columns, sortDescriptor]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const handleRowClick = useCallback(
    (item: T) => {
      onRowClick?.(item);
    },
    [onRowClick]
  );

  const handleSortChange = useCallback(
    (descriptor: SortDescriptor) => {
      // Always ensure single-column sorting
      // Extract only the column key (handle both string and object formats)
      const newColumn = typeof descriptor.column === "string" ? descriptor.column : String(descriptor.column || "");

      const currentColumn = typeof sortDescriptor.column === "string" ? sortDescriptor.column : String(sortDescriptor.column || "");

      // If clicking the same column, cycle: ascending -> descending -> clear
      if (newColumn === currentColumn) {
        if (sortDescriptor.direction === "ascending") {
          // Second click: switch to descending
          setSortDescriptor({ column: newColumn, direction: "descending" });
        } else {
          // Third click: clear sorting
          setSortDescriptor({ column: "", direction: "ascending" });
        }
      } else {
        // New column: always start with ascending, clear any previous sort
        setSortDescriptor({ column: newColumn, direction: "ascending" });
      }

      setPage(1); // Reset to first page when sorting
    },
    [sortDescriptor]
  );

  useEffect(() => {
    setPage(1);
  }, [filterValue]);

  const paginationElement = useMemo(() => {
    if (sortedItems.length <= rowsPerPage) return null;

    return <TablePagination currentPage={page} totalPages={pages} onNext={onNextPage} onPageChange={setPage} onPrevious={onPreviousPage} />;
  }, [page, pages, onPreviousPage, onNextPage, sortedItems.length, rowsPerPage]);

  // Create item map for O(1) lookups in click handlers
  const itemMap = useMemo(() => {
    const map = new Map<string, any>();

    paginatedItems.forEach((item: any) => {
      const key = item.key || item.id || String(item._index);

      map.set(key, item);
    });

    return map;
  }, [paginatedItems]);

  // Convert items to mobile list format
  const mobileListItems = useMemo<MobileListItem[]>(() => {
    return paginatedItems.map((item: any) => {
      const key = item.key || item.id || item.asset?.mint || String(item._index);
      const name = item.name || "Unknown";

      // Handle ProtocolMetric type (has tvl, fees, revenue)
      if (item.tvl !== undefined && item.fees !== undefined && item.revenue !== undefined) {
        const isTvlValid = typeof item.tvl === "number" && !isNaN(item.tvl) && isFinite(item.tvl);
        const isFeesValid = typeof item.fees === "number" && !isNaN(item.fees) && isFinite(item.fees);
        const isRevenueValid = typeof item.revenue === "number" && !isNaN(item.revenue) && isFinite(item.revenue);

        const feesFormatted = isFeesValid ? formatCurrency(item.fees, true) : "-";
        const revenueFormatted = isRevenueValid ? formatCurrency(item.revenue, true) : "-";
        const subtitleParts = [item.slug, item.assetToken].filter(Boolean);

        return {
          key,
          logoURI: "", // No image for Key Metrics
          name,
          symbol: item.assetToken,
          subtitle: subtitleParts.length > 0 ? subtitleParts.join(" • ") : undefined,
          primaryValue: isTvlValid ? formatCurrency(item.tvl, true) : "-",
          secondaryValue: `Fees: ${feesFormatted} • Rev.: ${revenueFormatted}`,
        };
      }

      // Handle standard token/protocol format
      return {
        key,
        logoURI: item.logoURI || item.logo || "",
        name,
        symbol: item.symbol,
        primaryValue: item.price || "-",
        change: item.change,
        secondaryValue: item.change ? `${fixedNumber(Math.abs(item.change))}%` : "0%",
      };
    });
  }, [paginatedItems]);

  if (invalidConfig) {
    return <div className="p-4 text-center text-gray-500">Table configuration error</div>;
  }

  return (
    <>
      {/* Mobile List View */}
      <MobileListLayout
        emptyMessage="No data available"
        isLoading={isLoading}
        items={mobileListItems}
        onItemClick={(item) => {
          const originalItem = itemMap.get(item.key);

          if (originalItem) handleRowClick(originalItem);
        }}
        onItemHover={(item) => {
          const originalItem = itemMap.get(item.key);

          if (originalItem && onRowHover) onRowHover(originalItem);
        }}
      />
      <div className="md:hidden">{paginationElement}</div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table
          aria-label="Data table"
          className="min-w-full shadow-none border-none [&>div]:border-none [&>div]:shadow-none p-0 [&_th_svg]:opacity-100"
          classNames={{
            wrapper: "bg-transparent rounded-t-none lg:bg-card p-0 lg:p-4",
            th: "[&>div>svg]:opacity-100 [&>div>svg]:visible",
          }}
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}>
          <TableHeader>
            {headerColumns?.map((column, index) => {
              const isLastColumn = index === (headerColumns?.length || 0) - 1;
              const alignMap = {
                left: "start" as const,
                right: "end" as const,
                center: "center" as const,
              };

              return (
                <TableColumn
                  key={column.key}
                  align={column.align ? alignMap[column.align] : "start"}
                  allowsSorting={column.sortable}
                  className={`
                    bg-gray-30 text-gray-400
                    ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
                    ${column.key === "description" ? "pl-12" : ""}
                    ${isLastColumn ? "pr-6" : "pr-0"}
                  `}
                  style={column.width ? { width: column.width } : undefined}>
                  {column.label}
                </TableColumn>
              );
            })}
          </TableHeader>
          <TableBody
            emptyContent={<div className="py-6 text-center text-gray-500 w-full">No data available</div>}
            isLoading={isLoading}
            loadingContent={<TableSkeleton columns={configuration.columns.length} rows={2} />}>
            {paginatedItems.map((item: any) => {
              const itemKey = item.key || item.id || item.asset?.mint || item._index;

              return (
                <TableRow
                  key={itemKey}
                  className="cursor-pointer transition-colors duration-150 border-none hover:bg-gray-30 rounded-xl"
                  onClick={() => handleRowClick(item)}
                  onMouseEnter={() => onRowHover?.(item)}>
                  {configuration.columns.map((column, colIndex) => {
                    const cellContent = getCellContent(item, column);
                    const isFirstCell = colIndex === 0;
                    const isLastCell = colIndex === configuration.columns.length - 1;
                    const alignClass = getAlignmentClass(column.align);

                    return (
                      <TableCell
                        key={column.key}
                        className={`
                          border-none h-[36px] lg:h-[60px] lg:p-auto px-0 pb-3
                          ${alignClass}
                          ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
                          ${isFirstCell ? "rounded-l-xl" : ""}
                          ${isLastCell ? "rounded-r-xl" : ""}
                        `}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {paginationElement}
      </div>
    </>
  );
};

UnifiedTable.displayName = "UnifiedTable";

const MemoizedUnifiedTable = React.memo(UnifiedTable, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.filterValue === nextProps.filterValue &&
    prevProps.selectedTab === nextProps.selectedTab &&
    prevProps.data === nextProps.data &&
    prevProps.configuration === nextProps.configuration
  );
});

export default MemoizedUnifiedTable as <T extends Record<string, any>>(props: ReusableTableProps<T>) => React.ReactElement;
