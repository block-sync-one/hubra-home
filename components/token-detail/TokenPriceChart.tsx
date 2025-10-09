"use client";

import React from "react";
import { Card, cn, Chip } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Icon } from "@iconify/react";

import { usePriceHistory } from "@/lib/hooks/usePriceHistory";

interface TokenPriceChartProps {
  price: string;
  change: string;
  tokenId: string;
  selectedPeriod: string;
  periods: string[];
  onPeriodChange: (period: string) => void;
}

export function TokenPriceChart({ price, change, tokenId, selectedPeriod, periods, onPeriodChange }: TokenPriceChartProps) {
  // Map period selection to days
  const getDaysFromPeriod = (period: string): number | "max" => {
    switch (period) {
      case "24h":
        return 1;
      case "7d":
        return 7;
      case "1M":
        return 30;
      case "3M":
        return 90;
      case "1Y":
        return 365;
      case "All":
        return "max";
      default:
        return 1;
    }
  };

  const days = getDaysFromPeriod(selectedPeriod);
  const { chartData, loading, error } = usePriceHistory(tokenId, days);

  // Determine color based on change
  const changeValue = parseFloat(change) || 0;
  const isPositive = changeValue >= 0;
  const color = isPositive ? "success" : "danger";

  // Loading state
  if (loading) {
    return (
      <Card className="bg-gray-950/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
              <p className="text-2xl font-semibold text-white">{price}</p>
            </div>
          </div>
          <div className="h-48 relative overflow-hidden rounded">
            {/* Simulated chart skeleton */}
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
                fill="url(#skeletonGradient)"
                opacity="0.3"
              />
              <defs>
                <linearGradient id="skeletonGradient" x1="0%" x2="0%" y1="0%" y2="100%">
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

  // Error state
  if (error) {
    return (
      <Card className="bg-gray-950/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
              <p className="text-2xl font-semibold text-white">{price}</p>
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400">Failed to load chart</p>
          </div>
        </div>
      </Card>
    );
  }

  // Transform data for the chart (use "value" instead of "price")
  const transformedChartData = chartData.map((item) => ({
    month: item.month,
    value: item.price,
  }));

  return (
    <Card className="bg-gray-950/50 border border-white/10 backdrop-blur-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Price</p>
              <p className="text-2xl font-semibold text-white">{price}</p>
            </div>
            <Chip
              className={cn({
                "border-success-500/20 bg-success-500/10": isPositive,
                "border-danger-500/20 bg-danger-500/10": !isPositive,
              })}
              size="sm"
              startContent={
                <Icon
                  className={cn("text-base", {
                    "text-success-500": isPositive,
                    "text-danger-500": !isPositive,
                  })}
                  icon={isPositive ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                />
              }
              variant="bordered">
              <span
                className={cn("text-xs font-semibold", {
                  "text-success-500": isPositive,
                  "text-danger-500": !isPositive,
                })}>
                {change}%
              </span>
            </Chip>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {periods.map((period) => (
              <button
                key={period}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                  selectedPeriod === period ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
                type="button"
                onClick={() => onPeriodChange(period)}>
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 w-full select-none" style={{ WebkitTapHighlightColor: "transparent" }}>
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={transformedChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgb(255 255 255 / 0.05)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="month"
                fontSize={12}
                interval="preserveStartEnd"
                stroke="rgb(156 163 175)"
                tickLine={false}
                tickMargin={10}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className="rounded-lg border border-white/10 bg-gray-900 p-3 shadow-xl">
                      <p className="text-xs text-gray-400 mb-1">{payload[0].payload.month}</p>
                      <p className="text-sm font-semibold text-white">
                        ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                dataKey="value"
                fill={`url(#gradient-${color})`}
                stroke={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"}
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
