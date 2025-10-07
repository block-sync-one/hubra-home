import { useState, useEffect } from "react";

/**
 * Interface for Birdeye OHLCV data point
 *
 * @description Represents a single OHLCV data point from Birdeye API
 *
 * @interface BirdeyeOHLCVPoint
 * @since 2.0.0
 */
export interface BirdeyeOHLCVPoint {
  /** Timestamp in milliseconds */
  timestamp: number;
  /** Close price */
  price: number;
  /** Open price */
  open: number;
  /** High price */
  high: number;
  /** Low price */
  low: number;
  /** Volume */
  volume: number;
}

/**
 * Interface for Birdeye price history response
 *
 * @description Represents the complete price history data from Birdeye API
 *
 * @interface BirdeyePriceHistoryData
 * @since 2.0.0
 */
export interface BirdeyePriceHistoryData {
  /** Array of OHLCV data points */
  data: BirdeyeOHLCVPoint[];
  /** Success status */
  success: boolean;
  /** Token address */
  tokenAddress?: string;
  /** Time range information */
  timeRange?: {
    from: number;
    to: number;
    type: string;
  };
}

/**
 * Custom hook to fetch price history data for a given token and time period
 *
 * @description Fetches historical OHLCV data from Birdeye API based on token address and time period.
 * Transforms the data into a format suitable for Recharts visualization.
 *
 * @param tokenId - The Solana token address (e.g., 'So11111111111111111111111111111111111111112')
 * @param days - Number of days or 'max' for the time period
 * @returns Object containing chart data, loading state, error state, and retry function
 *
 * @example
 * ```typescript
 * const { chartData, loading, error, retry } = usePriceHistory('So11111111111111111111111111111111111111112', 1);
 *
 * if (loading) return <div>Loading chart...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <LineChart data={chartData} />;
 * ```
 *
 * @throws {Error} When API request fails or data transformation fails
 * @since 2.0.0
 * @version 2.0.0
 * @see {@link /api/crypto/price-history}
 */
export function usePriceHistory(tokenId: string, days: number | "max") {
  const [chartData, setChartData] = useState<Array<{ month: string; price: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);

  const fetchPriceHistory = async () => {
    if (!tokenId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crypto/price-history?id=${tokenId}&days=${days === "max" ? "max" : days}`);
      const result: BirdeyePriceHistoryData = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Failed to fetch price history");
      }

      // Check if we're using fallback data
      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      // Transform the Birdeye data for the chart
      const transformedData = transformBirdeyeData(result.data || [], days);

      console.log(`Price history for ${tokenId} (${days} days):`, {
        rawDataPoints: result.data?.length || 0,
        transformedDataPoints: transformedData.length,
        firstPoint: transformedData[0],
        lastPoint: transformedData[transformedData.length - 1],
        timeRange: result.timeRange,
      });

      setChartData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch price history";

      setError(errorMessage);
      console.error("Price history fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError(null);
    fetchPriceHistory();
  };

  useEffect(() => {
    fetchPriceHistory();
  }, [tokenId, days]);

  return {
    chartData,
    loading,
    error,
    retry,
    isFallbackData,
  };
}

/**
 * Transforms Birdeye OHLCV data into chart format
 *
 * @description Converts Birdeye OHLCV data into Recharts-compatible format
 * with proper date formatting for optimal chart display.
 *
 * @param data - OHLCV data from Birdeye API
 * @param days - Number of days or 'max' for the time period
 * @returns Transformed data array for chart display
 *
 * @example
 * ```typescript
 * const rawData = [
 *   { timestamp: 1640995200000, price: 47000, open: 46500, high: 47500, low: 46000, volume: 1000 },
 *   { timestamp: 1641081600000, price: 48000, open: 47000, high: 48500, low: 47000, volume: 1200 }
 * ];
 * const chartData = transformBirdeyeData(rawData, 1);
 * // Returns: [{ month: "15:00", price: 47000 }, { month: "11:00", price: 48000 }]
 * ```
 */
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
