"use client";

/**
 * TablePagination Component
 * Reusable pagination controls for tables
 */

import React from "react";
import { Button } from "@heroui/react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

/**
 * TablePagination Component
 *
 * Simple pagination with Previous/Next buttons and page counter
 *
 * Example:
 * ```tsx
 * <TablePagination
 *   currentPage={page}
 *   totalPages={pages}
 *   onPageChange={setPage}
 *   onPrevious={() => setPage(p => Math.max(1, p - 1))}
 *   onNext={() => setPage(p => Math.min(totalPages, p + 1))}
 * />
 * ```
 */
export function TablePagination({ currentPage, totalPages, onPrevious, onNext, className = "" }: TablePaginationProps) {
  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-row justify-center items-center w-full gap-3 px-5 py-4 bg-transparent ${className}`}>
      <span className="font-normal leading-[1.43] text-left text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex flex-row justify-end items-center gap-3 flex-1">
        <Button
          className="bg-card font-semibold rounded-lg px-3 py-2"
          color="default"
          isDisabled={currentPage === 1}
          size="md"
          variant="flat"
          onPress={onPrevious}>
          Previous
        </Button>
        <Button
          className="bg-card font-semibold rounded-lg px-3 py-2"
          color="default"
          isDisabled={currentPage === totalPages}
          size="md"
          variant="flat"
          onPress={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

// Memoized version for performance
export const MemoizedTablePagination = React.memo(TablePagination);
