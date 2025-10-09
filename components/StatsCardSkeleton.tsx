"use client";

import React from "react";

/**
 * Skeleton loader for StatCard component
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col gap-3">
        {/* Title skeleton */}
        <div className="h-4 w-32 bg-gray-700/50 animate-pulse rounded" />

        {/* Value skeleton */}
        <div className="h-8 w-40 bg-gray-700/50 animate-pulse rounded" />

        {/* Optional: Small detail skeleton */}
        <div className="h-3 w-24 bg-gray-700/50 animate-pulse rounded" />
      </div>
    </div>
  );
}

/**
 * Grid of stats card skeletons
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}
