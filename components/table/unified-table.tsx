import type { TableProps } from "./types";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { SortDescriptor, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";

// Simple get function to replace lodash
const get = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

import TableSkeleton from "./skeleton/table-skeleton";

import { generateUUID } from "@/lib/utils/helper";

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

  // Fallback safely if configuration is invalid
  const rowsPerPage = configuration?.rowsPerPage || ROWS_PER_PAGE;

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  // Debug logging
  // React.useEffect(() => {
  //   console.log('ReusableTable received data:', {
  //     // data,
  //     // isArray: Array.isArray(data),
  //     // length: Array.isArray(data) ? data.length : 'not array',
  //     // configuration: configuration?.columns?.length || 0,
  //     isLoading
  //   });
  // }, [data, configuration, isLoading]);

  // Process data to ensure HeroUI compatibility
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.warn("Table data is not an array:", data);

      return [];
    }

    return data
      .map((item, index) => {
        if (!item || typeof item !== "object") {
          console.warn("Invalid item in data:", item);

          return null;
        }

        return {
          ...item,
          key: generateUUID(),
          _index: index,
        };
      })
      .filter(Boolean);
  }, [data]);

  // Memoized filtered data
  const filteredItems = useMemo(() => {
    // Safety check: ensure data is an array
    if (!Array.isArray(processedData)) {
      console.warn("Table data is not an array:", processedData);

      return [];
    }

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

  // Memoized sorted data
  const sortedItems = useMemo(() => {
    // Safety check: ensure filteredItems is an array
    if (!Array.isArray(filteredItems)) {
      console.warn("Filtered items is not an array:", filteredItems);

      return [];
    }

    if (!sortDescriptor.column) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      // Safety check for valid items
      if (!a || !b || typeof a !== "object" || typeof b !== "object") {
        return 0;
      }

      const getValue = (item: T) => {
        // Handle nested paths
        const value = get(item, String(sortDescriptor.column));

        return value;
      };

      const first = getValue(a);
      const second = getValue(b);

      if (first === undefined || second === undefined) {
        return sortDescriptor.direction === "descending" ? -1 : 1;
      }

      // Handle numeric sorting
      if (typeof first === "number" && typeof second === "number") {
        const cmp = first - second;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }

      // Handle string sorting
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  // Memoized paginated data
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const pages = Math.ceil(sortedItems.length / rowsPerPage);

  // Memoized header columns
  const headerColumns = useMemo(() => {
    // Use empty array if configuration is invalid to prevent runtime errors
    const cols = configuration?.columns ?? [];

    return cols.map((column) => ({
      ...column,
      sortDirection: column.key === sortDescriptor.column ? sortDescriptor.direction : undefined,
    }));
  }, [configuration.columns, sortDescriptor]);

  // Callbacks
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

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filterValue]);

  // Memoized bottom content
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

  // Render a fallback message if the configuration is invalid
  if (invalidConfig) {
    console.warn("ReusableTable: Invalid configuration provided");

    return <div className="p-4 text-center text-gray-500">Table configuration error</div>;
  }

  return (
    <>
      <Table
        aria-label="Data table"
        className="min-w-full shadow-none border-none [&>div]:border-none [&>div]:shadow-none p-0  "
        classNames={{
          wrapper: "bg-transparent rounded-t-none lg:bg-card p-0 lg:p-4",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}>
        <TableHeader className="">
          {headerColumns?.map((column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              className={`
                ${column.showHeader !== false ? "hidden lg:table-cell" : ""}
                bg-gray-30  
                text-gray-400 ${column.align === "left" ? "text-left" : "text-right"}
                ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
              `}>
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
              className="cursor-pointer hover:bg-transparent border-none"
              onClick={() => handleRowClick(item)}>
              {configuration.columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`border-none h-[40px] lg:h-[60px] first:text-left text-right lg:p-auto px-0 pb-4
                    ${column.hiddenOnMobile ? "hidden lg:table-cell" : ""}
                  `}>
                  {(() => {
                    try {
                      if (column.render) {
                        const rendered = column.render(item, get(item, String(column.key)));

                        return rendered || null;
                      } else {
                        const value = get(item, String(column.key));

                        return value !== null && value !== undefined ? String(value) : "-";
                      }
                    } catch (error) {
                      console.error("Error rendering cell:", error, {
                        item,
                        column: column.key,
                      });

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
    </>
  );
};

export default React.memo(UnifiedTable) as <T extends Record<string, any>>(props: ReusableTableProps<T>) => React.ReactElement;
