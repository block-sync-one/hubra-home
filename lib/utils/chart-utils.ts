/**
 * Utility functions for chart timestamp calculations
 */

export interface BirdeyeChartData {
  data: {
    items: Array<{
      address: string;
      c: number; // close
      h: number; // high
      l: number; // low
      o: number; // open
      type: string;
      unixTime: number;
      v: number; // volume
      currency: string;
    }>;
    isScaledUiToken: boolean;
    multiplier: any;
  };
  success: boolean;
}

export interface TimeRangeConfig {
  type: string;
  timeFrom: number;
  timeTo: number;
}

/**
 * Calculate time range for Birdeye API based on selected range
 * @param range - The selected time range (24H, 1W, 1M, 3M, ALL)
 * @returns Object with type, timeFrom, and timeTo for Birdeye API
 */
export function calculateTimeRange(range: string): TimeRangeConfig {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  switch (range) {
    case "24H":
      return {
        type: "1H",
        timeFrom: now - 24 * 60 * 60, // 24 hours ago
        timeTo: now,
      };
    case "1W":
      return {
        type: "1D",
        timeFrom: now - 7 * 24 * 60 * 60, // 7 days ago
        timeTo: now,
      };
    case "1M":
      return {
        type: "1D",
        timeFrom: now - 30 * 24 * 60 * 60, // 30 days ago
        timeTo: now,
      };
    case "3M":
      return {
        type: "1D",
        timeFrom: now - 90 * 24 * 60 * 60, // 90 days ago
        timeTo: now,
      };
    case "ALL":
      // For ALL, we'll use a reasonable default of 1 year
      return {
        type: "1D",
        timeFrom: now - 365 * 24 * 60 * 60, // 1 year ago
        timeTo: now,
      };
    default:
      return {
        type: "1H",
        timeFrom: now - 24 * 60 * 60, // Default to 24H
        timeTo: now,
      };
  }
}

/**
 * Transform Birdeye chart data to match the expected format
 * @param chartData - Raw Birdeye API response
 * @param range - Selected time range for label formatting
 * @returns Transformed data with labels, values, and timestamps
 */
export function transformBirdeyeChartData(
  chartData: BirdeyeChartData,
  range: string
): {
  labels: string[];
  values: number[];
  timestamps: number[];
} {
  const labels: string[] = [];
  const values: number[] = [];
  const timestamps: number[] = [];

  chartData.data.items.forEach((item) => {
    // Use close price (c) for the chart value
    labels.push(formatLabel(item.unixTime * 1000, range)); // Convert to milliseconds
    values.push(item.c);
    timestamps.push(item.unixTime * 1000); // Convert to milliseconds
  });

  return { labels, values, timestamps };
}

/**
 * Format timestamp for display based on selected range
 * @param timestamp - Timestamp in milliseconds
 * @param range - Selected time range
 * @returns Formatted label string
 */
function formatLabel(timestamp: number, range: string): string {
  const date = new Date(timestamp);

  switch (range) {
    case "24H":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    case "1W":
      return date.toLocaleDateString("en-US", { weekday: "short" });
    case "1M":
      return date.getDate().toString();
    case "3M":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "ALL":
      return date.toLocaleDateString("en-US", { month: "short" });
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
  }
}

/**
 * Calculate price change percentage from chart data
 * @param values - Array of price values
 * @returns Price change percentage
 */
export function calculatePriceChange(values: number[]): number {
  if (values.length < 2) return 0;

  const firstPrice = values[0];
  const lastPrice = values[values.length - 1];

  if (firstPrice === 0) return 0;

  return ((lastPrice - firstPrice) / Math.abs(firstPrice)) * 100;
}
