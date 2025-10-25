import { useEffect, useRef, useState } from "react";

// Global request queue to limit concurrent API calls (prevents overwhelming the server)
const requestQueue: Array<() => void> = [];
let activeRequests = 0;
const MAX_CONCURRENT = 5;

// Client-side in-memory cache (persists during session, instant retrieval)
const chartDataCache = new Map<string, number[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

/**
 * Hook to lazy-load chart data when element becomes visible
 * Uses IntersectionObserver with 200px preload margin
 *
 * Performance: Only fetches data for visible charts, reducing initial load by ~95%
 * Queue system prevents overwhelming server with 200 simultaneous requests
 */
export function useVisibleChart(tokenId: string) {
  const [isVisible, setIsVisible] = useState(false);
  const [priceData, setPriceData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Set up IntersectionObserver to detect when chart enters viewport
  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    // Create observer with 200px preload margin for earlier loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true); // Trigger data fetch once
          }
        });
      },
      {
        rootMargin: "200px", // Preload 200px
        threshold: 0, // Trigger as soon as any part is visible
      }
    );

    observer.observe(element);

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Fetch price data when chart becomes visible (with client-side cache + request queue)
  useEffect(() => {
    if (!isVisible || isLoading || priceData.length > 0) return;

    // Check client-side cache first (instant - 0ms!)
    const cacheKey = `${tokenId}-1d`;
    const cached = chartDataCache.get(cacheKey);
    const cacheTime = cacheTimestamps.get(cacheKey);
    const now = Date.now();

    // If cache exists and is fresh (< 5min old), use it immediately
    if (cached && cacheTime && now - cacheTime < CACHE_DURATION) {
      setPriceData(cached);

      return; // No API call needed!
    }

    // Process next request from queue
    function processQueue() {
      if (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT) {
        const nextRequest = requestQueue.shift();

        if (nextRequest) nextRequest();
      }
    }

    async function fetchPriceHistory() {
      // Queue this request if too many are active
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

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await response.json();

        if (result.data && Array.isArray(result.data)) {
          // Map OHLCV data to simple price array for mini chart
          const prices = result.data.map((point: any) => point.price || 0);

          // Store in client-side cache for instant future access
          chartDataCache.set(cacheKey, prices);
          cacheTimestamps.set(cacheKey, now);

          setPriceData(prices);
        } else {
          // Empty data - show empty chart
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
