"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";

import {
  CHART_TIME_PERIODS,
  CHART_DATA_POINTS,
  CHART_COLORS,
  GRADIENT_OPACITY,
  CHART_STROKE,
  CHART_MARGINS,
  PRICE_CHANGE,
} from "@/lib/constants";
import { seededRandom } from "@/lib/utils/random";
import { PriceChangeChip } from "@/components/price";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

interface TokenCardProps {
  name: string;
  symbol?: string;
  logoURI?: string;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
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
const transformPriceData = (
  priceHistory: Array<{ timestamp: number; price: number }> | null,
  currentPrice: number,
  change: number,
  coinId: string
) => {
  // Always use real price history data if available
  if (priceHistory && priceHistory.length > 0) {
    // Use all data points for accurate chart representation
    return priceHistory.map((item) => ({ value: item.price }));
  }

  // Fallback only when no data: generate trend based on change with deterministic randomness
  const data = [];
  const startPrice = currentPrice / (1 + change / PRICE_CHANGE.PERCENTAGE_DIVISOR);

  for (let i = 0; i < CHART_DATA_POINTS.FALLBACK_POINTS; i++) {
    const progress = i / CHART_DATA_POINTS.FALLBACK_MAX_INDEX;
    const trendValue = startPrice + (currentPrice - startPrice) * progress;
    const noise = (seededRandom(coinId, i) - 0.5) * currentPrice * PRICE_CHANGE.NOISE_MULTIPLIER;

    data.push({ value: trendValue + noise });
  }

  return data;
};

export function TokenCard({ name, symbol, logoURI, price, change, coinId }: TokenCardProps) {
  const router = useRouter();
  const { priceHistory } = usePriceHistory(coinId || "");

  const handleClick = () => {
    router.push(`/tokens/${coinId}`);
  };

  const handleHover = () => {
    if (coinId) {
      router.prefetch(`/tokens/${coinId}`);
    }
  };

  const chartData = transformPriceData(priceHistory, parsePrice(price), change || 0, coinId || "");
  const isPositive = (change || 0) >= 0;
  const color = isPositive ? "success" : "danger";

  return (
    <Card
      isPressable
      aria-label={`View ${name} details`}
      className="bg-card backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e: any) => e.key === "Enter" && handleClick()}
      onMouseEnter={handleHover}
      onPress={handleClick}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
            <ImageWithSkeleton
              alt={`${name} (${symbol}) logo`}
              className="w-full h-full object-cover"
              height={36}
              src={logoURI || ""}
              width={36}
            />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{name}</p>
            <p className="text-sm text-gray-400">{symbol}</p>
          </div>
        </div>

        {/* Price and Change */}
        <div className="flex items-center mb-2">
          <p className="text-lg font-semibold text-white">{price}</p>
          <PriceChangeChip changePercent={change ?? 0} className={"bg-transparent"} />
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
