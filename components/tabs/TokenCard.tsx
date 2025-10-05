"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

// Lazy load chart components
const LineChart = dynamic(() => import("recharts").then((mod) => ({ default: mod.LineChart })), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => ({ default: mod.Line })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => ({ default: mod.ResponsiveContainer })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => ({ default: mod.Tooltip })), { ssr: false });

// Hook to fetch price history for charts
const usePriceHistory = (coinId: string) => {
  const [priceHistory, setPriceHistory] = useState<number[][] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/crypto/price-history?id=${coinId}&days=7`);
        const data = await response.json();

        setPriceHistory(data.prices || []);
      } catch (error) {
        console.error("Error fetching price history:", error);
        setPriceHistory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [coinId]);

  return { priceHistory, loading };
};

// Helper function to parse price value
const parsePrice = (price: string | number | undefined): number => {
  if (typeof price === "number") return price;
  if (typeof price === "string") return parseFloat(price.replace(/[^0-9.-]/g, "")) || 0;

  return 0;
};

// Transform CoinGecko price history data for chart
const transformPriceData = (priceHistory: number[][], currentPrice: number) => {
  if (!priceHistory || priceHistory.length === 0) {
    // Fallback: generate 7 points representing 7-day trend
    const data = [];

    for (let i = 0; i < 7; i++) {
      const variation = (Math.random() - 0.5) * currentPrice * 0.05;
      const trend = (i / 6) * currentPrice * 0.02; // Slight trend over time

      data.push({
        day: i,
        value: currentPrice + variation + trend,
      });
    }

    return data;
  }

  // Take the last 7 data points or sample evenly from 7 days
  const sampleSize = Math.min(7, priceHistory.length);
  const step = Math.max(1, Math.floor(priceHistory.length / sampleSize));

  return priceHistory
    .filter((_, index) => index % step === 0)
    .slice(-sampleSize)
    .map(([timestamp, price], index) => ({
      day: index,
      value: price,
    }));
};

// Mini chart component
const MiniChart = ({ change, priceHistory, currentPrice }: { change: number; priceHistory?: number[][]; currentPrice: number }) => {
  const chartData = transformPriceData(priceHistory || [], currentPrice);
  const isPositive = change >= 0;

  return (
    <Suspense fallback={<div className="h-14 w-full bg-gray-800 animate-pulse rounded-lg" />}>
      <div className="h-14 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <Line
              dataKey="value"
              dot={false}
              stroke={isPositive ? "rgb(21 183 158)" : "rgb(246 61 104)"} // success-500 : error-500
              strokeWidth={2}
              type="monotone"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgb(31 41 55)", // bg-gray-800
                border: "1px solid rgb(55 65 81)", // border-gray-700
                borderRadius: "6px",
                color: "rgb(255 255 255)", // text-white
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "12px",
                padding: "6px 8px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
              labelFormatter={(label: string, payload: any) => {
                if (payload && payload.length > 0) {
                  const dayIndex = payload[0].payload.day;
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

                  return days[dayIndex] || `Day ${dayIndex + 1}`;
                }

                return "";
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Suspense>
  );
};

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;

  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-error-500",
    iconColor: isPositive ? "text-success-500" : "text-error-500",
  };
};

const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);

  return (
    <div className={`${config.bgColor} rounded-xl px-1 py-0.5 flex items-center gap-1`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} icon={config.icon} />
      <span className={`text-xs font-medium ${config.textColor}`}>{Math.abs(value)}%</span>
    </div>
  );
});

ChangeIndicator.displayName = "ChangeIndicator";

interface TokenCardProps {
  name: string;
  symbol?: string;
  imgUrl?: string;
  price?: string;
  change?: number;
  volume?: string;
  coinId?: string;
  className?: string;
}

export function TokenCard({ name, symbol, imgUrl, price, change, volume, coinId }: TokenCardProps) {
  const router = useRouter();
  const { priceHistory } = usePriceHistory(coinId || "");

  const handleClick = () => {
    if (symbol) {
      router.push(`/tokens/${symbol.toLowerCase()}`);
    }
  };

  return (
    <div
      className="backdrop-blur-[10px] bg-white/5 border border-white/10 rounded-xl p-4 min-h-[140px] flex flex-col cursor-pointer hover:bg-white/10 transition-colors"
      role="button"
      onClick={handleClick}>
      {/* Header with token info */}
      <div className="flex items-center gap-3 mb-4 pb-4 -mx-4 px-4 border-b border-white/10">
        <div className="w-5 h-5 rounded-full overflow-hidden">
          <Image alt={name} className="w-full h-full object-cover" height={20} src={imgUrl || "/logo.svg"} width={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-white truncate">{name}</h3>
        </div>
      </div>

      {/* Price and change */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-medium text-white">{price}</span>
        {change !== undefined && <ChangeIndicator value={change} />}
      </div>

      {/* Mini chart */}
      <div className="flex-1 relative">
        <MiniChart change={change || 0} currentPrice={parsePrice(price)} priceHistory={priceHistory || undefined} />
      </div>
    </div>
  );
}
