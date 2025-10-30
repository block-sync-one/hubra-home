import { useState, useEffect, useCallback } from "react";

import { setClientCache } from "@/lib/cache/client-cache";

export interface BirdeyeOHLCVPoint {
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface BirdeyePriceHistoryData {
  data: BirdeyeOHLCVPoint[];
  success: boolean;
  tokenAddress?: string;
  timeRange?: {
    from: number;
    to: number;
    type: string;
  };
}

/**
 * Fetches price history data for a token with client-side caching
 * @param tokenId - Token address
 * @param days - Number of days (1, 7, 30, 90, 365, or "max")
 */
export function usePriceHistory(tokenId: string, days: number | "max" = 7) {
  const [chartData, setChartData] = useState<Array<{ month: string; price: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);

  const fetchPriceHistory = useCallback(async () => {
    if (!tokenId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crypto/price-history?id=${tokenId}&days=${days === "max" ? "max" : days}`);

      const result: BirdeyePriceHistoryData = await response.json();

      if (!response.ok) {
        const errorMsg = (result as any).error || `HTTP ${response.status}: Failed to fetch price history`;

        throw new Error(errorMsg);
      }

      if (!result.success) {
        const errorMsg = (result as any).error || "API returned success: false";

        throw new Error(errorMsg);
      }

      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      const transformedData = transformBirdeyeData(result.data || [], days);

      const cacheKey = `price-history:${tokenId}:${days}`;

      setClientCache(cacheKey, transformedData);

      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch price history";

      setError(errorMessage);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [tokenId, days]);

  const retry = useCallback(() => {
    setError(null);
    setChartData([]);
    fetchPriceHistory();
  }, [fetchPriceHistory]);

  useEffect(() => {
    setChartData([]);
    fetchPriceHistory();
  }, [fetchPriceHistory]);

  return {
    chartData,
    loading,
    error,
    retry,
    isFallbackData,
  };
}

function transformBirdeyeData(data: BirdeyeOHLCVPoint[], days: number | "max"): Array<{ month: string; price: number }> {
  if (!data || data.length === 0) return [];

  const formatDate = (timestamp: number, period: number | "max", _index: number, _totalPoints: number) => {
    const date = new Date(timestamp);

    if (period === 1) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    } else if (period === 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (period === 30) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (period === 90) {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (period === 365) {
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  };

  const sampleSize = getSampleSize(days);
  const sampledData = sampleSize >= data.length ? data : sampleEvenly(data, sampleSize);

  return sampledData.map((item, index) => ({
    month: formatDate(item.timestamp, days, index, sampledData.length),
    price: item.price,
  }));
}

function getSampleSize(period: number | "max"): number {
  if (period === 1) return 24;
  if (period === 7) return 7;
  if (period === 30) return 15;
  if (period === 90) return 18;
  if (period === 365) return 24;

  return 30;
}

function sampleEvenly(data: BirdeyeOHLCVPoint[], targetSize: number): BirdeyeOHLCVPoint[] {
  if (data.length <= targetSize) return data;

  const sampled: BirdeyeOHLCVPoint[] = [];
  const step = data.length / targetSize;

  for (let i = 0; i < targetSize; i++) {
    const index = Math.floor(i * step);

    sampled.push(data[index]);
  }

  sampled[sampled.length - 1] = data[data.length - 1];

  return sampled;
}
