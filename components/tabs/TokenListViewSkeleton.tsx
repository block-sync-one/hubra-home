"use client";

import React from "react";

/**
 * Skeleton loader for a single mobile list item - two column layout
 */
function TokenListItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 min-h-[56px]">
      {/* Left Column: Image, Name, Symbol */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-700/50 animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="h-3.5 w-20 bg-gray-700/50 animate-pulse rounded" />
          <div className="h-3 w-12 bg-gray-700/50 animate-pulse rounded" />
        </div>
      </div>

      {/* Right Column: Price and Price Change */}
      <div className="flex flex-col items-end gap-1">
        <div className="h-3.5 w-16 bg-gray-700/50 animate-pulse rounded" />
        <div className="h-3 w-14 bg-gray-700/50 animate-pulse rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton for TokenListView mobile list
 */
export function TokenListViewSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden w-full">
      <div>
        {Array.from({ length: count }).map((_, i) => (
          <TokenListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
