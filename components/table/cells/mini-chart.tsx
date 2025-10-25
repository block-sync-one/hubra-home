"use client";

import React, { useMemo } from "react";

import { useVisibleChart } from "@/lib/hooks/useVisibleChart";

interface MiniChartProps {
  tokenId: string;
  change: number;
  width?: number;
  height?: number;
}

const MiniChartComponent: React.FC<MiniChartProps> = ({ tokenId, change, width = 120, height = 28 }) => {
  // Only fetch price data when chart becomes visible (lazy loading)
  const { elementRef, priceData, isLoading, isVisible } = useVisibleChart(tokenId);

  // Memoize all derived calculations
  const chartConfig = useMemo(() => {
    if (priceData.length === 0) return null;

    const safeWidth = Math.max(width, 1);
    const safeHeight = Math.max(height, 1);

    // Calculate min/max for scaling
    const min = Math.min(...priceData);
    const max = Math.max(...priceData);
    const range = max - min || 1;

    // Generate SVG path points with fixed precision to avoid hydration mismatch
    const points = priceData.map((value, index) => {
      const x = Number(((index / (priceData.length - 1)) * safeWidth).toFixed(2));
      const y = Number((safeHeight - ((value - min) / range) * safeHeight).toFixed(2));

      return `${x},${y}`;
    });

    const pathData = `M ${points.join(" L ")}`;
    const lineColor = change >= 0 ? "#15b79e" : "#ef4444";
    const gradientId = `gradient-${tokenId.slice(0, 8)}`;
    const fillPath = `${pathData} L ${safeWidth},${safeHeight} L 0,${safeHeight} Z`;

    return {
      pathData,
      fillPath,
      lineColor,
      gradientId,
      safeWidth,
      safeHeight,
      viewBox: `0 0 ${safeWidth} ${safeHeight}`,
    };
  }, [priceData, width, height, change, tokenId]);

  // Show loading spinner while fetching data
  if (isVisible && isLoading) {
    return (
      <div ref={elementRef} className="w-full h-full flex items-center justify-center min-w-[80px] min-h-[28px]">
        <div className="w-3 h-3 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Show placeholder until visible or if no data
  if (!chartConfig) {
    return (
      <div ref={elementRef} className="w-full h-full flex items-center justify-center text-xs text-gray-500 min-w-[80px] min-h-[28px]">
        {isVisible ? "-" : "···"}
      </div>
    );
  }

  return (
    <div ref={elementRef} className="relative w-full h-full min-w-[80px] min-h-[28px]">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={chartConfig.viewBox}>
        {/* Gradient Definition */}
        <defs>
          <linearGradient id={chartConfig.gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={chartConfig.lineColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartConfig.lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient fill area */}
        <path d={chartConfig.fillPath} fill={`url(#${chartConfig.gradientId})`} />

        {/* Line */}
        <path
          d={chartConfig.pathData}
          fill="none"
          stroke={chartConfig.lineColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

MiniChartComponent.displayName = "MiniChart";

export const MiniChart = React.memo(MiniChartComponent);
