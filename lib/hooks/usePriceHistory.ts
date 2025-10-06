import { useState, useEffect } from "react";

/**
 * Interface for price history data point
 *
 * @description Represents a single price data point with timestamp and price value
 *
 * @interface PriceHistoryPoint
 * @since 1.0.0
 */
export interface PriceHistoryPoint {
  /** Timestamp in milliseconds */
  timestamp: number;
  /** Price value at this timestamp */
  price: number;
}

/**
 * Interface for price history response
 *
 * @description Represents the complete price history data from CoinGecko API
 *
 * @interface PriceHistoryData
 * @since 1.0.0
 */
export interface PriceHistoryData {
  /** Array of price data points */
  prices: PriceHistoryPoint[];
  /** Market cap data points */
  market_caps: Array<[number, number]>;
  /** Total volume data points */
  total_volumes: Array<[number, number]>;
}

/**
 * Custom hook to fetch price history data for a given token and time period
 *
 * @description Fetches historical price data from CoinGecko API based on token ID and time period.
 * Transforms the data into a format suitable for Recharts visualization.
 *
 * @param tokenId - The CoinGecko token ID (e.g., 'bitcoin', 'ethereum')
 * @param days - Number of days or 'max' for the time period
 * @returns Object containing chart data, loading state, error state, and retry function
 *
 * @example
 * ```typescript
 * const { chartData, loading, error, retry } = usePriceHistory('bitcoin', 1);
 *
 * if (loading) return <div>Loading chart...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <LineChart data={chartData} />;
 * ```
 *
 * @throws {Error} When API request fails or data transformation fails
 * @since 1.0.0
 * @version 1.0.0
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch price history");
      }

      // Check if we're using fallback data
      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      // Transform the data for the chart
      const transformedData = transformPriceData(data.prices || [], days);

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
 * Transforms raw price history data into chart format with backward calculation
 *
 * @description Converts CoinGecko price history format into Recharts-compatible format
 * with proper date formatting and data sampling for optimal chart display.
 *
 * @param prices - Raw price data from CoinGecko API
 * @param days - Number of days or 'max' for the time period
 * @returns Transformed data array for chart display
 *
 * @example
 * ```typescript
 * const rawData = [[1640995200000, 47000], [1641081600000, 48000]];
 * const chartData = transformPriceData(rawData, 1);
 * // Returns: [{ month: "15:00", price: 47000 }, { month: "11:00", price: 48000 }]
 * ```
 */
function transformPriceData(prices: Array<[number, number]>, days: number | "max"): Array<{ month: string; price: number }> {
  if (!prices || prices.length === 0) {
    return [];
  }

  // Format dates based on time period with backward calculation from current time
  const formatDate = (timestamp: number, period: number | "max") => {
    const date = new Date(timestamp);
    const now = new Date();

    if (period === 1) {
      // 24h: Show actual time (e.g., 15:00, 11:00, 07:00, 03:00, 23:00)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (period === 7) {
      // 7d: Show day names (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
      return date.toLocaleDateString("en-US", {
        weekday: "short",
      });
    } else if (period === 30) {
      // 1M: Show day of month (1, 2, 3, 4, 5, etc.)
      return date.getDate().toString();
    } else if (period === 90) {
      // 3M: Show week numbers (W1, W2, W3, W4, etc.)
      const weekNumber = Math.ceil(date.getDate() / 7);

      return `W${weekNumber}`;
    } else if (period === 365) {
      // 1Y: Show month names (Jan, Feb, Mar, Apr, etc.)
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    } else {
      // All: Show years (2025, 2024, 2023, 2022, etc.)
      return date.getFullYear().toString();
    }
  };

  // Sample data points based on specific counts for each time period
  const baseCounts = {
    "24h": 5, // Every 4 hours
    "7d": 6, // One per day
    "1M": 7, // ~Every 4 days
    "3M": 5, // ~Every 2 weeks
    "1Y": 7, // ~Every 1.5 months
    "All": 7, // ~Every 1.5 months
  };

  // Map days to period names
  const getPeriodName = (days: number | "max"): string => {
    if (days === 1) return "24h";
    if (days === 7) return "7d";
    if (days === 30) return "1M";
    if (days === 90) return "3M";
    if (days === 365) return "1Y";
    if (days === "max") return "All";

    return "24h";
  };

  const periodName = getPeriodName(days);
  let maxPoints = baseCounts[periodName as keyof typeof baseCounts] || 5;

  // Adjust maxPoints based on actual data length to avoid over-sampling
  if (prices.length < maxPoints) {
    maxPoints = prices.length;
  }

  const step = Math.max(1, Math.floor(prices.length / maxPoints));

  return prices
    .filter((_, index) => index % step === 0)
    .map(([timestamp, price]) => ({
      month: formatDate(timestamp, days),
      price: price,
    }));
}
