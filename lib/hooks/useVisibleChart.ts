import { useEffect, useRef, useState } from "react";

import { getClientCache, setClientCache } from "@/lib/cache/client-cache";

const requestQueue: Array<() => void> = [];
let activeRequests = 0;
const MAX_CONCURRENT = 5;

export function useVisibleChart(tokenId: string) {
  const [isVisible, setIsVisible] = useState(false);
  const [priceData, setPriceData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || isLoading || priceData.length > 0) return;

    const cacheKey = `price-history:${tokenId}:1d`;
    const cached = getClientCache<number[]>(cacheKey);

    if (cached) {
      setPriceData(cached);

      return;
    }

    function processQueue() {
      if (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT) {
        const nextRequest = requestQueue.shift();

        if (nextRequest) nextRequest();
      }
    }

    async function fetchPriceHistory() {
      if (activeRequests >= MAX_CONCURRENT) {
        requestQueue.push(fetchPriceHistory);

        return;
      }

      activeRequests++;
      setIsLoading(true);

      try {
        const response = await fetch(`/api/crypto/price-history?id=${tokenId}&days=1`, {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          const prices = result.data.map((point: any) => point.price || 0);

          setClientCache(cacheKey, prices);
          setPriceData(prices);
        } else {
          setPriceData([]);
        }
      } catch {
        setPriceData([]);
      } finally {
        setIsLoading(false);
        activeRequests--;
        // Process next queued request
        processQueue();
      }
    }

    fetchPriceHistory();
  }, [isVisible, tokenId, isLoading, priceData.length]);

  return {
    elementRef,
    priceData,
    isLoading,
    isVisible,
  };
}
