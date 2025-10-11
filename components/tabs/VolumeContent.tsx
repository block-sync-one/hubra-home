"use client";

import React from "react";

import { TokenListView } from "./TokenListView";

import { useCryptoData } from "@/lib/hooks/useCryptoData";

export const VolumeContent = () => {
  const { volume, loading, error, retry } = useCryptoData();

  return <TokenListView error={error} loading={loading} tokens={volume} onRetry={retry} />;
};
