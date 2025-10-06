import { useState, useEffect } from "react";

/**
 * Interface for detailed token information
 *
 * @description Represents comprehensive token data including market metrics,
 * rankings, scores, and metadata from CoinGecko API.
 *
 * @interface TokenData
 * @since 1.0.0
 */
export interface TokenData {
  /** Unique identifier for the token */
  id: string;
  /** Full name of the token */
  name: string;
  /** Token symbol (uppercase) */
  symbol: string;
  /** Token image URLs */
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  /** Current market data */
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
    high_24h: { usd: number };
    low_24h: { usd: number };
  };
  /** Market cap ranking */
  market_cap_rank: number;
  /** CoinGecko ranking */
  coingecko_rank: number;
  /** CoinGecko score */
  coingecko_score: number;
  /** Developer score */
  developer_score: number;
  /** Community score */
  community_score: number;
  /** Liquidity score */
  liquidity_score: number;
  /** Public interest score */
  public_interest_score: number;
  /** Token description */
  description: string;
  /** External links */
  links: Record<string, any>;
  /** Token categories */
  categories: string[];
  /** Last updated timestamp */
  last_updated: string;
}

/**
 * Custom hook to fetch detailed token data by name
 *
 * @description Fetches comprehensive token information from the CoinGecko API
 * including current prices, market data, rankings, and metadata.
 *
 * @param tokenName - The name of the token to fetch (URL-friendly format)
 * @returns Object containing token data, loading state, error state, and retry function
 *
 * @example
 * ```typescript
 * const { tokenData, loading, error, retry, isFallbackData } = useTokenData('bitcoin');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return (
 *   <div>
 *     <h1>{tokenData.name}</h1>
 *     <p>Price: ${tokenData.market_data.current_price.usd}</p>
 *   </div>
 * );
 * ```
 *
 * @throws {Error} When API request fails or token not found
 * @since 1.0.0
 * @version 1.0.0
 * @see {@link /api/crypto/token/[name]}
 */
export function useTokenData(tokenName: string) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTokenData = async () => {
    if (!tokenName) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crypto/token/${tokenName}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch token data");
      }

      // Check if we're using fallback data
      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      setTokenData(data);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch token data";

      setError(errorMessage);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setError(null);
    setRetryCount(0);
    fetchTokenData();
  };

  useEffect(() => {
    fetchTokenData();
  }, [tokenName]);

  return {
    tokenData,
    loading,
    error,
    retry,
    isFallbackData,
    retryCount,
  };
}
