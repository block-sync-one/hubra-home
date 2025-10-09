"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

import { PriceDisplay } from "../price";

/**
 * Horizontal stacked bar that mirrors the layout in the provided reference image.
 *
 * Usage:
 * ```tsx
 * const portfolio = [
 *   { label: "Tokens", value: 35, color: "#EB4CBF" },
 *   { label: "Staking", value: 35, color: "#3C3CFF" },
 *   { label: "DeFi", value: 20, color: "#AB4CFF" },
 *   { label: "NFTs", value: 10, color: "#4CB0FF" },
 * ];
 *
 * <AllocationStackedBar data={portfolio} />
 * ```
 */
export interface Segment {
  /** Display name of the segment (shown in the legend / tooltip) */
  label: string;
  /** Percentage (0–100) or raw number that will be converted to a percentage */
  value: number;
  /** Hex color for the bar segment */
  color: string;
  usdValue: number;
}

interface BarGroupChartProps {
  portfolio: any; // Use the actual Portfolio type if available
  height?: number;
  radius?: number;
}

const COLORS = {
  Tokens: "#EB4CBF",
  Staking: "#3C3CFF",
  Earn: "#AB4CFF",
  NFTs: "#4CB0FF",
};

// Helper to convert hex color to rgba with alpha
function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace("#", "");

  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16);

  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

const BarGroupChart: React.FC<BarGroupChartProps> = ({ portfolio, height = 40, radius = 6 }) => {
  const summary = portfolio?.summary?.aggregated;
  const netWorth = summary?.netWorth || 0;
  const breakdown = useMemo(() => {
    if (!summary || !netWorth) return [];
    const items = [
      {
        label: "Tokens",
        color: COLORS.Tokens,
        usdValue: summary.tokenValue || 0,
      },
      {
        label: "Staking",
        color: COLORS.Staking,
        usdValue: summary.validatorValue || 0,
      },
      {
        label: "Earn",
        color: COLORS.Earn,
        usdValue: summary.defiValue || 0,
      },
      {
        label: "NFTs",
        color: COLORS.NFTs,
        usdValue: summary.nftValue || 0,
      },
    ];

    // Filter out zero values
    return items
      .filter((item) => item.usdValue > 0)
      .map((item) => ({
        ...item,
        value: netWorth > 0 ? Math.round((item.usdValue / netWorth) * 100) : 0,
      }));
  }, [summary, netWorth]);

  // Transform for recharts
  const chartRow = useMemo(() => {
    return breakdown.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.label] = cur.value;

      return acc;
    }, {});
  }, [breakdown]);
  const labels = breakdown.map((d) => d.label);

  return (
    <div className="w-full">
      <ResponsiveContainer height={height} width="100%">
        <BarChart data={[chartRow]} layout="vertical" stackOffset="expand">
          <defs>
            {breakdown.map((segment) => (
              <pattern key={segment.label} height="6" id={`pattern-${segment.label}`} patternUnits="userSpaceOnUse" width="2">
                <rect fill={segment.color} height="6" width="1" x="0" y="0" />
                <rect fill={hexToRgba(segment.color, 0.5)} height="6" width="1" x="1" y="0" />
              </pattern>
            ))}
          </defs>
          {/* Hide axes for a clean, indicator‑style look */}
          <XAxis hide type="number" />
          <YAxis hide dataKey="name" type="category" />

          {labels.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`url(#pattern-${breakdown[index].label})`}
              radius={index === 0 ? [radius, 1, 1, radius] : index === labels.length - 1 ? [1, radius, radius, 1] : 1}
              stackId="allocation"
              strokeWidth={6}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {/* Breakdown by category UI */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4 px-1">
        {breakdown.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="w-1 h-3 rounded " style={{ backgroundColor: segment.color }} />
              <span className=" text-gray-700 ">{segment.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className=" text-gray-500 ">
                <PriceDisplay value={segment.usdValue} />
              </span>
              <span className=" text-gray-400 ">{segment.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGroupChart;
