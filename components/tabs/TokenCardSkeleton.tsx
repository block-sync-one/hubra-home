"use client";

import React from "react";
import { Card } from "@heroui/react";

/**
 * Skeleton loader that matches the TokenCard structure
 */
export function TokenCardSkeleton() {
  return (
    <Card className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden p-4 hover:bg-white/10 transition-colors">
      <div className="flex flex-col gap-3">
        {/* Header: Token info */}
        <div className="flex items-center gap-3">
          {/* Token image skeleton */}
          <div className="w-10 h-10 rounded-full bg-gray-700/50 animate-pulse" />

          {/* Token name and symbol */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-700/50 animate-pulse rounded" />
            <div className="h-3 w-16 bg-gray-700/50 animate-pulse rounded" />
          </div>
        </div>

        {/* Price and change */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-gray-700/50 animate-pulse rounded" />
          <div className="h-6 w-16 bg-gray-700/50 animate-pulse rounded-full" />
        </div>

        {/* Chart skeleton */}
        <div className="relative h-16 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-700/30 to-gray-700/10 animate-pulse rounded" />
          {/* Simulated chart line */}
          <svg className="w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 40">
            <path className="text-gray-500" d="M0,20 Q25,10 50,15 T100,20" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </Card>
  );
}

/**
 * Grid of skeleton loaders for desktop view
 */
export function TokenCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
