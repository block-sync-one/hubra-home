/**
 * Simplified useTokenData Hook
 * Clean, easy-to-understand data fetching for token tabs
 */

import type { Token } from "@/lib/types/token";

import { useState, useEffect, useCallback } from "react";

import { useCurrency } from "../context/currency-format";

import { TokenFilter } from "@/lib/helpers/token";
import { formatBigNumbers } from "@/lib/utils";
import { INTERVALS } from "@/lib/constants";

interface UseTokenDataReturn {
  hotTokens: Token[];
  gainers: Token[];
  losers: Token[];
  volume: Token[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Fetch and manage token data for all tabs
 * Fetches trending tokens and market data concurrently
 */
export function useTokenData(): UseTokenDataReturn {
  const { formatPrice } = useCurrency();

  const [hotTokens, setHotTokens] = useState<Token[]>([]);
  const [gainers, setGainers] = useState<Token[]>([]);
  const [losers, setLosers] = useState<Token[]>([]);
  const [volume, setVolume] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both endpoints concurrently for better performance
      const [trendingResponse, marketsResponse] = await Promise.all([
        fetch("/api/crypto/trending?limit=4", {
          next: { revalidate: 120 },
        }),
        fetch("/api/crypto/markets?limit=100", {
          next: { revalidate: 120 },
        }),
      ]);

      if (!trendingResponse.ok || !marketsResponse.ok) {
        throw new Error("Failed to fetch token data");
      }

      const [trendingData, marketsData] = await Promise.all([trendingResponse.json(), marketsResponse.json()]);

      if (!trendingData || !marketsData) {
        throw new Error("No token data available");
      }

      // Transform trending tokens (for Hot Tokens tab)
      const hotTokensData: Token[] = trendingData.coins.map((data: any) => {
        const token = data.item;
        const rawVolume = token.volume_24h_usd || 0;
        const rawPrice = token.data.price || 0;

        return {
          id: token.coin_id,
          name: token.name === "Wrapped SOL" ? "Solana" : token.name,
          symbol: token.symbol.toUpperCase(),
          imgUrl: token.small || "/logo.svg",
          price: formatPrice(rawPrice),
          change: token.data.price_change_percentage_24h.usd || 0,
          volume: formatBigNumbers(rawVolume),
          rawVolume,
          rawPrice: token.data.price,
          marketCap: token.data.market_cap || 0,
        };
      });

      // Transform market tokens (for Gainers, Losers, Volume tabs)
      const marketTokens: Token[] = marketsData.map((token: any) => {
        const rawVolume = token.total_volume || 0;

        return {
          id: token.id,
          name: token.name,
          symbol: token.symbol.toUpperCase(),
          imgUrl: token.image || "/logo.svg",
          price: formatPrice(token.current_price || 0, true),
          change: token.price_change_percentage_24h || 0,
          volume: formatBigNumbers(rawVolume),
          rawVolume,
          marketCap: token.market_cap || 0,
        };
      });

      // Set data for each category
      setHotTokens(hotTokensData); // From trending endpoint (4 tokens)
      setGainers(TokenFilter.gainers(marketTokens, 4)); // From markets (top 4 gainers)
      setLosers(TokenFilter.losers(marketTokens, 4)); // From markets (top 4 losers)
      setVolume(TokenFilter.byVolume(marketTokens, 4)); // From markets (top 4 by volume)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("useTokenData error:", err);
    } finally {
      setLoading(false);
    }
  }, [formatPrice]);

  const retry = useCallback(() => {
    setError(null);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchData, INTERVALS.REFRESH_DATA);

    return () => clearInterval(interval);
  }, [fetchData]);

  return { hotTokens, gainers, losers, volume, loading, error, retry };
}
