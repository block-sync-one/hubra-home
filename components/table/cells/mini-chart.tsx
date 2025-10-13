"use client";

import React, { useMemo } from "react";

import { seededRandom } from "@/lib/utils/random";

interface MiniChartProps {
  tokenId: string;
  change: number;
  width?: number;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({ tokenId, change, width = 120, height = 28 }) => {
  const chartData = useMemo(() => generateTrendData(tokenId, change, 7), [tokenId, change]);

  if (chartData.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">-</div>;
  }

  // Ensure minimum dimensions to prevent Recharts warning
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);

  // Calculate min/max for scaling
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min || 1;

  // Generate SVG path points
  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1)) * safeWidth;
    const y = safeHeight - ((value - min) / range) * safeHeight;

    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  // Color based on change (matches Figma - teal green)
  const lineColor = change >= 0 ? "#15b79e" : "#ef4444";
  const gradientId = `gradient-${tokenId.slice(0, 8)}`;

  return (
    <div className="relative w-full h-full min-w-[80px] min-h-[28px]">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${safeWidth} ${safeHeight}`}>
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient fill area */}
        <path d={`${pathData} L ${safeWidth},${safeHeight} L 0,${safeHeight} Z`} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={pathData} fill="none" stroke={lineColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </div>
  );
};

/**
 * Generate trend data based on price change for 7 days
 * Creates a realistic-looking curve with deterministic randomness
 */
function generateTrendData(tokenId: string, change: number, days: number = 7): number[] {
  const points = days * 4; // 4 data points per day
  const data: number[] = [];
  const startValue = 100;
  const endValue = startValue + change;

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    // Add deterministic "randomness" for realistic look using seeded random
    const noise = (seededRandom(tokenId, i) - 0.5) * (Math.abs(change) * 0.15);
    const value = startValue + (endValue - startValue) * progress + noise;

    data.push(Math.max(0, value)); // Ensure no negative values
  }

  return data;
}
