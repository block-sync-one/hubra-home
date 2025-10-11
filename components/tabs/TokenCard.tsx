"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, cn, Chip } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import {
  CHART_TIME_PERIODS,
  CHART_DIMENSIONS,
  CHART_DATA_POINTS,
  CHART_COLORS,
  GRADIENT_OPACITY,
  CHART_STROKE,
  CHART_MARGINS,
  PRICE_CHANGE,
  COMPONENT_SIZES,
} from "@/lib/constants";
import { useCurrentToken } from "@/lib/context/current-token-context";
import { usePrefetch } from "@/lib/hooks/usePrefetch";

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

// Hook to fetch price history for mini charts
const usePriceHistory = (coinId: string) => {
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: number; price: number }> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/crypto/price-history?id=${coinId}&days=${CHART_TIME_PERIODS.ONE_WEEK}`);
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
  const startPrice = currentPrice / (1 + change / PRICE_CHANGE.PERCENTAGE_DIVISOR);

  for (let i = 0; i < CHART_DATA_POINTS.FALLBACK_POINTS; i++) {
    const progress = i / CHART_DATA_POINTS.FALLBACK_MAX_INDEX;
    const trendValue = startPrice + (currentPrice - startPrice) * progress;
    const noise = (Math.random() - 0.5) * currentPrice * PRICE_CHANGE.NOISE_MULTIPLIER;

    data.push({ value: trendValue + noise });
  }

  return data;
};

export function TokenCard({ name, symbol, imgUrl, price, change, volume, coinId }: TokenCardProps) {
  const router = useRouter();
  const { priceHistory } = usePriceHistory(coinId || "");
  const { setCurrentToken } = useCurrentToken();

  // Prefetch token details on hover for instant navigation
  const { onMouseEnter } = usePrefetch({
    tokenAddress: coinId || "",
    tokenName: name,
    immediate: false, // Don't prefetch immediately
    onHover: true, // Prefetch on hover
  });

  const handleClick = () => {
    // Store token data in context before navigation
    setCurrentToken({
      id: coinId || "",
      name: name,
      symbol: symbol || "",
      imgUrl: imgUrl,
      price: price || "0",
      change: change || 0,
      volume: "N/A", // Not available in TokenCard
      rawVolume: 0,
      marketCap: 0,
    });

    // Navigate with token address directly
    router.push(`/tokens/${coinId}`);
  };

  const chartData = transformPriceData(priceHistory, parsePrice(price), change || 0);
  const isPositive = (change || 0) >= 0;
  const color = isPositive ? "success" : "danger";

  return (
    <Card
      isPressable
      className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <Image
              alt={name}
              className="w-full h-full object-cover"
              height={CHART_DIMENSIONS.TOKEN_ICON_HEIGHT}
              src={imgUrl || "/logo.svg"}
              width={CHART_DIMENSIONS.TOKEN_ICON_WIDTH}
            />
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
              size={COMPONENT_SIZES.CHIP_SIZE}
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
                {Math.abs(change).toFixed(PRICE_CHANGE.DECIMAL_PLACES)}%
              </span>
            </Chip>
          )}
        </div>

        {/* Mini Chart */}
        <div className="h-14 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: CHART_MARGINS.TOP,
                right: CHART_MARGINS.RIGHT,
                left: CHART_MARGINS.LEFT,
                bottom: CHART_MARGINS.BOTTOM,
              }}>
              <defs>
                <linearGradient id={`mini-gradient-${coinId}-${color}`} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={color === "success" ? CHART_COLORS.SUCCESS : CHART_COLORS.DANGER}
                    stopOpacity={GRADIENT_OPACITY.START}
                  />
                  <stop
                    offset="100%"
                    stopColor={color === "success" ? CHART_COLORS.SUCCESS : CHART_COLORS.DANGER}
                    stopOpacity={GRADIENT_OPACITY.END}
                  />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Area
                dataKey="value"
                fill={`url(#mini-gradient-${coinId}-${color})`}
                stroke={color === "success" ? CHART_COLORS.SUCCESS : CHART_COLORS.DANGER}
                strokeWidth={CHART_STROKE.WIDTH}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
