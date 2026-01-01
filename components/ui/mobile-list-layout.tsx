"use client";

/**
 * MobileListLayout Component
 * Shared mobile list view for tables (tokens, protocols, etc.)
 * Renders items in a consistent card-based layout
 */

import React from "react";
import { Icon } from "@iconify/react";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

export interface MobileListItem {
  key: string;
  logoURI?: string;
  logo?: string;
  name: string;
  symbol?: string;
  subtitle?: string;
  primaryValue: string;
  secondaryValue?: string;
  change?: number;
  changeLabel?: string;
}

interface MobileListLayoutProps<T = MobileListItem> {
  items: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: T) => void;
  onItemHover?: (item: T) => void;
  renderItem?: (item: T) => React.ReactNode;
}

/**
 * Generic mobile list layout
 *
 * Can render custom items or use default card layout
 *
 * Example with custom render:
 * ```tsx
 * <MobileListLayout
 *   items={protocols}
 *   onItemClick={handleClick}
 *   renderItem={(protocol) => (
 *     <CustomProtocolCard protocol={protocol} />
 *   )}
 * />
 * ```
 *
 * Example with default layout:
 * ```tsx
 * <MobileListLayout
 *   items={tokens.map(token => ({
 *     key: token.id,
 *     logoURI: token.logoURI,
 *     name: token.name,
 *     symbol: token.symbol,
 *     primaryValue: token.price,
 *     change: token.change
 *   }))}
 *   onItemClick={handleClick}
 * />
 * ```
 */
export function MobileListLayout<T extends MobileListItem>({
  items,
  isLoading = false,
  emptyMessage = "No data available",
  onItemClick,
  onItemHover,
  renderItem,
}: MobileListLayoutProps<T>) {
  // Memoize click handler to avoid creating new function on each render
  const handleItemClick = React.useCallback(
    (item: T) => {
      onItemClick?.(item);
    },
    [onItemClick]
  );

  const handleItemHover = React.useCallback(
    (item: T) => {
      onItemHover?.(item);
    },
    [onItemHover]
  );

  if (isLoading) {
    return (
      <div className="md:hidden py-6 text-center">
        <Icon className="animate-spin text-gray-500 mx-auto mb-2" icon="solar:refresh-linear" width={24} />
        <p className="text-xs text-gray-400">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="md:hidden py-6 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="md:hidden rounded-lg overflow-hidden">
      {items.map((item) => {
        // Use custom render if provided
        if (renderItem) {
          return (
            <div
              key={item.key}
              aria-label="Item details"
              className="cursor-pointer"
              role="button"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemHover(item)}>
              {renderItem(item)}
            </div>
          );
        }

        // Default card layout
        return (
          <div
            key={item.key}
            aria-label="Item details"
            className="flex items-center justify-between py-2 transition-colors cursor-pointer"
            role="button"
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => handleItemHover(item)}>
            {/* Left Column: Logo, Name, Subtitle */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {(item.logoURI || item.logo) && (
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                  <ImageWithSkeleton
                    alt={`${item.name} logo`}
                    className="w-full h-full object-cover"
                    height={36}
                    src={item.logoURI || item.logo || ""}
                    width={36}
                  />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{item.name}</span>
                {(item.symbol || item.subtitle) && (
                  <span className="text-xs text-gray-400 uppercase font-medium truncate">{item.symbol || item.subtitle}</span>
                )}
              </div>
            </div>

            {/* Right Column: Primary Value and Change */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">{item.primaryValue}</span>
              {(item.change !== undefined || item.secondaryValue) && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    item.change && item.change > 0 ? "text-success" : item.change && item.change < 0 ? "text-danger" : "text-gray-400"
                  }`}>
                  {item.change !== undefined && item.change !== 0 && (
                    <Icon icon={item.change > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
                  )}
                  <span>{item.secondaryValue || (item.change ? `${Math.abs(item.change).toFixed(2)}%` : "0.00%")}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Memoized version for performance
export const MemoizedMobileListLayout = React.memo(MobileListLayout) as typeof MobileListLayout;
