"use client";

import React from "react";
import { Card } from "@heroui/react";

/**
 * Skeleton loader for Token Header
 */
export function TokenHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Token image */}
        <div className="w-16 h-16 rounded-full bg-gray-700/50 animate-pulse" />

        {/* Token name and symbol */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-700/50 animate-pulse rounded" />
          <div className="h-4 w-24 bg-gray-700/50 animate-pulse rounded" />
        </div>
      </div>

      {/* Back button */}
      <div className="h-10 w-24 bg-gray-700/50 animate-pulse rounded-lg" />
    </div>
  );
}

/**
 * Skeleton loader for Token Info (Price display)
 */
export function TokenInfoSkeleton() {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="h-10 w-40 bg-gray-700/50 animate-pulse rounded" />
      <div className="h-8 w-20 bg-gray-700/50 animate-pulse rounded-full" />
    </div>
  );
}

/**
 * Skeleton loader for Token Stats Grid
 */
export function TokenStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-card p-4">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-700/50 animate-pulse rounded" />
            <div className="h-5 w-28 bg-gray-700/50 animate-pulse rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton loader for Price Chart
 */
export function TokenPriceChartSkeleton() {
  return (
    <Card className="bg-gray-950/50  backdrop-blur-sm mb-8">
      <div className="p-6">
        {/* Chart skeleton */}
        <div className="h-64 relative overflow-hidden rounded">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/30 to-gray-800/10" />
          <svg className="w-full h-full opacity-20 animate-pulse" preserveAspectRatio="none" viewBox="0 0 400 200">
            <path
              className="text-gray-500"
              d="M0,150 Q40,120 80,130 T160,110 Q200,100 240,120 T320,100 Q360,110 400,90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0,150 Q40,120 80,130 T160,110 Q200,100 240,120 T320,100 Q360,110 400,90 L400,200 L0,200 Z"
              fill="url(#chartSkeletonGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="chartSkeletonGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </Card>
  );
}

/**
 * Skeleton loader for Volume Stats
 */
export function VolumeStatsSkeleton() {
  return (
    <Card className="bg-card p-6 mb-8">
      <div className="space-y-4">
        <div className="h-5 w-32 bg-gray-700/50 animate-pulse rounded" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-700/50 animate-pulse rounded" />
              <div className="h-6 w-32 bg-gray-700/50 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Skeleton loader for Trading Section
 */
export function TradingSectionSkeleton() {
  return (
    <Card className="bg-card p-6 mb-8">
      <div className="space-y-4">
        <div className="h-6 w-40 bg-gray-700/50 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-28 bg-gray-700/50 animate-pulse rounded" />
              <div className="h-32 w-full bg-gray-700/50 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Skeleton loader for Token Description
 */
export function TokenDescriptionSkeleton() {
  return (
    <Card className="bg-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-700/50 animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-700/50 animate-pulse rounded-full" />
            <div className="h-8 w-8 bg-gray-700/50 animate-pulse rounded-full" />
          </div>
        </div>

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-700/50 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-700/50 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-gray-700/50 animate-pulse rounded" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Full page skeleton for token detail page
 */
export function TokenDetailPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TokenHeaderSkeleton />
      <TokenInfoSkeleton />
      <TokenStatsSkeleton />
      <TokenPriceChartSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <VolumeStatsSkeleton />
        <TradingSectionSkeleton />
      </div>
      <TokenDescriptionSkeleton />
    </div>
  );
}
