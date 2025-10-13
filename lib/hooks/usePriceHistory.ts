import { useState, useEffect, useCallback } from "react";

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
 * Fetches price history data for a token
 * @param tokenId - Token address
 * @param days - Number of days (1, 7, 30, 90, 365, or "max")
 */
export function usePriceHistory(tokenId: string, days: number | "max") {
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

      // Check if we're using fallback data
      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      // Transform the Birdeye data for the chart
      const transformedData = transformBirdeyeData(result.data || [], days);

      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch price history";

      setError(errorMessage);

      // Set empty chart data on error
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [tokenId, days]);

  const retry = useCallback(() => {
    setError(null);
    fetchPriceHistory();
  }, [fetchPriceHistory]);

  useEffect(() => {
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
  if (!data || data.length === 0) {
    return [];
  }

  // Format dates based on time period
  const formatDate = (timestamp: number, period: number | "max", index: number, totalPoints: number) => {
    const date = new Date(timestamp);

    if (period === 1) {
      // 24h: Show time (e.g., 15:00, 16:00, 17:00)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (period === 7) {
      // 7d: Show day + time (e.g., Mon 15:00, Tue 09:00)
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return `${day} ${time}`;
    } else if (period === 30) {
      // 1M: Show date (e.g., Oct 1, Oct 2)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (period === 90) {
      // 3M: Show date (e.g., Oct 1, Oct 15, Nov 1)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else if (period === 365) {
      // 1Y: Show month + year (e.g., Jan 2024, Feb 2024)
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else {
      // All: Show month + year (e.g., Jan 2024, Jun 2024)
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  };

  // Return all data points for accurate chart visualization
  // No sampling needed - Birdeye already returns optimized data
  return data.map((item, index) => ({
    month: formatDate(item.timestamp, days, index, data.length),
    price: item.price,
  }));
}
