"use client";

import React from "react";
import { Card } from "@heroui/react";

/**
 * Skeleton loader that matches the TokenCard structure
 */
export function TokenCardSkeleton() {
  return (
    <Card className="bg-card backdrop-blur-sm p-4">
      {/* Header: Image + Name/Symbol in one row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 rounded-full bg-gray-700/50 animate-pulse flex-shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="h-3.5 w-16 bg-gray-700/50 animate-pulse rounded" />
          <div className="h-3.5 w-12 bg-gray-700/50 animate-pulse rounded" />
        </div>
      </div>

      {/* Price and Change in one row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-20 bg-gray-700/50 animate-pulse rounded" />
        <div className="h-6 w-16 bg-gray-700/50 animate-pulse rounded-full" />
      </div>

      {/* Chart skeleton */}
      <div className="h-14 w-full">
        <div className="h-full w-full bg-gradient-to-t from-gray-700/30 to-gray-700/10 animate-pulse rounded" />
      </div>
    </Card>
  );
}

/**
 * Grid of skeleton loaders for desktop view only
 */
export function TokenCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Stack of skeleton loaders for mobile view
 */
export function TokenCardSkeletonStack({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TokenCardSkeleton key={i} />
      ))}
    </div>
  );
}
