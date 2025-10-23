"use client";

import React from "react";

interface StatsCardSkeletonProps {
  title: string;
}

/**
 * Skeleton loader for StatCard component - shows title, animates value
 */
export function StatsCardSkeleton({ title }: StatsCardSkeletonProps) {
  return (
    <div className="flex flex-col gap-1.5 h-[91px] justify-center px-4 relative md:flex-1 w-full">
      {/* Show actual title */}
      <p className="text-sm font-medium text-gray-400 whitespace-nowrap">{title}</p>

      {/* Skeleton for value */}
      <div className="h-7 w-32 bg-gray-700/50 animate-pulse rounded" />
    </div>
  );
}

/**
 * Grid of stats card skeletons with titles
 */
export function StatsGridSkeleton({ count = 5 }: { count?: number }) {
  const titles = ["Total Market Cap", "Trading Vol", "New Tokens", "Solana TVL", "Stablecoins TVL"];

  return (
    <div className="relative rounded-xl bg-card overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:flex">
        {titles.slice(0, count).map((title, i) => (
          <StatsCardSkeleton key={i} title={title} />
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {Array.from({ length: Math.ceil(count / 2) }).map((_, rowIndex) => (
          <div key={`mobile-row-${rowIndex}`} className="flex">
            {titles.slice(rowIndex * 2, rowIndex * 2 + 2).map((title, colIndex) => (
              <div key={`mobile-item-${rowIndex}-${colIndex}`} className="w-1/2">
                <StatsCardSkeleton title={title} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
