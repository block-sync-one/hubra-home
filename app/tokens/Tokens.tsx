"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import { useCurrency } from "@/lib/context/currency-format";
import { StatsGridSkeleton } from "@/components/StatsCardSkeleton";
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
          {change !== undefined && <PriceChangeChip changePercent={change} className={"bg-transparent"} />}
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

interface GlobalData {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
    new_tokens?: number;
    solana_tvl?: number;
    solana_tvl_change?: number;
    stablecoins_tvl?: number;
    stablecoins_tvl_change?: number;
  };
}

export default function Tokens() {
  const { formatPrice } = useCurrency();
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGlobalData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/crypto/global", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch global data");
        }

        const data = await response.json();

        setGlobalData(data);
      } catch {
        setError("Failed to fetch global data");
      } finally {
        setLoading(false);
      }
    }

    fetchGlobalData();
  }, []);

  const statsData: StatData[] = useMemo(() => {
    if (!globalData?.data) return [];

    const { data } = globalData;

    return [
      {
        title: "Total Market Cap",
        value: formatPrice(data.total_market_cap.usd),
        change: data.market_cap_change_percentage_24h_usd,
        isPositive: (data.market_cap_change_percentage_24h_usd || 0) >= 0,
      },
      {
        title: "Trading Vol",
        value: formatPrice(data.total_volume.usd),
        isPositive: true,
      },
      {
        title: "New Tokens",
        value: (data.new_tokens || 0).toLocaleString(),
      },
      {
        title: "Solana TVL",
        value: formatPrice(data.solana_tvl || 0),
        change: data.solana_tvl_change,
        isPositive: (data.solana_tvl_change || 0) >= 0,
      },
      {
        title: "Stablecoins TVL",
        value: formatPrice(data.stablecoins_tvl || 0),
        change: data.stablecoins_tvl_change,
        isPositive: (data.stablecoins_tvl_change || 0) >= 0,
      },
    ];
  }, [globalData, formatPrice]);

  const statsCards = useMemo(
    () =>
      statsData.map((stat, index) => (
        <StatCard key={`stat-${index}`} {...stat} className={index === 0 ? "[&>div:first-child]:hidden" : ""} />
      )),
    [statsData]
  );

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium text-white">Tokens</h2>
        <StatsGridSkeleton count={5} />
      </div>
    );
  }

  // Enhanced error state with retry functionality
  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium text-white">Tokens</h2>
        <div className="relative rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <Icon className="w-12 h-12 text-red-500 mx-auto mb-4" icon="mdi:alert-circle" />
              <h3 className="text-lg font-medium text-white mb-2">Failed to Load Data</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => window.location.reload()}>
                <Icon className="w-4 h-4 inline mr-2" icon="mdi:refresh" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data scenario
  if (!globalData || !globalData.data) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium text-white">Tokens</h2>
        <div className="relative rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" icon="mdi:database-off" />
              <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
              <p className="text-gray-400 mb-6">Unable to fetch global cryptocurrency data at this time.</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => window.location.reload()}>
                <Icon className="w-4 h-4 inline mr-2" icon="mdi:refresh" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-medium text-white">Tokens</h2>

      <StatsGrid>{statsCards}</StatsGrid>
    </div>
  );
}
