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
  const { elementRef, priceData } = useVisibleChart(tokenId);

  const chartConfig = useMemo(() => {
    if (priceData.length === 0) return null;

    const safeWidth = Math.max(width, 1);
    const safeHeight = Math.max(height, 1);
    const min = Math.min(...priceData);
    const max = Math.max(...priceData);
    const range = max - min || 1;

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

  if (!chartConfig) {
    return (
      <div ref={elementRef} className="relative w-full h-full min-w-[80px] min-h-[28px] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-20 animate-pulse"
          preserveAspectRatio="none"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))" }}
          viewBox="0 0 120 28">
          <path className="text-gray-400" d="M0,14 Q30,8 60,10 T120,14" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <div ref={elementRef} className="relative w-full h-full min-w-[80px] min-h-[28px]">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={chartConfig.viewBox}>
        <defs>
          <linearGradient id={chartConfig.gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={chartConfig.lineColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartConfig.lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={chartConfig.fillPath} fill={`url(#${chartConfig.gradientId})`} />
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
