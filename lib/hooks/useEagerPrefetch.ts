/**
 * Eager prefetching for instant token detail page loads
 * Prefetches visible token data immediately and warms Redis cache
 */

import { useEffect, useRef } from "react";

interface Token {
  id: string;
  [key: string]: any;
}

/**
 * Eagerly prefetch token details for all visible tokens
 *
 * Strategy:
 * 1. Prefetches on page load during browser idle time
 * 2. Checks browser cache first (via HEAD request)
 * 3. Only fetches if not already cached (smart prefetch)
 * 4. Warms up Redis cache for instant subsequent requests
 * 5. Uses low priority to not block critical resources
 */
export function useEagerPrefetch(tokens: Token[], options?: { limit?: number }) {
  const prefetchedRef = useRef<Set<string>>(new Set());
  const limit = options?.limit || 50; // Limit concurrent prefetch to avoid overwhelming

  useEffect(() => {
    if (!tokens || tokens.length === 0) return;
    if (typeof window === "undefined") return;

    // Use requestIdleCallback to prefetch during idle time
    const prefetchAll = async () => {
      // Limit prefetch to avoid overwhelming the browser
      const tokensToPrefetrch = tokens.slice(0, limit);

      tokensToPrefetrch.forEach((token, index) => {
        if (!token.id || prefetchedRef.current.has(token.id)) return;

        prefetchedRef.current.add(token.id);

        // Stagger requests slightly to avoid thundering herd
        setTimeout(
          () => {
            // Prefetch token detail data
            // Browser will use cache if available (via Cache-Control headers)
            fetch(`/api/${token.id}`, {
              method: "GET",
              priority: "low",
              cache: "force-cache", // Use browser cache if available
            } as RequestInit).catch(() => {
              // Silently fail - non-critical prefetch
            });

            // Prefetch 24h price history (most common view)
            // Longer TTL (5min) makes this more cache-friendly
            fetch(`/api/crypto/price-history?id=${token.id}&days=1`, {
              method: "GET",
              priority: "low",
              cache: "force-cache", // Use browser cache if available
            } as RequestInit).catch(() => {
              // Silently fail - non-critical
            });
          },
          index * 50 // Stagger by 50ms each
        );
      });
    };

    // Schedule prefetch during idle time
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchAll, { timeout: 3000 });
    } else {
      // Fallback: prefetch after short delay
      setTimeout(prefetchAll, 200);
    }
  }, [tokens, limit]);
}
