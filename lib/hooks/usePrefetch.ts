/**
 * Prefetching hook for instant navigation
 * @description Aggressively prefetch token details for visible tokens
 */

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PrefetchOptions {
  /** Token address to prefetch */
  tokenAddress: string;
  /** Token name for URL */
  tokenName: string;
  /** Prefetch on mount (default: false) */
  immediate?: boolean;
  /** Prefetch on hover (default: true) */
  onHover?: boolean;
}

/**
 * Hook to prefetch token details for instant navigation
 */
export function usePrefetch({ tokenAddress, tokenName, immediate = false, onHover = true }: PrefetchOptions) {
  const router = useRouter();

  // Prefetch both the route and the data
  const prefetch = useCallback(() => {
    if (!tokenAddress || !tokenName) return;

    // Prefetch the Next.js route
    const slug = tokenName.toLowerCase().replace(/\s+/g, "-");

    router.prefetch(`/tokens/${slug}`);

    // Prefetch the API data
    fetch(`/api/crypto/token/${tokenAddress}`, {
      method: "GET",
      // Use default cache to let browser cache it
    }).catch((err) => {
      // Silently fail - this is just prefetching
      console.debug("Prefetch failed (non-critical):", err);
    });

    // Prefetch price history (24h default)
    fetch(`/api/crypto/price-history?id=${tokenAddress}&days=1`, {
      method: "GET",
    }).catch((err) => {
      console.debug("Price history prefetch failed (non-critical):", err);
    });
  }, [tokenAddress, tokenName, router]);

  // Prefetch immediately on mount if requested
  useEffect(() => {
    if (immediate) {
      prefetch();
    }
  }, [immediate, prefetch]);

  return {
    prefetch,
    onMouseEnter: onHover ? prefetch : undefined,
  };
}

/**
 * Hook to prefetch multiple tokens at once
 * Uses Next.js router.prefetch() for optimal performance
 *
 * How it works:
 * 1. Next.js router.prefetch() automatically prefetches the page and SSR data
 * 2. The prefetched data is cached in the Next.js router cache
 * 3. When user navigates, the cached data loads instantly
 *
 * Best practices:
 * - Only prefetches visible tokens (called after tokens load)
 * - Uses browser's idle time (requestIdleCallback) for background work
 * - Gracefully degrades in older browsers
 */
export function useBatchPrefetch() {
  const router = useRouter();

  const prefetchTokens = useCallback(
    (tokens: Array<{ id: string; name: string }>) => {
      if (!tokens || tokens.length === 0) return;

      console.log(`🚀 Prefetching ${tokens.length} tokens...`);

      // Use requestIdleCallback to prefetch during browser idle time
      const prefetchBatch = () => {
        tokens.forEach(({ id, name }) => {
          if (!id || !name) return;

          try {
            // Next.js router.prefetch() does the heavy lifting:
            // - Prefetches the page component bundle
            // - Runs getServerSideProps on the server
            // - Caches everything in Next.js router cache
            router.prefetch(`/tokens/${id}`);

            console.debug(`✓ Prefetched: ${name}`);
          } catch (error) {
            console.debug(`✗ Prefetch failed: ${name}`, error);
          }
        });
      };

      // Schedule prefetching during browser idle time for best performance
      if (typeof window !== "undefined") {
        if ("requestIdleCallback" in window) {
          // Modern browsers: Use requestIdleCallback
          window.requestIdleCallback(prefetchBatch, { timeout: 2000 });
        } else {
          // Fallback for Safari and older browsers
          setTimeout(prefetchBatch, 100);
        }
      }
    },
    [router]
  );

  return { prefetchTokens };
}
