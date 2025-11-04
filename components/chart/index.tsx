"use client";

/**
 * Chart Components
 * Reusable chart components using Recharts, aligned with project's design system
 */

import React from "react";
import { Card } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/utils/helper";

// Chart Data Types
export interface ChartData {
  date: string;
  value: number;
  value2?: number;
}

export interface Chart {
  key: string;
  title: string;
  value: number;
  suffix?: string;
  type: "number" | "currency" | "percentage";
  tooltipType?: "number-string" | "currency" | "percentage";
  toolTipTitle?: string;
  toolTip2Title?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  chartData: ChartData[];
}

interface ChartPnlProps {
  charts: Chart[];
  title?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  chart: Chart;
}

/**
 * Custom Tooltip Component for Charts
 * Matches TokenPriceChart tooltip styling
 */
function CustomTooltip({ active, payload, label, chart }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-gray-900 p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {chart.type === "currency" && "$"}
        {chart.tooltipType === "number-string" || chart.type === "currency"
          ? formatCurrency(payload[0].value, true)
          : chart.type === "percentage"
            ? `${payload[0].value.toFixed(2)}%`
            : payload[0].value.toLocaleString()}
      </p>
      {payload[1] && chart.toolTip2Title && (
        <p className="text-xs text-gray-400 mt-1">
          {chart.toolTip2Title}: $
          {Number(payload[1].value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}

/**
 * Individual Chart Card Component
 * Styled to match TokenPriceChart from token detail pages
 */
function ChartCard({ chart }: { chart: Chart }) {
  const isPositive = chart.changeType === "positive";
  const colorRgb = isPositive ? "rgb(21 183 158)" : "rgb(246 61 104)";

  return (
    <Card className="bg-transparent shadow-none md:shadow-card md:bg-card md:backdrop-blur-sm overflow-visible">
      <div className="md:p-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between md:mb-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-400 ">{chart.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-white">
                {chart.type === "currency" && "$"}
                {chart.type === "number" || chart.type === "currency" ? formatCurrency(chart.value, true) : chart.value.toFixed(2)}
                {chart.type === "percentage" && "%"}
              </p>
              {chart.change && <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-danger"}`}>{chart.change}</span>}
            </div>
          </div>
        </div>

        {/* Chart - Matches TokenPriceChart styling exactly */}
        <div className="h-48 w-full select-none" style={{ WebkitTapHighlightColor: "transparent" }}>
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={chart.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${chart.key}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={colorRgb} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colorRgb} stopOpacity={0} />
                </linearGradient>
                {chart.chartData[0]?.value2 !== undefined && (
                  <linearGradient id={`gradient-secondary-${chart.key}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <XAxis
                axisLine={false}
                dataKey="date"
                fontSize={12}
                interval="preserveStartEnd"
                minTickGap={20}
                stroke="rgb(156 163 175)"
                tick={{ fill: "rgb(156 163 175)" }}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip chart={chart} />} />
              <Area dataKey="value" fill={`url(#gradient-${chart.key})`} stroke={colorRgb} strokeWidth={2} type="monotone" />
              {chart.chartData[0]?.value2 !== undefined && (
                <Area
                  dataKey="value2"
                  fill={`url(#gradient-secondary-${chart.key})`}
                  stroke="rgb(99 102 241)"
                  strokeWidth={2}
                  type="monotone"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

/**
 * Chart Panel Component
 * Main component for displaying multiple charts
 */
export default function ChartPnl({ charts, title }: ChartPnlProps) {
  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
      <div className={`grid gap-6 w-full ${charts.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {charts.map((chart) => (
          <ChartCard key={chart.key} chart={chart} />
        ))}
      </div>
    </div>
  );
}

// Export types for use in other files
export type { ChartPnlProps };
