import React from "react";
import { Chip } from "@heroui/react";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { formatCurrency } from "@/lib/utils/helper";
import { Protocol } from "@/lib/types/defi-stats";

interface ProtocolCellProps {
  item: Protocol & { _index?: number };
  columnKey: "rank" | "protocol" | "tvl" | "assetToken" | "category";
}

/**
 * Get display value for assetToken column
 * Falls back to symbol if assetToken is empty or "-"
 */
function getAssetTokenDisplayValue(assetToken?: string, symbol?: string): string {
  if (assetToken && assetToken !== "-") {
    return assetToken;
  }

  return symbol || "-";
}

/**
 * Normalize category to array format
 */
function normalizeCategory(category?: string | string[]): string[] {
  if (Array.isArray(category)) {
    return category;
  }

  return category ? [category] : ["Uncategorized"];
}

function renderRankCell(item: Protocol & { _index?: number }) {
  const rank = item._index !== undefined ? item._index + 1 : "-";

  return <div className="flex justify-center text-gray-400">{rank}</div>;
}

function renderProtocolCell(item: Protocol) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
        <ImageWithSkeleton
          alt={`${item.name} logo`}
          className="w-full h-full object-cover"
          height={36}
          src={item.logo || "/logo.svg"}
          width={36}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-white truncate">{item.name}</span>
      </div>
    </div>
  );
}

function renderTvlCell(item: Protocol) {
  return <div className="font-medium text-white">{formatCurrency(item.tvl, true)}</div>;
}

function renderAssetTokenCell(item: Protocol) {
  const displayValue = getAssetTokenDisplayValue(item.assetToken, item.symbol);

  return (
    <div className="text-sm text-gray-400 pl-12" title={displayValue !== "-" ? displayValue : undefined}>
      {displayValue !== "-" ? <span className="uppercase font-medium">{displayValue}</span> : "-"}
    </div>
  );
}

function renderCategoryCell(item: Protocol) {
  const categories = normalizeCategory(item.category);

  return (
    <div className="flex flex-nowrap gap-1 justify-end pr-5">
      {categories.map((cat, i) => (
        <Chip key={i} className="text-xs shrink-0" size="sm" variant="flat">
          {cat}
        </Chip>
      ))}
    </div>
  );
}

/**
 * Protocol Table Cell Renderer
 * Renders different cells based on column key
 */
export function ProtocolCell({ item, columnKey }: ProtocolCellProps) {
  switch (columnKey) {
    case "rank":
      return renderRankCell(item);
    case "protocol":
      return renderProtocolCell(item);
    case "tvl":
      return renderTvlCell(item);
    case "assetToken":
      return renderAssetTokenCell(item);
    case "category":
      return renderCategoryCell(item);
    default:
      return <span className="text-gray-400">-</span>;
  }
}
