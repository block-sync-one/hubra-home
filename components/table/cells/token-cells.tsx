import React from "react";

import { MiniChart } from "./mini-chart";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { Token } from "@/lib/types/token";
import { PriceChangeChip, PriceDisplay } from "@/components/price";

export const TokenCell = React.memo(({ item, columnKey }: { item: Token; columnKey: string }) => {
  switch (columnKey) {
    case "rank":
      return <div className="text-center text-sm text-gray-400">{(item as any)._index !== undefined ? (item as any)._index + 1 : "-"}</div>;

    case "token":
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithSkeleton
              alt={`${item.name} (${item.symbol}) logo`}
              className="w-full h-full object-cover"
              height={36}
              src={item.logoURI || ""}
              width={36}
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate">
                {item.name && item.name.length > 12 ? (
                  <>
                    <span className="lg:hidden">{item.name}</span>
                    <span className="hidden lg:inline">{item.name}</span>
                  </>
                ) : (
                  item.name || "Unknown"
                )}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
              {item.symbol || "Unknown"}
            </span>
          </div>
        </div>
      );

    case "price":
      return (
        <div className="text-right font-medium">
          <span className="text-sm text-foreground">{item.price || "N/A"}</span>
        </div>
      );

    case "marketCap":
      return (
        <div className="text-right font-medium">
          <PriceDisplay value={item.marketCap ?? 0} />
        </div>
      );

    case "volume":
      return (
        <div className="text-left font-medium">
          <span className="text-sm text-foreground">{item.volume || "N/A"}</span>
        </div>
      );

    case "priceChange24hPct":
      return (
        <div className="flex justify-end">
          <PriceChangeChip changePercent={item.change} />
        </div>
      );

    case "chart":
      return (
        <div className="flex justify-end items-center w-full">
          <div className="w-[120px] h-[28px]">
            <MiniChart key={`chart-${item.id}`} change={item.change} tokenId={item.id} />
          </div>
        </div>
      );

    case "action":
      return (
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-primary-500/15 text-primary-500 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-500/20 transition-colors"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open("https://hubra.app/convert", "_blank");
            }}>
            Buy/Sell
          </button>
        </div>
      );

    default:
      return null;
  }
});

TokenCell.displayName = "TokenCell";
