import React from "react";
import { Chip } from "@heroui/react";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { formatCurrency } from "@/lib/utils/helper";
import { Protocol } from "@/lib/types/defi-stats";

/**
 * Protocol Table Cell Renderer
 * Renders different cells based on column key
 */

interface ProtocolCellProps {
  item: Protocol & { _index?: number };
  columnKey: "rank" | "protocol" | "tvl" | "change_7d" | "category";
}

export function ProtocolCell({ item, columnKey }: ProtocolCellProps) {
  switch (columnKey) {
    case "rank":
      return <div className="flex justify-center text-gray-400">{item._index !== undefined ? item._index + 1 : "-"}</div>;

    case "protocol":
      return (
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithSkeleton
              alt={`${item.name} logo`}
              className="w-full h-full object-cover"
              height={32}
              src={item.logo || "/logo.svg"}
              width={32}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{item.name}</span>
          </div>
        </div>
      );

    case "tvl":
      return <div className="font-medium text-white">{formatCurrency(item.tvl, true)}</div>;

    case "change_7d":
      const isPositive = item.change_7d && item.change_7d >= 0;

      return (
        <div className={`font-medium ${isPositive ? "text-success" : "text-danger"}`}>
          {item.change_7d ? `${item.change_7d > 0 ? "+" : ""}${item.change_7d.toFixed(2)}%` : "N/A"}
        </div>
      );

    case "category":
      return (
        <div className="flex flex-wrap gap-1 justify-end">
          {(Array.isArray(item.category) ? item.category : [item.category || "Uncategorized"]).map((cat, i) => (
            <Chip key={i} className="text-xs" size="sm" variant="flat">
              {cat}
            </Chip>
          ))}
        </div>
      );

    default:
      return <span className="text-gray-400">-</span>;
  }
}
