import React from "react";
import { Image, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { Token } from "@/lib/types/token";
import { PriceDisplay } from "@/components/price";

export const TokenCell = React.memo(({ item, columnKey }: { item: Token; columnKey: string }) => {
  switch (columnKey) {
    case "token":
      return (
        <div className="flex items-center gap-2">
          <Image alt={item.symbol} fallbackSrc="/logo.svg" height={32} src={item.imgUrl || "/logo.svg"} width={32} />
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate">{item.name || "Unknown"}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
              {item.symbol || "Unknown"}
            </span>
          </div>
        </div>
      );

    case "price":
      return (
        <div className="text-right font-medium flex flex-col items-end gap-1">
          <span className="text-sm text-foreground">{item.price || "N/A"}</span>
        </div>
      );

    case "marketCap":
      return (
        <div className="text-right font-medium flex flex-col items-end">
          <PriceDisplay value={item.marketCap ?? 0} />
        </div>
      );

    case "volume":
      return (
        <div className="text-right font-medium flex flex-col items-end">
          <span className="text-sm text-foreground">{item.volume || "N/A"}</span>
        </div>
      );

    case "priceChange24hPct":
      return (
        <div className="flex justify-end">
          <Chip
            className="py-1 h-[30px]"
            color={item.change && item.change > 0 ? "success" : item.change && item.change < 0 ? "danger" : "default"}
            size="sm"
            variant="flat">
            <div className="flex items-center font-bold gap-1">
              {item.change !== undefined && item.change !== 0 && <Icon icon={item.change > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} />}
              <span>{item.change ? item.change.toFixed(2) : 0}%</span>
            </div>
          </Chip>
        </div>
      );

    default:
      return null;
  }
});

TokenCell.displayName = "TokenCell";
