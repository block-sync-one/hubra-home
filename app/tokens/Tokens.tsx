"use client";

import React, { memo, useMemo, useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import { fixedNumber } from "@/lib/utils";
import { useCurrency } from "@/lib/context/currency-format";

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;

  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-danger-500",
    iconColor: isPositive ? "text-success-500" : "text-danger-500",
  };
};

const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);

  return (
    <div className="flex items-center gap-0.5">
      <Icon className={`w-3 h-3 ${config.iconColor}`} icon={config.icon} />
      <span className={`text-xs font-medium ${config.textColor}`}>{fixedNumber(Math.abs(value))}%</span>
    </div>
  );
});

ChangeIndicator.displayName = "ChangeIndicator";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  isPositive?: boolean;
  className?: string;
}

const StatCard = memo(function StatCard({ title, value, change, isPositive, className = "" }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-1.5 h-[91px] justify-center px-4 relative md:flex-1 w-full ${className}`}>
      {/* Border separator */}
      <div className="absolute border-r border-white/10 right-0 top-0 bottom-0" />

      <p className="text-sm font-medium text-gray-400 whitespace-nowrap">{title}</p>

      <div className="flex items-center gap-1">
        <p className="text-lg font-medium whitespace-nowrap text-white">{value}</p>

        {change !== undefined && <ChangeIndicator value={change} />}
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
      const isLastRow = i + 2 >= childrenArray.length;
      const hasOnlyOneItem = rowItems.length === 1;

      rows.push(
        <div key={`mobile-row-${i}`} className={`flex ${!isLastRow ? "border-b border-white/10" : ""}`}>
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
    <div className="relative rounded-xl border border-white/10 overflow-hidden">
      {/* Desktop: 5 columns in a row - each section has equal width */}
      <div className="hidden md:flex">{children}</div>

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
  };
}

export default function Tokens() {
  const { formatPrice } = useCurrency();
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/crypto/global");

        if (!response.ok) {
          throw new Error("Failed to fetch global data");
        }

        const data = await response.json();

        setGlobalData(data);
      } catch (err) {
        console.error("Error fetching global data:", err);
        setError("Failed to fetch global data");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchGlobalData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const statsData: StatData[] = useMemo(() => {
    if (!globalData?.data) return [];

    const { data } = globalData;
    const marketCapChange = data.market_cap_change_percentage_24h_usd;

    return [
      {
        title: "Total Market Cap",
        value: formatPrice(data.total_market_cap.usd),
        change: marketCapChange,
        isPositive: marketCapChange >= 0,
      },
      {
        title: "24h Trading Volume",
        value: formatPrice(data.total_volume.usd),
        isPositive: true,
      },
      {
        title: "Active Cryptocurrencies",
        value: data.active_cryptocurrencies.toLocaleString(),
      },
      {
        title: "Active Markets",
        value: data.markets.toLocaleString(),
      },
    ];
  }, [globalData]);

  const statsCards = useMemo(() => statsData.map((stat, index) => <StatCard key={`stat-${index}`} {...stat} />), [statsData]);

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium text-white">Tokens</h2>
        <div className="relative rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              <span className="text-white">Loading global data...</span>
            </div>
          </div>
        </div>
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => window.location.reload()}>
                  <Icon className="w-4 h-4 inline mr-2" icon="mdi:refresh" />
                  Retry
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setGlobalData(null);
                    setLoading(true);
                    setError(null);
                  }}>
                  <Icon className="w-4 h-4 inline mr-2" icon="mdi:reload" />
                  Reset
                </button>
              </div>
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
