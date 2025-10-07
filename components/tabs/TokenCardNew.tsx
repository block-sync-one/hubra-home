"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, cn, Chip } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

interface TokenCardNewProps {
  name: string;
  symbol?: string;
  imgUrl?: string;
  price?: string;
  change?: number;
  volume?: string;
  coinId?: string;
  className?: string;
}

// Hook to fetch price history for mini charts
const usePriceHistory = (coinId: string) => {
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: number; price: number }> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/crypto/price-history?id=${coinId}&days=7`);
        const result = await response.json();

        setPriceHistory(result.data || []);
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

// Transform price history for mini chart - use actual data
const transformPriceData = (priceHistory: Array<{ timestamp: number; price: number }> | null, currentPrice: number, change: number) => {
  // Always use real price history data if available
  if (priceHistory && priceHistory.length > 0) {
    // Use all data points for accurate chart representation
    return priceHistory.map((item) => ({ value: item.price }));
  }

  // Fallback only when no data: generate trend based on change
  const data = [];
  const startPrice = currentPrice / (1 + change / 100);

  for (let i = 0; i < 7; i++) {
    const progress = i / 6;
    const trendValue = startPrice + (currentPrice - startPrice) * progress;
    const noise = (Math.random() - 0.5) * currentPrice * 0.02;

    data.push({ value: trendValue + noise });
  }

  return data;
};

export function TokenCardNew({ name, symbol, imgUrl, price, change, volume, coinId }: TokenCardNewProps) {
  const router = useRouter();
  const { priceHistory } = usePriceHistory(coinId || "");

  const handleClick = () => {
    if (coinId) {
      router.push(`/tokens/${coinId}`);
    }
  };

  const chartData = transformPriceData(priceHistory, parsePrice(price), change || 0);
  const isPositive = (change || 0) >= 0;
  const color = isPositive ? "success" : "danger";

  return (
    <Card
      isPressable
      className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
      onClick={handleClick}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <Image alt={name} className="w-full h-full object-cover" height={20} src={imgUrl || "/logo.svg"} width={20} />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            <p className="text-sm text-gray-400">{symbol}</p>
          </div>
        </div>

        {/* Price and Change */}
        <div className="flex items-center gap-2 mb-4">
          <p className="text-lg font-semibold text-white">{price}</p>
          {change !== undefined && (
            <Chip
              className={cn("h-6", {
                "border-success-500/20 bg-success-500/10": isPositive,
                "border-danger-500/20 bg-danger-500/10": !isPositive,
              })}
              size="sm"
              startContent={
                <Icon
                  className={cn("text-sm", {
                    "text-success-500": isPositive,
                    "text-danger-500": !isPositive,
                  })}
                  icon={isPositive ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                />
              }
              variant="bordered">
              <span
                className={cn("text-xs font-semibold", {
                  "text-success-500": isPositive,
                  "text-danger-500": !isPositive,
                })}>
                {Math.abs(change).toFixed(2)}%
              </span>
            </Chip>
          )}
        </div>

        {/* Mini Chart */}
        <div className="h-14 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`mini-gradient-${coinId}-${color}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Area
                dataKey="value"
                fill={`url(#mini-gradient-${coinId}-${color})`}
                stroke={color === "success" ? "rgb(21 183 158)" : "rgb(246 61 104)"}
                strokeWidth={1.5}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
