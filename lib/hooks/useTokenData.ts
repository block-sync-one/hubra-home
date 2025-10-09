import { useState, useEffect, useCallback } from "react";

/**
 * Interface for detailed token information from Birdeye API
 *
 * @description Represents comprehensive Solana token data including market metrics,
 * trading data, and metadata from Birdeye API.
 *
 * @interface TokenData
 * @since 2.0.0
 */
export interface TokenData {
  /** Solana token address (unique identifier) */
  id: string;
  address: string;
  /** Token symbol (uppercase) */
  symbol: string;
  /** Full name of the token */
  name: string;
  /** Token logo URI */
  logo_uri: string;

  /** Current price in USD */
  price: number;
  /** 24h price change in USD */
  price_change_24h: number;
  /** 24h price change percentage */
  price_change_24h_percent: number;

  /** Market cap in USD */
  market_cap: number;
  /** 24h trading volume in USD */
  volume_24h: number;
  /** Total liquidity in USD */
  liquidity: number;
  /** Number of token holders */
  holder: number;

  /** 24h high price */
  high_24h: number;
  /** 24h low price */
  low_24h: number;

  /** Circulating supply */
  circulating_supply: number;
  /** Total supply */
  total_supply: number;

  /** Token decimals */
  decimals: number;
  /** Token extensions (website, social links, etc.) */
  extensions: Record<string, any>;

  /** 24h buy volume (null if not available) */
  buy_volume_24h: number | null;
  /** 24h sell volume (null if not available) */
  sell_volume_24h: number | null;
  /** Buy volume percentage (null if not available) */
  buy_volume_percent: number | null;
  /** Sell volume percentage (null if not available) */
  sell_volume_percent: number | null;
  /** 24h trade count */
  trade_count_24h: number;

  /** Blockchain network */
  chain: string;

  /** Last updated timestamp */
  last_updated: string;
}

/**
 * Custom hook to fetch detailed Solana token data
 *
 * @description Fetches comprehensive token information from the Birdeye API
 * including current prices, market data, liquidity, and trading metrics.
 *
 * @param tokenName - The Solana token address or common name (e.g., 'solana', 'usdc')
 * @returns Object containing token data, loading state, error state, and retry function
 *
 * @example
 * ```typescript
 * const { tokenData, loading, error, retry, isFallbackData } = useTokenData('So11111111111111111111111111111111111111112');
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return (
 *   <div>
 *     <h1>{tokenData.name}</h1>
 *     <p>Price: ${tokenData.price}</p>
 *   </div>
 * );
 * ```
 *
 * @throws {Error} When API request fails or token not found
 * @since 2.0.0
 * @version 2.0.0
 * @see {@link /api/crypto/token/[name]}
 */
export function useTokenData(tokenName: string) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchTokenData = useCallback(async () => {
    if (!tokenName) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/crypto/token/${tokenName}`, {
        cache: "no-store", // Disable browser cache
      });
      const data = await response.json();

      console.log("Token data received:", {
        name: data.name,
        symbol: data.symbol,
        price: data.price,
        isFallback: response.headers.get("X-Fallback-Data"),
      });

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
      setIsFallbackData(false); // Reset fallback flag on error
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [tokenName]);

  const retry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    fetchTokenData();
  }, [fetchTokenData]);

  useEffect(() => {
    fetchTokenData();
  }, [fetchTokenData]);

  return {
    tokenData,
    loading,
    error,
    retry,
    isFallbackData,
    retryCount,
  };
}
