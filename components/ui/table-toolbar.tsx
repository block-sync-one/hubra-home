"use client";

/**
 * TableToolbar Component
 * Reusable toolbar for tables with search, tabs, filters
 */

import React from "react";

import { SearchField } from "./search-field";

import { TabsUI } from "@/components/tabs";
import { TabIdType } from "@/lib/models";

export interface ToolbarTab {
  id: string;
  label: string;
}

interface TableToolbarProps {
  // Title
  title?: string | React.ReactNode;

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Tabs
  tabs?: ToolbarTab[];
  selectedTab?: TabIdType | string;
  onTabChange?: (tab: TabIdType | string) => void;
  showTabs?: boolean;

  // Custom content
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;

  // Layout
  variant?: "default" | "simple";
  className?: string;
}

/**
 * TableToolbar Component
 *
 * Flexible toolbar for tables with:
 * - Title or custom left content
 * - Search field
 * - Tabs
 * - Custom right content
 *
 * Example - Simple title + search:
 * ```tsx
 * <TableToolbar
 *   title="All Protocols"
 *   searchValue={filterValue}
 *   onSearchChange={setFilterValue}
 *   searchPlaceholder="Search protocols..."
 * />
 * ```
 *
 * Example - With tabs:
 * ```tsx
 * <TableToolbar
 *   tabs={[
 *     { id: 'all', label: 'All Tokens' },
 *     { id: 'favorites', label: 'Favorites' }
 *   ]}
 *   selectedTab={currentTab}
 *   onTabChange={setCurrentTab}
 *   searchValue={searchTerm}
 *   onSearchChange={setSearchTerm}
 * />
 * ```
 *
 * Example - Custom content:
 * ```tsx
 * <TableToolbar
 *   leftContent={<h2>Custom Title</h2>}
 *   rightContent={<FilterButton />}
 * />
 * ```
 */
export function TableToolbar({
  title,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  tabs = [],
  selectedTab,
  onTabChange,
  showTabs = tabs.length > 0,
  leftContent,
  rightContent,
  centerContent,
  variant = "default",
  className = "",
}: TableToolbarProps) {
  // Simple variant: just title and search in a row
  if (variant === "simple") {
    return (
      <div className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}>
        {/* Left: Title or custom content */}
        {leftContent || (title && <div className="text-xl font-bold text-white">{title}</div>)}

        {/* Right: Search or custom content */}
        {rightContent ||
          (showSearch && onSearchChange && (
            <div className="w-full md:max-w-xs">
              <SearchField
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={onSearchChange}
                onClear={() => onSearchChange("")}
              />
            </div>
          ))}
      </div>
    );
  }

  // Default variant: full-featured with tabs
  return (
    <div className={`w-full ${className}`}>
      {/* Top row: Tabs (desktop) + Search */}
      <div className="w-full relative mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Tabs (desktop only) */}
          {showTabs && tabs.length > 0 && onTabChange && (
            <div className="hidden lg:flex">
              <TabsUI
                className="border-b-1 border-gray-30"
                selectedTab={selectedTab as TabIdType}
                tabsData={tabs.map((t) => ({
                  id: t.id as TabIdType,
                  label: t.label,
                }))}
                onTabChange={onTabChange as (tab: TabIdType) => void}
              />
            </div>
          )}

          {/* Center: Custom content */}
          {centerContent}

          {/* Right: Search */}
          {showSearch && onSearchChange && (
            <div className="w-full md:max-w-xs ml-auto">
              <SearchField
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={onSearchChange}
                onClear={() => onSearchChange("")}
              />
            </div>
          )}

          {/* Right: Custom content */}
          {rightContent}
        </div>
      </div>

      {/* Bottom row: Tabs (mobile) */}
      {showTabs && tabs.length > 0 && onTabChange && (
        <div className="lg:hidden mb-4">
          <TabsUI
            selectedTab={selectedTab as TabIdType}
            tabsData={tabs.map((t) => ({
              id: t.id as TabIdType,
              label: t.label,
            }))}
            onTabChange={onTabChange as (tab: TabIdType) => void}
          />
        </div>
      )}
    </div>
  );
}

// Memoized version for performance
export const MemoizedTableToolbar = React.memo(TableToolbar);
