import React from "react";
import { Image, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { fixedNumber } from "@/lib/utils/helper";
import { Token } from "@/lib/models";
import { PriceDisplay } from "@/components/price";

type EarnOpportunity = {
  apy: number;
  platform: string;
  platformImage: string;
  strategy: string;
};

export const TokenCell = React.memo(
  ({
    item,
    columnKey,
    earnOpportunity,
  }: {
    item: Token;
    columnKey: string;
    earnOpportunity?: EarnOpportunity;
  }) => {
    switch (columnKey) {
      case "token":
        return (
          <div className="flex items-center gap-2">
            <Image
              alt={item.symbol}
              fallbackSrc="/images/placeholder.svg"
              height={32}
              src={item.logoURI || "/images/placeholder.svg"}
              width={32}
            />
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground truncate">
                  {item.name || "Unknown"}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider">
                <span className=" lg:hidden inline">
                  {fixedNumber(item.balance ?? 0)}
                </span>{" "}
                {item.symbol || "Unknown"}
                {earnOpportunity && (
                  <Chip
                    className="ml-1 h-fit w-fit p-0.5 rounded-md text-[9px]"
                    color="default"
                    size="sm"
                    variant="flat"
                  >
                    <div className="flex items-center font-bold gap-1 ">
                      <Icon icon="mdi:trending-up" />
                      <span>up to {earnOpportunity.apy.toFixed(1)}% APY</span>
                    </div>
                  </Chip>
                )}
              </span>
            </div>
          </div>
        );

      case "price":
        return (
          <div className="text-right font-medium flex flex-col items-end gap-1">
            <PriceDisplay value={item.price ?? 0} />
          </div>
        );

      case "balance":
        return (
          <div className="text-right font-medium flex flex-col items-end">
            <div className="hidden lg:block">
              {fixedNumber(item.balance ?? 0)}{" "}
              <span className="hidden lg:inline">{item?.symbol}</span>
            </div>
            <div className=" lg:text-gray-400 text-base">
              <PriceDisplay value={item.value ?? 0} />
            </div>
            <div
              className={`flex items-center text-xs gap-1 lg:hidden ${item.priceChange24hPct && item.priceChange24hPct > 0 ? "text-success" : item.priceChange24hPct && item.priceChange24hPct < 0 ? "text-danger" : "text-gray-400"}`}
            >
              {item.priceChange24hPct && (
                <Icon
                  icon={
                    item.priceChange24hPct > 0
                      ? "mdi:arrow-up"
                      : "mdi:arrow-down"
                  }
                />
              )}
              <span>
                {item.priceChange24hPct ? item.priceChange24hPct.toFixed(2) : 0}
                %
              </span>
            </div>
          </div>
        );

      case "priceChange24hPct":
        return (
          <div className="flex justify-end">
            <Chip
              className="py-1 h-[30px]"
              color={
                item.priceChange24hPct && item.priceChange24hPct > 0
                  ? "success"
                  : item.priceChange24hPct && item.priceChange24hPct < 0
                    ? "danger"
                    : "default"
              }
              size="sm"
              variant="flat"
            >
              <div className="flex items-center font-bold gap-1">
                {item.priceChange24hPct !== undefined &&
                  item.priceChange24hPct !== 0 && (
                    <Icon
                      icon={
                        item.priceChange24hPct > 0
                          ? "mdi:arrow-up"
                          : "mdi:arrow-down"
                      }
                    />
                  )}
                <span>
                  {item.priceChange24hPct
                    ? item.priceChange24hPct.toFixed(2)
                    : 0}
                  %
                </span>
              </div>
            </Chip>
          </div>
        );

      default:
        return null;
    }
  },
);

TokenCell.displayName = "TokenCell";
