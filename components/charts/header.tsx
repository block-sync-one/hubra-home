"use client";

/**
 * @deprecated This component has been replaced by UnifiedChart.
 * Use UnifiedChart with headerConfig instead.
 * This component is only kept for internal use by UnifiedChart.
 */
import React, { useMemo } from "react";
import { Chip, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";

import { PriceDisplay } from "../price";

interface ChartHeaderProps {
  value: number;
  changePercent: number;
  isLoading: boolean;
  children?: React.ReactNode;
  label?: string;
  className?: string;
}

// Memoized PriceDisplay Component to prevent unnecessary re-renders
const MemoizedPriceDisplay = React.memo(
  ({ value }: { value: number }) => <PriceDisplay value={value} />,
  (prevProps, nextProps) => {
    // Only re-render if the value actually changed (with precision check for floats)
    return Math.abs(prevProps.value - nextProps.value) < 0.01;
  }
);

MemoizedPriceDisplay.displayName = "MemoizedPriceDisplay";

// Memoized Chip Component to prevent unnecessary re-renders
const MemoizedChip = React.memo(
  ({ changePercent, className }: { changePercent: number; className?: string; showDecimals?: boolean }) => {
    const chipColor = changePercent >= 0 ? "success" : "danger";
    const iconName = changePercent >= 0 ? "mdi:arrow-up" : "mdi:arrow-down";
    const displayValue = changePercent.toFixed(2);

    return (
      <Chip
        aria-label={`Portfolio change percent: ${changePercent}%`}
        className={`py-1 mb-1  ${className}`}
        color={chipColor}
        size="sm"
        variant="flat">
        <div className="flex items-center font-medium gap-1">
          <Icon aria-hidden="true" icon={iconName} />
          <span>{displayValue}%</span>
        </div>
      </Chip>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the change percent actually changed significantly
    return Math.abs(prevProps.changePercent - nextProps.changePercent) < 0.01;
  }
);

MemoizedChip.displayName = "MemoizedChip";

// Memoized Label Component
const MemoizedLabel = React.memo(({ label }: { label?: string }) => {
  if (!label) return null;

  return <div className="text-sm text-gray-500">{label}</div>;
});

MemoizedLabel.displayName = "MemoizedLabel";

const ChartHeader: React.FC<ChartHeaderProps> = ({ value, changePercent, isLoading, children, className, label = "" }) => {
  // Memoize loading state to prevent unnecessary re-renders
  const loadingSkeleton = useMemo(() => <Skeleton className="w-[160px] h-[35px]" />, []);

  // Early return for loading state
  if (isLoading) {
    return (
      <div className={`w-full flex flex-col gap-3 ${className}`}>
        <div className="text-sm text-gray-500">{label}</div>
        {loadingSkeleton}
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* PriceDisplay and Label Row */}
      <div className="w-full flex flex-row items-start justify-between gap-2">
        <div className="flex flex-col whitespace-nowrap  justify-between">
          <MemoizedLabel label={label} />
          <div className="text-3xl font-medium tracking-tight flex flex-row items-end gap-2">
            <PriceDisplay longNumbers={true} value={value} />

            {/* Mobile: Children (tabs) inline with price */}
            <MemoizedChip changePercent={changePercent} />
          </div>
        </div>

        <div className="lg:hidden">{children}</div>
      </div>

      {/* Mobile: Chip below price */}
      {/* <MemoizedChip changePercent={changePercent} className="flex lg:hidden w-fit" showDecimals={true} /> */}

      {/* Desktop: Children (like tabs) below */}
      <div className="hidden lg:block">{children}</div>
    </div>
  );
};

// Memoize the entire component to prevent re-renders when props haven't changed
export default React.memo(ChartHeader, (prevProps, nextProps) => {
  return (
    prevProps.isLoading === nextProps.isLoading &&
    Math.abs(prevProps.value - nextProps.value) < 0.01 &&
    Math.abs(prevProps.changePercent - nextProps.changePercent) < 0.01 &&
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children
  );
});
