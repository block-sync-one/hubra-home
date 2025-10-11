"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useCryptoData } from "@/lib/hooks/useCryptoData";

export const HotTokensContent = () => {
  const { hotTokens, loading, error, retry } = useCryptoData();

  return <TokenListView error={error} loading={loading} tokens={hotTokens} onRetry={retry} />;
};
