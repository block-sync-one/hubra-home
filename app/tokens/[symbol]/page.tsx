import React from "react";

import { TokenDetailPageClient } from "./TokenDetailPageClient";

// Fetch token data server-side with smart caching
async function getTokenData(tokenAddress: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/crypto/token/${tokenAddress}`, {
      // Cache for 2 minutes on server (same as auto-refresh interval)
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching token data:", error);

    return null;
  }
}

interface TokenDetailPageProps {
  params: Promise<{ symbol: string }>;
}

// Server component - prefetches token data (NO LOADING SPINNER!)
export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { symbol } = await params;

  // Convert URL parameter back to token name
  const tokenName = symbol.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Prefetch token data on the server
  const apiTokenData = await getTokenData(symbol);

  // Pass server-fetched data to client component
  return <TokenDetailPageClient apiTokenData={apiTokenData} symbol={symbol} tokenName={tokenName} />;
}
