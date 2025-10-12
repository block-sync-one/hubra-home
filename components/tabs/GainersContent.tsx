"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useTokenData } from "@/lib/hooks/useTokenData";

export const GainersContent = () => {
  const { gainers, loading, error, retry } = useTokenData();

  return <TokenListView error={error} loading={loading} tokens={gainers} onRetry={retry} />;
};
