/**
 * @deprecated This component has been replaced by UnifiedChart.
 * Use UnifiedChart with chartConfig instead.
 * This component is only kept for internal use by UnifiedChart.
 */
// PortfolioLineChart.tsx
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "usehooks-ts";

import { PriceDisplay } from "../price";

import { fixedNumber } from "@/lib/utils/helper";

// The data now comes with all points and pre-computed displayLabel for optimal display

export default function LineChart({
  data,
  isLoading,
  changeType,
  color,
}: {
  data: any;
  isLoading?: boolean;
  changeType?: "positive" | "negative" | "neutral";
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "default";
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Memoize chart data to prevent unnecessary rerenders
  const memoizedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Add unique IDs to each data point to prevent React key warnings
    return data.map((item: any, index: number) => ({
      ...item,
      id: `data-point-${index}-${item.timestamp || item.label}`,
      name: `point-${index}-${item.timestamp || item.label}`, // Recharts uses 'name' for keys
    }));
  }, [data]);

  // Calculate min and max values for Y-axis labels FROM CURRENT TIME RANGE ONLY
  const yAxisConfig = useMemo(() => {
    if (!data || data.length === 0) return { domain: [0, 100], ticks: [0, 100] };

    // Extract values from the current time range data only (not from ALL data)
    const values = data.map((item: any) => item.value).filter((val: number) => !isNaN(val));

    if (values.length === 0) return { domain: [0, 100], ticks: [0, 100] };

    // Get min/max from current time range only
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Use exact min/max values without padding
    const minValue = min;
    const maxValue = max;

    // Ensure ticks are unique to prevent React key warnings
    let ticks = [minValue, maxValue];

    if (minValue === maxValue) {
      // When min and max are the same, create a small range to avoid duplicate keys
      const value = minValue;
      const offset = Math.max(value * 0.001, 0.01); // Small offset to create unique ticks

      ticks = [value - offset, value + offset];
    }

    return {
      domain: [minValue, maxValue],
      ticks: ticks,
    };
  }, [data]);

  // Color logic based on changeType
  const colorKey = color || (changeType === "positive" ? "success" : changeType === "negative" ? "danger" : "primary");
  const gradientId = `colorGradient-${colorKey}`;

  // Define colors based on the color key from your Tailwind config
  const colorMap = {
    primary: {
      stroke: "#FEAA01",
      fillStart: "#FEAA01",
      fillEnd: "#FEFFC1",
    },
    success: {
      stroke: "#149585",
      fillStart: "#149585",
      fillEnd: "#F0FDF9",
    },
    danger: {
      stroke: "#C8345A",
      fillStart: "#C8345A",
      fillEnd: "#FFF1F3",
    },
    warning: {
      stroke: "#FEC84B",
      fillStart: "#FEC84B",
      fillEnd: "#FFFFE7",
    },
    info: {
      stroke: "#3C3CFF",
      fillStart: "#3C3CFF",
      fillEnd: "#E7E7E9",
    },
    secondary: {
      stroke: "#565764",
      fillStart: "#565764",
      fillEnd: "#F3F3F4",
    },
    default: {
      stroke: "#565764",
      fillStart: "#565764",
      fillEnd: "#F3F3F4",
    },
  };

  const colors = colorMap[colorKey as keyof typeof colorMap] || colorMap.primary;
  const strokeColor = colors.stroke;
  const fillStart = colors.fillStart;
  const fillEnd = colors.fillEnd;

  // Optimized tick formatter that prevents truncation
  const tickFormatter = useCallback((value: any) => {
    // Only show non-empty display labels
    return value || "";
  }, []);

  // Animated skeleton data for loading state
  const [skeletonData, setSkeletonData] = useState(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      label: "",
      value: 50 + Math.sin(i * 0.5) * 30,
    }));
  });

  // Animate the skeleton line to simulate real chart movement
  useEffect(() => {
    if (!isLoading) return;
    let frame = 0;
    let timeout: NodeJS.Timeout;
    const animate = () => {
      setSkeletonData(
        Array.from({ length: 14 }, (_, i) => ({
          label: "",
          value: 50 + Math.sin(i * 0.5 + frame * 0.03) * 30,
        }))
      );
      frame++;
      timeout = setTimeout(animate, 20);
    };

    animate();

    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="relative w-full h-full">
        <ResponsiveContainer className="[&_.recharts-surface]:outline-none" height="100%" width="100%">
          <AreaChart data={skeletonData} margin={{ top: 5, right: 10, left: 20, bottom: 0 }}>
            <YAxis hide />
            <Line dataKey="value" dot={false} isAnimationActive={true} stroke="url(#staticGradient)" strokeWidth={2} type="monotone" />
            <defs>
              <linearGradient id="staticGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#D74CAB" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer
        key={`responsive-container-${memoizedData.length}`}
        className="[&_.recharts-surface]:outline-none"
        height="100%"
        width="100%">
        <AreaChart
          key={`area-chart-${memoizedData.length}-${yAxisConfig.ticks.join("-")}`}
          accessibilityLayer
          data={memoizedData}
          height={205}
          margin={{
            left: isMobile ? 0 : 20,
            right: isMobile ? 0 : 20,
            top: 50,
            bottom: isMobile ? -20 : 0, // Add bottom margin for labels
          }}>
          <defs className=" lg:hidden">
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="10%" stopColor={fillStart} stopOpacity={0.2} />
              <stop offset="100%" stopColor={fillEnd} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <YAxis
            key={`y-axis-${yAxisConfig.ticks.join("-")}-${memoizedData.length}`}
            axisLine={false}
            domain={yAxisConfig.domain}
            orientation="right"
            tick={{ fontSize: 10, fill: "#6B7280", dy: -10, dx: 30 }}
            tickFormatter={(value) => {
              // Format the price values as string
              return `$${fixedNumber(value)}`;
            }}
            tickLine={false}
            ticks={yAxisConfig.ticks}
            width={80}
          />
          <Tooltip
            key={`tooltip-${memoizedData.length}`}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const data = payload[0].payload;

              const fullDate = data.timestamp
                ? new Date(data.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : data.label;

              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-xs text-gray-700">
                  <div className="flex flex-row gap-6">
                    <span className="font-bold">
                      <PriceDisplay value={data.value || 0} />
                    </span>
                    <div className="text-gray-500">{fullDate}</div>
                  </div>
                </div>
              );
            }}
            cursor={{ stroke: "#D74CAB", strokeWidth: 1, opacity: 0.2 }}
          />
          <XAxis
            key={`x-axis-${memoizedData.length}`}
            axisLine={false}
            className="hidden lg:block"
            dataKey="displayLabel"
            interval={0}
            minTickGap={isMobile ? 30 : 20} // Minimum gap between ticks
            style={{
              fontSize: "var(--heroui-font-size-tiny)",
              overflow: "hidden",
            }}
            tick={{ fontSize: 12, dy: 10 }}
            tickFormatter={tickFormatter}
            tickLine={false}
          />
          <Area
            key={`area-${memoizedData.length}-${yAxisConfig.ticks.join("-")}`}
            activeDot={{
              stroke: strokeColor,
              strokeWidth: 2,
              fill: "hsl(var(--heroui-background))",
              r: 5,
            }}
            animationDuration={1000}
            animationEasing="ease"
            dataKey="value"
            fill={`url(#${gradientId})`}
            stroke={strokeColor}
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
