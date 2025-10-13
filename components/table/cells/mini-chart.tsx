"use client";

import React, { useMemo } from "react";

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

  // Calculate min/max for scaling
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min || 1;

  // Generate SVG path points
  const points = chartData.map((value, index) => {
    const x = (index / (chartData.length - 1)) * width;
    const y = height - ((value - min) / range) * height;

    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  // Color based on change (matches Figma - teal green)
  const lineColor = change >= 0 ? "#15b79e" : "#ef4444";
  const gradientId = `gradient-${tokenId.slice(0, 8)}`;

  return (
    <div className="relative" style={{ width, height }}>
      <svg className="absolute inset-0" height={height} preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`} width={width}>
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient fill area */}
        <path d={`${pathData} L ${width},${height} L 0,${height} Z`} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={pathData} fill="none" stroke={lineColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      </svg>
    </div>
  );
};

/**
 * Simple seeded random number generator for deterministic results
 * This ensures server and client render the same values
 */
function seededRandom(seed: string, index: number): number {
  const combined = seed + index.toString();
  let hash = 0;

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to 0-1 range
  return (Math.abs(Math.sin(hash)) * 10000) % 1;
}

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
