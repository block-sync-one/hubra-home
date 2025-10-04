import React, { createContext, useContext, useEffect, useMemo } from "react";
/**
 * Context value interface defining what the portfolio context provides
 * to consuming components
 */
interface CtxValue {
  data: any;
  isLoading: boolean; // Loading state indicator
}

// Create the all tokens context with undefined as default (requires provider)
const dataCtx = createContext<CtxValue | undefined>(undefined);

export function AllTokensProvider({ children }: { children: React.ReactNode }) {
  const data = {}; // TODO: Fetch data

  useEffect(() => {
    if (data) {
      console.log("data", data);
    }
  }, [data]);

  const isLoading = data === undefined;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      data,
      isLoading,
    }),
    [data, isLoading],
  );

  return <dataCtx.Provider value={contextValue}>{children}</dataCtx.Provider>;
}

/**
 * Custom hook to consume all token context
 *
 * Provides type-safe access to portfolio data and functions.
 * Throws error if used outside AllTokensProvider to catch integration mistakes early.
 *
 * @returns {CtxValue} Portfolio context value with data, loading state, and refetch function
 * @throws {Error} If used outside AllTokensProvider
 */
export const useAllTokens = (): CtxValue => {
  const ctx = useContext(dataCtx);

  // Ensure hook is used within provider - helps catch integration errors
  if (!ctx)
    throw new Error("useAllTokens must be used inside PortfolioProvider");

  return ctx;
};
