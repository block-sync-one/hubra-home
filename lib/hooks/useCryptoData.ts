import { useState, useEffect } from "react";

import { formatBigNumbers } from "../utils";
import { useCurrency } from "../context/currency-format";

/**
 * Comprehensive cryptocurrency market data interface
 *
 * @description Represents detailed market information for a single cryptocurrency
 * including current prices, market metrics, historical data, and supply information.
 *
 * @interface CryptoData
 * @since 1.0.0
 */
export interface CryptoData {
  /** Unique identifier for the cryptocurrency */
  id: string;
  /** Cryptocurrency symbol (e.g., 'btc', 'eth') */
  symbol: string;
  /** Full name of the cryptocurrency */
  name: string;
  /** URL to the cryptocurrency's image/logo */
  image: string;
  /** Current price in the target currency */
  current_price: number;
  /** Total market capitalization */
  market_cap: number;
  /** Market cap ranking among all cryptocurrencies */
  market_cap_rank: number;
  /** Fully diluted valuation */
  fully_diluted_valuation: number;
  /** Total 24-hour trading volume */
  total_volume: number;
  /** Highest price in the last 24 hours */
  high_24h: number;
  /** Lowest price in the last 24 hours */
  low_24h: number;
  /** Absolute price change in the last 24 hours */
  price_change_24h: number;
  /** Percentage price change in the last 24 hours */
  price_change_percentage_24h: number;
  /** Absolute market cap change in the last 24 hours */
  market_cap_change_24h: number;
  /** Percentage market cap change in the last 24 hours */
  market_cap_change_percentage_24h: number;
  /** Current circulating supply */
  circulating_supply: number;
  /** Total supply of the cryptocurrency */
  total_supply: number;
  /** Maximum supply (if applicable) */
  max_supply: number;
  /** All-time high price */
  ath: number;
  /** Percentage change from all-time high */
  ath_change_percentage: number;
  /** Date of all-time high */
  ath_date: string;
  /** All-time low price */
  atl: number;
  /** Percentage change from all-time low */
  atl_change_percentage: number;
  /** Date of all-time low */
  atl_date: string;
  /** Return on investment data */
  roi: any;
  /** Last updated timestamp */
  last_updated: string;
}

/**
 * Trending cryptocurrency data interface
 *
 * @description Represents a cryptocurrency that is currently trending
 * based on search volume, social media mentions, and market activity.
 *
 * @interface TrendingCoin
 * @since 1.0.0
 */
export interface TrendingCoin {
  /** Unique identifier for the cryptocurrency */
  id: string;
  /** CoinGecko coin ID */
  coin_id: number;
  /** Full name of the cryptocurrency */
  name: string;
  /** Cryptocurrency symbol */
  symbol: string;
  /** Market capitalization ranking */
  market_cap_rank: number;
  /** URL to thumbnail image */
  thumb: string;
  /** URL to small image */
  small: string;
  /** URL to large image */
  large: string;
  /** URL slug for the cryptocurrency */
  slug: string;
  /** Price in Bitcoin */
  price_btc: number;
  /** Trending score (higher = more trending) */
  score: number;
}

/**
 * Trending data response interface
 *
 * @description Contains an array of trending cryptocurrencies
 * wrapped in a coins property for API consistency.
 *
 * @interface TrendingData
 * @since 1.0.0
 */
export interface TrendingData {
  /** Array of trending cryptocurrency items */
  coins: Array<{
    item: TrendingCoin;
  }>;
  /** Array of trending exchanges (if available) */
  exchanges: any[];
}

/**
 * Simplified cryptocurrency token interface for UI display
 *
 * @description Represents a cryptocurrency token with essential information
 * formatted for display in the application UI components.
 *
 * @interface HotToken
 * @since 1.0.0
 */
export interface HotToken {
  /** Unique identifier for the cryptocurrency */
  id: string;
  /** Full name of the cryptocurrency */
  name: string;
  /** Cryptocurrency symbol (uppercase) */
  symbol: string;
  /** Current price formatted as string */
  price: string;
  /** 24-hour price change percentage */
  change: number;
  /** 24-hour trading volume formatted as string */
  volume: string;
  /** URL to the cryptocurrency's image */
  imgUrl: string;
  /** Market capitalization formatted as string */
  marketCap: string;
  /** Market cap ranking */
  rank: number;
}

/**
 * Custom React hook for fetching and managing cryptocurrency data
 *
 * @description Provides real-time cryptocurrency data including hot tokens,
 * trending coins, gainers, losers, and volume leaders. Includes comprehensive
 * error handling, fallback data support, and automatic refresh functionality.
 *
 * @returns {Object} Hook return object containing data and state
 * @returns {HotToken[]} hotTokens - Array of hot/trending cryptocurrencies
 * @returns {HotToken[]} trending - Array of currently trending cryptocurrencies
 * @returns {HotToken[]} gainers - Array of cryptocurrencies with highest gains
 * @returns {HotToken[]} losers - Array of cryptocurrencies with biggest losses
 * @returns {HotToken[]} volume - Array of cryptocurrencies by trading volume
 * @returns {boolean} loading - Loading state indicator
 * @returns {string | null} error - Error message if data fetching fails
 * @returns {boolean} isFallbackData - Indicates if fallback data is being used
 * @returns {number} retryCount - Number of retry attempts made
 * @returns {Function} refetch - Function to manually refetch data
 * @returns {Function} retry - Function to retry failed requests
 *
 * @example
 * ```typescript
 * const { hotTokens, loading, error, retry } = useCryptoData();
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage onRetry={retry} />;
 *
 * return <TokenList tokens={hotTokens} />;
 * ```
 *
 * @example
 * ```typescript
 * // Handle fallback data
 * const { isFallbackData, hotTokens } = useCryptoData();
 *
 * return (
 *   <div>
 *     {isFallbackData && <FallbackWarning />}
 *     <TokenList tokens={hotTokens} />
 *   </div>
 * );
 * ```
 *
 * @since 1.0.0
 * @version 1.0.0
 */
