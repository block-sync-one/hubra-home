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
  columnKey: "rank" | "protocol" | "tvl" | "description" | "category";
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
              height={36}
              src={item.logo || "/logo.svg"}
              width={36}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate">{item.name}</span>
              {item.symbol && <span className="text-xs text-gray-400 font-medium">{item.symbol}</span>}
            </div>
          </div>
        </div>
      );

    case "tvl":
      return <div className="font-medium text-white">{formatCurrency(item.tvl, true)}</div>;

    case "description":
      const description = item.description || "";
      const truncatedDescription = description.length > 150 ? `${description.substring(0, 150)}...` : description;

      return (
        <div className="text-sm text-gray-400 line-clamp-2 pl-12" title={description || undefined}>
          {truncatedDescription || "-"}
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
