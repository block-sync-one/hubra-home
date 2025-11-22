"use client";

import React, { memo, useMemo } from "react";

import { useCurrency } from "@/lib/context/currency-format";
import { PriceChangeChip } from "@/components/price";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  isPositive?: boolean;
  className?: string;
}

const StatCard = memo(function StatCard({ title, value, change, className = "" }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-1.5 md:h-[91px] justify-center p-4 relative md:flex-1 w-full ${className}`}>
      {/* Vertical separator - centered and doesn't take full height */}
      <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-14 bg-gray-850" />
      <div className="text-left">
        <p className="text-sm font-medium text-gray-400 whitespace-nowrap">{title}</p>

        <div className="flex items-center mt-1">
          <p className="text-lg font-medium whitespace-nowrap text-white">{value}</p>
          {change !== undefined && change != 0 && <PriceChangeChip changePercent={change} className={"bg-transparent"} />}
        </div>
      </div>
    </div>
  );
});

interface StatsGridProps {
  children: React.ReactNode;
}

const StatsGrid = memo(function StatsGrid({ children }: StatsGridProps) {
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);

  // Create mobile rows dynamically
  const mobileRows = useMemo(() => {
    const rows = [];

    for (let i = 0; i < childrenArray.length; i += 2) {
      const rowItems = childrenArray.slice(i, i + 2);
      const hasOnlyOneItem = rowItems.length === 1;

      rows.push(
        <div key={`mobile-row-${i}`} className="flex">
          {rowItems.map((child, index) => (
            <div key={`mobile-item-${i + index}`} className={hasOnlyOneItem ? "w-full" : "w-1/2"}>
              {child}
            </div>
          ))}
        </div>
      );
    }

    return rows;
  }, [childrenArray]);

  return (
    <div className="relative rounded-xl bg-card overflow-hidden">
      {/* Desktop: 5 columns with custom vertical separators */}
      <div className="hidden md:flex flex-wrap">{children}</div>

      {/* Mobile: Dynamic grid based on number of items */}
      <div className="md:hidden">{mobileRows}</div>
    </div>
  );
});

interface StatData {
  title: string;
  value: string;
  change?: number;
  isPositive?: boolean;
}

interface TokensProps {
  totalFDV: number;
  totalVolume: number;
  fdvChange: number;
  solFDV: number;
  solFDVChange: number;
  newTokensCount: number;
  stablecoinTVL: number;
  stablecoinTVLChange: number;
}

export default function Tokens({
  totalFDV,
  totalVolume,
  fdvChange,
  solFDV,
  solFDVChange,
  newTokensCount,
  stablecoinTVL,
  stablecoinTVLChange,
}: TokensProps) {
  const { formatPrice } = useCurrency();

  const statsData: StatData[] = useMemo(() => {
    return [
      {
        title: "Total FDV",
        value: formatPrice(totalFDV),
        change: fdvChange,
        isPositive: fdvChange >= 0,
      },
      {
        title: "Trading Vol",
        value: formatPrice(totalVolume),
        isPositive: true,
      },
      /*      {
        title: "New Tokens",
        value: newTokensCount.toLocaleString(),
      },*/
      {
        title: "Solana FDV",
        value: formatPrice(solFDV),
        change: solFDVChange,
        isPositive: solFDVChange >= 0,
      },
      {
        title: "Stablecoins TVL",
        value: formatPrice(stablecoinTVL),
        change: stablecoinTVLChange,
        isPositive: stablecoinTVLChange >= 0,
      },
    ];
  }, [totalFDV, totalVolume, fdvChange, solFDV, solFDVChange, newTokensCount, stablecoinTVL, stablecoinTVLChange, formatPrice]);

  const statsCards = useMemo(
    () =>
      statsData.map((stat, index) => (
        <StatCard key={`stat-${index}`} {...stat} className={index === 0 ? "[&>div:first-child]:hidden" : ""} />
      )),
    [statsData]
  );

  return (
    <div className="flex flex-col gap-1 md:gap-6">
      <h2 className="text-lg md:text-2xl font-medium text-white">Tokens</h2>

      <StatsGrid>{statsCards}</StatsGrid>
    </div>
  );
}
