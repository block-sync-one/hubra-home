/**
 * UnifiedChart Component
 *
 * A comprehensive chart component that handles various chart types with error states.
 *
 * Features:
 * - Supports line, area, and bar charts
 * - Intelligent label sampling for optimal display
 * - Responsive design for mobile and desktop
 * - Error handling with custom error messages
 * - Loading states with skeleton animations
 * - Range selector with customizable options
 *
 * Error Handling:
 * - Use `hasError` prop to indicate data loading failure
 * - Use `errorMessage` prop to display custom error message
 * - When `hasError` is true, chart shows error icon and hides axis labels
 * - Range selector is hidden during error states
 *
 * Example Usage:
 * ```tsx
 * <UnifiedChart
 *   timeRanges={chartData}
 *   value={1000}
 *   changePercent={5.2}
 *   isLoading={false}
 *   hasError={false}
 *   errorMessage="Failed to load chart data"
 *   chartConfig={{
 *     chartType: "area",
 *     color: "primary"
 *   }}
 * />
 * ```
 */

"use client";

import React, { useState, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Icon } from "@iconify/react";

import ChartHeader from "./header";
import RangeSelector from "./range-selector";
import LineChart from "./line-chart";
import BarGroupChart from "./bar-group-chart";
import {
  UnifiedChartProps,
  ChartDataPoint,
  ChartConfiguration,
  ChartHeaderConfiguration,
  RangeSelectorConfiguration,
  ChangeType,
} from "./chart-types";

// Default configurations
const defaultChartConfig: ChartConfiguration = {
  chartType: "area",
  changeType: "positive",
  height: {
    mobile: "10rem", // h-40
    desktop: "14rem", // h-56
  },
  showTooltip: true,
  showGradient: true,
  animationDuration: 1000,
  margins: {
    mobile: { top: 5, right: 0, bottom: 5, left: 0 },
    desktop: { top: 50, right: 20, bottom: 5, left: 20 },
  },
};

const defaultHeaderConfig: ChartHeaderConfiguration = {
  label: "",
  showChangeIndicator: true,
  position: "top",
  className: "",
};

const defaultRangeSelectorConfig: RangeSelectorConfiguration = {
  position: "bottom",
  orientation: "horizontal",
  className: "",
  variant: "solid",
};

// Intelligent label sampling function
const getOptimalLabelCount = (range: string, isMobile: boolean = false): number => {
  const mobileReduction = isMobile ? 0.7 : 1; // Reduce labels on mobile by 30%

  const baseCounts = {
    "24H": 6, // Every 4 hours
    "1W": 7, // One per day
    "1M": 8, // ~Every 4 days
    "3M": 6, // ~Every 2 weeks
    "1Y": 8, // ~Every 1.5 months
    "ALL": 8, // ~Every 1.5 months
  };

  const baseCount = baseCounts[range as keyof typeof baseCounts] || 6;

  return Math.max(3, Math.floor(baseCount * mobileReduction)); // Minimum 3 labels
};

// Sample only the labels for display, keep all data points for tooltips
const createChartDataWithSampledLabels = (
  labels: string[],
  values: number[],
  timestamps: number[] | undefined,
  optimalCount: number
): ChartDataPoint[] => {
  const totalPoints = labels.length;

  if (totalPoints === 0) return [];

  // Always include all data points for tooltips to work everywhere
  const allDataPoints: ChartDataPoint[] = labels.map((label, i) => ({
    label,
    value: values[i] || 0,
    displayLabel: "", // Initialize as empty, will be set below for sampled points
    timestamp: timestamps?.[i], // Include timestamp for full date display in tooltip
  }));

  // If we have fewer or equal points than optimal, show all labels
  if (totalPoints <= optimalCount) {
    return allDataPoints.map((point) => ({
      ...point,
      displayLabel: point.label, // Show all labels
    }));
  }

  // Calculate which points should have visible labels
  const step = Math.floor(totalPoints / (optimalCount - 1));
  const labelIndices = new Set<number>();

  // Always include first point
  labelIndices.add(0);

  // Add evenly spaced middle points
  for (let i = step; i < totalPoints - step; i += step) {
    labelIndices.add(i);
  }

  // Always include last point (most recent)
  labelIndices.add(totalPoints - 1);

  // Set displayLabel only for sampled indices
  return allDataPoints.map((point, index) => ({
    ...point,
    displayLabel: labelIndices.has(index) ? point.label : "",
  }));
};

// Error state component
const ChartErrorState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
    <Icon className="w-12 h-12 text-gray-400 mb-3 opacity-50" icon="mdi:chart-line-variant" />
    <p className="text-sm text-gray-500 font-medium">{message || "Failed to load chart data"}</p>
    <p className="text-xs text-gray-400 mt-1">Please try again later</p>
  </div>
);

