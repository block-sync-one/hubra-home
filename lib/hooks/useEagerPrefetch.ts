import { useEffect, useRef } from "react";

interface Token {
  id: string;
  [key: string]: any;
}

// Prefetch visible tokens during browser idle time
export function useEagerPrefetch(tokens: Token[], options?: { limit?: number }) {
  const prefetchedRef = useRef<Set<string>>(new Set());
  const limit = options?.limit || 50;

  useEffect(() => {
    if (!tokens || tokens.length === 0) return;
    if (typeof window === "undefined") return;

    const prefetchAll = async () => {
      const tokensToPrefetrch = tokens.slice(0, limit);

      tokensToPrefetrch.forEach((token, index) => {
        if (!token.id || prefetchedRef.current.has(token.id)) return;

        prefetchedRef.current.add(token.id);

        setTimeout(() => {
          fetch(`/api/${token.id}`, {
            method: "GET",
            priority: "low",
          } as RequestInit).catch(() => {});

          fetch(`/api/crypto/price-history?id=${token.id}&days=1`, {
            method: "GET",
            priority: "low",
          } as RequestInit).catch(() => {});
        }, index * 50);
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchAll, { timeout: 3000 });
    } else {
      setTimeout(prefetchAll, 200);
    }
  }, [tokens, limit]);
}
