"use client";

import type { Token } from "@/lib/types/token";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CurrentTokenContextType {
  currentToken: Token | null;
  setCurrentToken: (token: Token | null) => void;
  clearCurrentToken: () => void;
}

const CurrentTokenContext = createContext<CurrentTokenContextType | undefined>(undefined);

/**
 * Provider component for current token context
 */
export function CurrentTokenProvider({ children }: { children: ReactNode }) {
  const [currentToken, setCurrentTokenState] = useState<Token | null>(null);

  const setCurrentToken = useCallback((token: Token | null) => {
    setCurrentTokenState(token);

    // Store in sessionStorage for persistence across page reloads
    if (token) {
      sessionStorage.setItem("currentToken", JSON.stringify(token));
    } else {
      sessionStorage.removeItem("currentToken");
    }
  }, []);

  const clearCurrentToken = useCallback(() => {
    setCurrentTokenState(null);
    sessionStorage.removeItem("currentToken");
  }, []);

  // Load from sessionStorage on mount
  React.useEffect(() => {
    const stored = sessionStorage.getItem("currentToken");

    if (stored) {
      try {
        setCurrentTokenState(JSON.parse(stored));
      } catch (error) {
        sessionStorage.removeItem("currentToken");
      }
    }
  }, []);

  return (
    <CurrentTokenContext.Provider
      value={{
        currentToken,
        setCurrentToken,
        clearCurrentToken,
      }}>
      {children}
    </CurrentTokenContext.Provider>
  );
}

/**
 * Hook to access current token context
 *
 * @example
 * const { currentToken, setCurrentToken } = useCurrentToken();
 *
 * // When navigating to token details
 * setCurrentToken({
 *   id: "So111...112",
 *   name: "Solana",
 *   symbol: "SOL",
 *   imgUrl: "...",
 * });
 * router.push(`/tokens/${tokenNameToSlug(token.name)}`);
 */
export function useCurrentToken() {
  const context = useContext(CurrentTokenContext);

  if (context === undefined) {
    throw new Error("useCurrentToken must be used within a CurrentTokenProvider");
  }

  return context;
}
