"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useTokenData } from "@/lib/hooks/useTokenData";

export const VolumeContent = () => {
  const { volume, loading, error, retry } = useTokenData();

  return <TokenListView error={error} loading={loading} tokens={volume} onRetry={retry} />;
};
