"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useTokenData } from "@/lib/hooks/useTokenData";

export const LosersContent = () => {
  const { losers, loading, error, retry } = useTokenData();

  return <TokenListView error={error} loading={loading} tokens={losers} onRetry={retry} />;
};
