/**
 * Simplified useCryptoData Hook
 * Clean, easy-to-understand data fetching for token tabs
 */

import type { Token } from "@/lib/types/token";

import { useState, useEffect, useCallback } from "react";

import { useCurrency } from "../context/currency-format";

import { TokenFilter } from "@/lib/helpers/token";
import { formatBigNumbers } from "@/lib/utils";
import { INTERVALS } from "@/lib/constants";

interface UseCryptoDataReturn {
  hotTokens: Token[];
  gainers: Token[];
  losers: Token[];
  volume: Token[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Fetch and manage crypto token data for all tabs
 * Simplified version - one fetch, client-side filtering
 */
export function useCryptoData(): UseCryptoDataReturn {
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

      // Fetch from Birdeye markets endpoint (fetch 100 tokens for filtering)
      const response = await fetch("/api/crypto/markets?limit=100", {
        next: { revalidate: 120 }, // Next.js caches for 2 minutes
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token data");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        throw new Error("No token data available");
      }

      // Transform API data to simple Token type
      const allTokens: Token[] = data.map((token: any) => {
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

      // Filter into tabs using simple helper class (limit to 4 tokens for HotTokens page)
      setHotTokens(TokenFilter.hot(allTokens, 4));
      setGainers(TokenFilter.gainers(allTokens, 4));
      setLosers(TokenFilter.losers(allTokens, 4));
      setVolume(TokenFilter.byVolume(allTokens, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      console.error("useCryptoData error:", err);
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