export const UnifiedChart: React.FC<UnifiedChartProps> = ({
  timeRanges,
  value,
  changePercent,
  isLoading = false,
  hasError = false,
  errorMessage,
  selectedRange: propSelectedRange,
  onRangeChange: propOnRangeChange,
  chartConfig,
  headerConfig,
  rangeSelectorConfig,
  className = "",
  containerClassName = "",
  children,
  additionalActions,
  emptyContent,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Merge configurations with defaults
  const finalChartConfig = { ...defaultChartConfig, ...chartConfig };
  const finalHeaderConfig = { ...defaultHeaderConfig, ...headerConfig };
  const finalRangeSelectorConfig = {
    ...defaultRangeSelectorConfig,
    ...rangeSelectorConfig,
  };

  // Internal state for range selection if not controlled
  const [internalRange, setInternalRange] = useState(() => {
    const ranges = Object.keys(timeRanges);

    return ranges.includes("1M") ? "1M" : ranges[0] || "";
  });

  // Update internal range when timeRanges changes and we don't have a valid selection
  React.useEffect(() => {
    const ranges = Object.keys(timeRanges);

    if (ranges.length > 0 && (!internalRange || !ranges.includes(internalRange))) {
      const defaultRange = ranges.includes("1M") ? "1M" : ranges[0];

      setInternalRange(defaultRange);
    }
  }, [timeRanges, internalRange]);

  const selectedRange = propSelectedRange ?? internalRange;
  const onRangeChange = propOnRangeChange ?? setInternalRange;

  // Memoized chart data computation with intelligent sampling
  const chartData: ChartDataPoint[] = useMemo(() => {
    const currentData = timeRanges[selectedRange];

    if (!currentData) {
      return [];
    }

    // Get optimal label count for current range and device
    const optimalCount = getOptimalLabelCount(selectedRange, isMobile);

    // Create chart data with all points but sampled labels
    return createChartDataWithSampledLabels(currentData.labels, currentData.values, currentData.timestamps, optimalCount);
  }, [timeRanges, selectedRange, isMobile]);

  // Compute change type based on data if not explicitly set
  const computedChangeType: ChangeType = useMemo(() => {
    if (finalChartConfig.changeType && finalChartConfig.changeType !== "neutral") {
      return finalChartConfig.changeType;
    }

    const currentData = timeRanges[selectedRange];

    if (!currentData || currentData.values.length < 2) return "neutral";

    const firstValue = currentData.values[0];
    const lastValue = currentData.values[currentData.values.length - 1];

    return lastValue >= firstValue ? "positive" : "negative";
  }, [timeRanges, selectedRange, finalChartConfig.changeType]);

  // Dynamic height based on configuration
  const chartHeight = isMobile ? finalChartConfig.height?.mobile : finalChartConfig.height?.desktop;

  // Responsive layout classes
  const getLayoutClasses = () => {
    const baseClasses = "w-full";

    if (isMobile) {
      // Mobile: Range selector at bottom
      return {
        container: `${baseClasses} flex flex-col`,
        header: "w-full",
        chartContainer: "w-full flex flex-col-reverse",
        rangeSelector: "w-full flex flex-col overflow-x-auto",
        chart: `w-full mb-2 relative`,
      };
    } else {
      // Desktop: Range selector below header
      return {
        container: `${baseClasses}`,
        header: "w-full",
        chartContainer: "w-full flex flex-col",
        rangeSelector: "w-full flex flex-col",
        chart: `w-full mb-2 relative`,
      };
    }
  };

  const layoutClasses = getLayoutClasses();

  const renderChart = () => {
    // Show error state if there's an error
    if (hasError) {
      // If there's no data but also a specific empty content is provided, prefer it
      if (emptyContent) {
        return <div className="w-full h-full flex items-center justify-center">{emptyContent}</div>;
      }

      return <ChartErrorState message={errorMessage} />;
    }

    // If there is simply no data to render (e.g., empty arrays), show the provided empty content
    if (!isLoading && emptyContent && chartData.length === 0) {
      return <div className="w-full h-full flex items-center justify-center">{emptyContent}</div>;
    }

    const commonProps = {
      data: chartData,
      isLoading,
      changeType: computedChangeType,
      color: finalChartConfig.color,
      tooltipLabel: finalHeaderConfig.label,
      hasError,
    };

    switch (finalChartConfig.chartType) {
      case "line":
      case "area":
      default:
        return <LineChart key={selectedRange} {...commonProps} />;
      case "bar":
        return <BarGroupChart portfolio={null} />; // You might need to adapt this
    }
  };

  return (
    <div className={`${containerClassName}`}>
      <div className={`lg:bg-card bg-transparent lg:p-4 ${className} rounded-lg`}>
        <div className={layoutClasses.container}>
          {/* Header Section */}
          <div className="flex flex-row justify-between items-center">
            <ChartHeader
              changePercent={changePercent}
              className={`${finalHeaderConfig.className} !gap-1`}
              isLoading={isLoading}
              label={finalHeaderConfig.label}
              value={value}>
              {finalHeaderConfig.children}
            </ChartHeader>

            {/* Additional Actions (Desktop) */}
            {additionalActions && <div className="hidden lg:flex">{additionalActions}</div>}
          </div>

          {/* Desktop Range Selector - Below Header */}
          {!isLoading && !hasError && (
            <div className={`w-fit hidden lg:flex flex-col pb-2 ${finalRangeSelectorConfig.className}`}>
              <RangeSelector range={selectedRange} ranges={timeRanges} setRange={onRangeChange} />
            </div>
          )}
          {/* Chart and Mobile Range Selector */}
          <div className={layoutClasses.chartContainer}>
            {/* Mobile Range Selector */}
            {!isLoading && !hasError && (
              <div className={`w-full lg:hidden flex flex-col overflow-x-auto ${finalRangeSelectorConfig.className}`}>
                <RangeSelector range={selectedRange} ranges={timeRanges} setRange={onRangeChange} />
              </div>
            )}

            {/* Chart */}
            <div className={layoutClasses.chart} style={{ height: chartHeight }}>
              {renderChart()}
            </div>
          </div>

          {/* Children content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default UnifiedChart;
