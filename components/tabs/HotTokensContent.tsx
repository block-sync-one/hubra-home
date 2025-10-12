"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useTokenData } from "@/lib/hooks/useTokenData";

export const HotTokensContent = () => {
  const { hotTokens, loading, error, retry } = useTokenData();

  return <TokenListView error={error} loading={loading} tokens={hotTokens} onRetry={retry} />;
};