export function useCryptoData() {
  const { formatPrice } = useCurrency();
  const [hotTokens, setHotTokens] = useState<HotToken[]>([]);
  const [trending, setTrending] = useState<HotToken[]>([]);
  const [gainers, setGainers] = useState<HotToken[]>([]);
  const [losers, setLosers] = useState<HotToken[]>([]);
  const [volume, setVolume] = useState<HotToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackData, setIsFallbackData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Transform function to convert API data to UI format
  const transformCryptoData = (data: CryptoData[]): any[] => {
    return data.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      price: formatPrice(crypto.current_price, true),
      change: fixedNumber(crypto.price_change_percentage_24h || 0),
      volume: formatBigNumbers(crypto.total_volume),
      imgUrl: crypto.image,
      marketCap: formatBigNumbers(crypto.market_cap),
      rank: crypto.market_cap_rank,
    }));
  };

  // Transform trending data to UI format
  const transformTrendingData = (coins: any[]): any[] => {
    return coins.map((coin: any) => {
      const item = coin.item || coin;
      const data = item.data || {};

      return {
        id: item.id || item.coin_id,
        name: item.name,
        symbol: (item.symbol || "").toUpperCase(),
        price: formatPrice(data.price || 0, true),
        change: fixedNumber(data.price_change_percentage_24h?.usd || 0),
        volume: data.total_volume || "N/A",
        imgUrl: item.large || item.thumb || item.small || "",
        marketCap: data.market_cap || "N/A",
        rank: item.market_cap_rank || 0,
      };
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsFallbackData(false);

      // Fetch top 100 cryptocurrencies from API route
      const response = await fetch("/api/crypto/markets?limit=100");

      if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status}`);
      }
      const topCryptos = await response.json();

      // Check if we received fallback data
      const isFallback = response.headers.get("X-Fallback-Data") === "true";

      setIsFallbackData(isFallback);

      if (isFallback) {
        console.warn("Using fallback data for markets");
      }

      // Transform data
      const transformedData = transformCryptoData(topCryptos);

      // Fetch trending data first (for Hot Tokens)
      let trendingTokens: any[] = [];

      try {
        const trendingResponse = await fetch("/api/crypto/trending");

        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          const isTrendingFallback = trendingResponse.headers.get("X-Fallback-Data") === "true";

          console.log("Trending data received:", trendingData);

          if (isTrendingFallback) {
            console.warn("Using fallback data for trending");
          }

          if (trendingData.coins && trendingData.coins.length > 0) {
            trendingTokens = transformTrendingData(trendingData.coins);
            console.log("Transformed trending tokens:", trendingTokens);
          } else {
            console.warn("No trending coins in response, using market data as fallback");
            trendingTokens = transformedData.slice(0, 4);
          }
        } else {
          console.warn("Trending API failed, using market data as fallback");
          trendingTokens = transformedData.slice(0, 4);
        }
      } catch (trendingError) {
        console.error("Could not fetch trending data:", trendingError);
        trendingTokens = transformedData.slice(0, 4);
      }

      // Set hot tokens (trending tokens)
      setHotTokens(trendingTokens);

      // Set trending for backward compatibility
      setTrending(trendingTokens);

      // Set gainers (top 4 with highest 24h change from all tokens)
      const gainersData = [...transformedData]
        .filter((crypto) => crypto.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 4);

      setGainers(gainersData);

      // Set losers (top 4 with lowest 24h change from all tokens)
      const losersData = [...transformedData]
        .filter((crypto) => crypto.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, 4);

      setLosers(losersData);

      // Set volume (top 4 by volume from all tokens)
      const volumeData = [...transformedData]
        .sort((a, b) => {
          const aVol = parseFloat(a.volume.replace(/[$,]/g, ""));
          const bVol = parseFloat(b.volume.replace(/[$,]/g, ""));

          return bVol - aVol;
        })
        .slice(0, 4);

      setVolume(volumeData);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError(`Failed to fetch live data: ${err instanceof Error ? err.message : "Unknown error"}`);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    setRetryCount(0);
    fetchData();
  };

  useEffect(() => {
    fetchData();

    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    hotTokens,
    trending,
    gainers,
    losers,
    volume,
    loading,
    error,
    isFallbackData,
    retryCount,
    refetch: fetchData,
    retry: retryFetch,
  };
}
/**
 * Formats a number to a fixed number of decimal places
 *
 * @param {number} num - The number to format
 * @param {number} [decimals=2] - Number of decimal places (default: 2)
 * @returns {number} The formatted number
 */
function fixedNumber(num: number, decimals: number = 2): number {
  return parseFloat(num.toFixed(decimals));
}
