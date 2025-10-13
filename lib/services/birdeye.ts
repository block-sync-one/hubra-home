/**
 * Birdeye API Client Configuration
 *
 * @description Provides utilities and configuration for Birdeye API integration.
 * Birdeye is a real-time blockchain data provider for Solana and other chains.
 *
 * @see {@link https://docs.birdeye.so} Birdeye API Documentation
 * @since 1.0.0
 * @version 1.0.0
 */

/**
 * Birdeye API base URL
 */
export const BIRDEYE_API_BASE_URL = "https://public-api.birdeye.so";

/**
 * Supported blockchain networks
 */
export const SUPPORTED_CHAINS = {
  SOLANA: "solana",
  ETHEREUM: "ethereum",
  ARBITRUM: "arbitrum",
  AVALANCHE: "avalanche",
  BSC: "bsc",
  OPTIMISM: "optimism",
  POLYGON: "polygon",
  BASE: "base",
  ZKSYNC: "zksync",
  SUI: "sui",
} as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[keyof typeof SUPPORTED_CHAINS];

/**
 * Get Birdeye API headers
 *
 * @returns Headers object with API key and content type
 * @note Uses x-api-key header (lowercase) for authentication
 */
export function getBirdeyeHeaders(): HeadersInit {
  const apiKey = process.env.BIRDEYE_API_KEY;

  if (!apiKey) {
    console.warn("BIRDEYE_API_KEY not set - API requests will fail (401 Unauthorized)");
  }

  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(apiKey && { "x-api-key": apiKey }),
  };
}

/**
 * Build Birdeye API URL
 *
 * @param endpoint - API endpoint path
 * @param params - Query parameters
 * @returns Complete API URL with query parameters
 */
export function buildBirdeyeUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${BIRDEYE_API_BASE_URL}${endpoint}`);

  // Always add chain parameter for Solana
  const allParams = {
    ...params,
    ...(params?.chain === undefined && { chain: DEFAULT_CHAIN }),
  };

  console.log("Building Birdeye URL - All params:", allParams);

  if (allParams) {
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  const finalUrl = url.toString();

  console.log("Final Birdeye URL:", finalUrl);

  return finalUrl;
}

/**
 * Fetch data from Birdeye API
 *
 * @param endpoint - API endpoint path
 * @param params - Query parameters
 * @param options - Fetch options
 * @returns Parsed JSON response
 *
 * @throws {Error} When API request fails
 */
export async function fetchBirdeyeData<T>(endpoint: string, params?: Record<string, string>, options?: RequestInit): Promise<T> {
  const url = buildBirdeyeUrl(endpoint, params);
  const headers = getBirdeyeHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Birdeye API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  return data;
}

/**
 * Map time range to Birdeye OHLCV type
 * @note Birdeye OHLCV valid types: 1m, 3m, 5m, 15m, 30m, 1H, 2H, 4H, 6H, 8H, 12H, 1D, 3D, 1W, 1M
 * @note Type determines the candle interval, not the time range (use time_from/time_to for range)
 * @see https://docs.birdeye.so/reference/get_defi_ohlcv
 */
export function mapTimeRange(days: number | "max"): string {
  // Return candle interval based on time period for optimal data points
  if (days === "max") return "1W"; // Weekly candles for max range
  if (days === 1) return "1H"; // Hourly candles for 24h (24 points)
  if (days === 7) return "1H"; // Hourly candles for 7d (168 points)
  if (days === 30) return "4H"; // 4-hour candles for 1M (~180 points)
  if (days === 90) return "1D"; // Daily candles for 3M (90 points)
  if (days === 365) return "1W"; // Weekly candles for 1Y (52 points)

  return "1H"; // Default to hourly
}

/**
 * Default chain for API calls
 */
export const DEFAULT_CHAIN: SupportedChain = SUPPORTED_CHAINS.SOLANA;
