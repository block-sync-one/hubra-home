"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Token data interface
 */
export interface TokenData {
  id: string; // Solana address
  name: string;
  symbol: string;
  imgUrl?: string;
  price?: string | number;
  change?: number;
}

interface CurrentTokenContextType {
  currentToken: TokenData | null;
  setCurrentToken: (token: TokenData | null) => void;
  clearCurrentToken: () => void;
}

const CurrentTokenContext = createContext<CurrentTokenContextContextType | undefined>(undefined);

/**
 * Provider component for current token context
 */
export function CurrentTokenProvider({ children }: { children: ReactNode }) {
  const [currentToken, setCurrentTokenState] = useState<TokenData | null>(null);

  const setCurrentToken = useCallback((token: TokenData | null) => {
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
        console.error("Failed to parse stored token:", error);
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
