"use client";

import React, { useMemo } from "react";

import { seededRandom } from "@/lib/utils/random";

interface MiniChartProps {
  tokenId: string;
  change: number;
  width?: number;
  height?: number;
}

const MiniChartComponent: React.FC<MiniChartProps> = ({ tokenId, change, width = 120, height = 28 }) => {
  // Generate deterministic prognostic chart data
  const chartData = useMemo(() => generatePrognosticData(tokenId, change), [tokenId, change]);

  // Memoize all derived calculations
  const chartConfig = useMemo(() => {
    if (chartData.length === 0) return null;

    const safeWidth = Math.max(width, 1);
    const safeHeight = Math.max(height, 1);

    // Calculate min/max for scaling
    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;

    // Generate SVG path points with fixed precision to avoid hydration mismatch
    const points = chartData.map((value, index) => {
      const x = Number(((index / (chartData.length - 1)) * safeWidth).toFixed(2));
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
  }, [chartData, width, height, change, tokenId]);

  if (!chartConfig) {
    return <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">-</div>;
  }

  return (
    <div className="relative w-full h-full min-w-[80px] min-h-[28px]">
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

// Generate prognostic chart from price change (deterministic for SSR)
function generatePrognosticData(tokenId: string, change: number): number[] {
  const points = 28; // 4 data points per day for 7 days
  const data: number[] = [];
  const startValue = 100;
  const endValue = startValue + change;

  // Determine change magnitude and characteristics
  const absChange = Math.abs(change);
  const isLargeChange = absChange > 20;
  const isMediumChange = absChange > 5 && absChange <= 20;

  // Adjust curve steepness based on magnitude
  const steepness = isLargeChange ? 12 : isMediumChange ? 8 : 5;

  // Scale volatility proportionally to change magnitude
  const baseVolatility = Math.min(absChange * 0.15, 15); // Cap at 15% volatility

  // Unique seed for this token to create variety
  const tokenSeed = hashCode(tokenId);

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);

    // Different curve shapes based on magnitude
    let baseValue: number;

    if (isLargeChange) {
      // Large changes: Dramatic exponential-like curve
      const exp = Math.pow(progress, 1.5); // Accelerating growth

      baseValue = startValue + (endValue - startValue) * exp;
    } else if (isMediumChange) {
      // Medium changes: Smooth S-curve
      const sigmoid = 1 / (1 + Math.exp(-steepness * (progress - 0.5)));

      baseValue = startValue + (endValue - startValue) * sigmoid;
    } else {
      // Small changes: More linear with slight curve
      const gentle = progress + Math.sin(progress * Math.PI) * 0.1;

      baseValue = startValue + (endValue - startValue) * gentle;
    }

    // Add realistic volatility (scales with magnitude)
    const noise = (seededRandom(tokenId, i) - 0.5) * 2 * baseVolatility;

    // Add momentum waves (more dramatic for larger changes)
    const waveIntensity = isLargeChange ? 0.5 : isMediumChange ? 0.3 : 0.15;
    const wave1 = Math.sin(progress * Math.PI * 2 + tokenSeed * 0.1) * baseVolatility * waveIntensity;
    const wave2 = Math.sin(progress * Math.PI * 3 + tokenSeed * 0.2) * baseVolatility * waveIntensity * 0.6;

    // Add micro-fluctuations (more in volatile tokens)
    const microFluctuations = (seededRandom(tokenId, i * 3 + 7) - 0.5) * baseVolatility * 0.4;

    const value = baseValue + noise + wave1 + wave2 + microFluctuations;

    // Round to 6 decimal places to ensure SSR/CSR consistency
    const roundedValue = Number(Math.max(0, value).toFixed(6));

    data.push(roundedValue);
  }

  return data;
}

function hashCode(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}
