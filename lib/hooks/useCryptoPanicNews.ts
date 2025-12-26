"use client";

import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import { useState, useEffect, useMemo } from "react";

import { fetchCryptoPanicNews } from "@/lib/services/cryptopanic";
import { apiQueue } from "@/lib/utils/request-queue";

/**
 * Hook to fetch CryptoPanic news
 * Redis caching is handled in fetchCryptoPanicNews
 */
export function useCryptoPanicNews() {
  const [news, setNews] = useState<CryptoPanicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        // Use centralized request queue to prevent duplicate requests
        const result = await apiQueue.dedupe("cryptopanic:news:all", async () => {
          return await fetchCryptoPanicNews();
        });

        if (result && result.length > 0) {
          setNews(result);
        } else {
          setError("No news available");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const { firstHalf, secondHalf, hasEnoughItems } = useMemo(() => {
    const hasEnough = news.length >= 10;

    return {
      hasEnoughItems: hasEnough,
      firstHalf: hasEnough ? news.slice(0, Math.ceil(news.length / 2)) : news,
      secondHalf: hasEnough ? news.slice(Math.ceil(news.length / 2)) : [],
    };
  }, [news]);

  return {
    news,
    loading,
    error,
    firstHalf,
    secondHalf,
    hasEnoughItems,
  };
}
