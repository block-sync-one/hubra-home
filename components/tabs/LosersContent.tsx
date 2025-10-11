"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useCryptoData } from "@/lib/hooks/useCryptoData";

export const LosersContent = () => {
  const { losers, loading, error, retry } = useCryptoData();

  return <TokenListView error={error} loading={loading} tokens={losers} onRetry={retry} />;
};
