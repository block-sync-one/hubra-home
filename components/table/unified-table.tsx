"use client";

import type { TableProps } from "./types";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { SortDescriptor, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import Image from "next/image";
import { Icon } from "@iconify/react";

// Simple get function to replace lodash
const get = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

import TableSkeleton from "./skeleton/table-skeleton";

import { fixedNumber } from "@/lib/utils";

const ROWS_PER_PAGE = 100;

interface ReusableTableProps<T> extends TableProps<T> {
  selectedTab?: string;
}

const UnifiedTable = <T extends Record<string, any>>({
  data,
  configuration,
  isLoading,
  onRowClick,
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

    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      if (!a || !b || typeof a !== "object" || typeof b !== "object") return 0;

      const getValue = (item: T) => get(item, String(sortDescriptor.column));

      const first = getValue(a);
      const second = getValue(b);

      if (first === undefined || second === undefined) {
        return sortDescriptor.direction === "descending" ? -1 : 1;
      }

      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

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

  const handleSortChange = useCallback((descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
    setPage(1); // Reset to first page when sorting
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filterValue]);

  const bottomContent = useMemo(() => {
    if (sortedItems.length <= rowsPerPage) return null;

    return (
      <div className="flex flex-row justify-center items-center w-full gap-3 px-5 py-4 bg-transparent">
        <span className="font-normal leading-[1.43] text-left text-gray-600">
          Page {page} of {pages}
        </span>
        <div className="flex flex-row justify-end items-center gap-3 flex-1">
          <Button
            className="bg-card font-semibold rounded-lg px-3 py-2"
            color="default"
            isDisabled={page === 1}
            size="md"
            variant="flat"
            onPress={onPreviousPage}>
            Previous
          </Button>
          <Button
            className="bg-card font-semibold rounded-lg px-3 py-2"
            color="default"
            isDisabled={page === pages}
            size="md"
            variant="flat"
            onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage, sortedItems.length, rowsPerPage]);

  if (invalidConfig) {
    return <div className="p-4 text-center text-gray-500">Table configuration error</div>;
  }

  return (
    <>
      {/* Mobile List View */}
      <div className="md:hidden rounded-lg overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={1} rows={5} />
        ) : paginatedItems.length === 0 ? (
          <div className="py-6 text-center text-gray-500">No data available</div>
        ) : (
          paginatedItems.map((item: any) => {
            const tokenData = item;

            return (
              <div
                key={item.key || item.id || item.asset?.mint || item._index}
                aria-label="Token details"
                className="flex items-center justify-between py-2 hover:bg-white/5 transition-colors cursor-pointer"
                role="button"
                onClick={() => handleRowClick(item)}>
                {/* Left Column: Image, Name, Symbol */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      alt={`${tokenData.name} (${tokenData.symbol}) logo`}
                      className="w-full h-full object-cover"
                      height={32}
                      src={tokenData.imgUrl || "/logo.svg"}
                      width={32}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{tokenData.name}</span>
                    <span className="text-xs text-gray-400 uppercase font-medium">{tokenData.symbol}</span>
                  </div>
                </div>

                {/* Right Column: Price and Price Change */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">{tokenData.price}</span>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      tokenData.change && tokenData.change > 0
                        ? "text-success"
                        : tokenData.change && tokenData.change < 0
                          ? "text-danger"
                          : "text-gray-400"
                    }`}>
                    {tokenData.change !== undefined && tokenData.change !== 0 && (
                      <Icon icon={tokenData.change > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
                    )}
                    <span>{tokenData.change ? fixedNumber(Math.abs(tokenData.change)) : 0}%</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {bottomContent}
      </div>

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
          <TableHeader className="">
            {headerColumns?.map((column) => (
              <TableColumn
                key={column.key}
                align={column.align === "left" ? "start" : column.align === "right" ? "end" : "center"}
                allowsSorting={column.sortable}
                className={`
                bg-gray-30  
                text-gray-400
                ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
              `}
                style={column.width ? { width: column.width } : undefined}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent={<div className="py-6 text-center text-gray-500 w-full">No data available</div>}
            isLoading={isLoading}
            loadingContent={<TableSkeleton columns={configuration.columns.length} rows={2} />}>
            {paginatedItems.map((item: any) => (
              <TableRow
                key={item.key || item.id || item.asset?.mint || item._index}
                className="cursor-pointer transition-colors duration-150 border-none"
                onClick={() => handleRowClick(item)}>
                {configuration.columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`border-none h-[36px] lg:h-[60px] ${column.align === "center" ? "text-center" : column.align === "right" ? "text-right" : "text-left"} lg:p-auto px-0 pb-3
                    ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
                  `}>
                    {(() => {
                      try {
                        if (column.render) {
                          return column.render(item, get(item, String(column.key))) || null;
                        }
                        const value = get(item, String(column.key));

                        return value !== null && value !== undefined ? String(value) : "-";
                      } catch {
                        return "-";
                      }
                    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {bottomContent}
      </div>
    </>
  );
};

export default React.memo(UnifiedTable) as <T extends Record<string, any>>(props: ReusableTableProps<T>) => React.ReactElement;
