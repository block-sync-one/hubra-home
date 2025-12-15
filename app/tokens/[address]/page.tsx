import React, { cache } from "react";
import { Metadata } from "next";

import { TokenDetailPageClient } from "./TokenDetailPageClient";

import { fetchTokenData } from "@/lib/data/token-data";
import { siteConfig } from "@/config/site";
import { getFinancialProductJsonLd, getBreadcrumbJsonLdString } from "@/lib/utils/structured-data";

interface TokenDetailPageProps {
  params: Promise<{ address: string }>;
}

/**
 * Cached token data fetcher - ensures single fetch per request
 * React cache() memoizes for the duration of the request
 */
const getCachedTokenData = cache(async (address: string) => {
  return await fetchTokenData(address);
});

/**
 * Generate dynamic metadata for token detail pages
 */
export async function generateMetadata({ params }: TokenDetailPageProps): Promise<Metadata> {
  const { address } = await params;

  const tokenData = await getCachedTokenData(address);

  if (!tokenData) {
    return {
      title: "Token Not Found | Hubra",
      description: "The requested token could not be found on Solana blockchain.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const tokenName = tokenData.name || "Token";
  const tokenSymbol = tokenData.symbol || "";
  const tokenPrice = tokenData.price ? `$${tokenData.price.toFixed(2)}` : "";
  const tokenChange = tokenData.priceChange24hPercent || 0;
  const changeText = tokenChange >= 0 ? `+${tokenChange.toFixed(2)}%` : `${tokenChange.toFixed(2)}%`;

  const title = `${tokenName} (${tokenSymbol}) Price ${tokenPrice} ${changeText} | Hubra - Solana Token Tracker`;
  const description = tokenData
    ? `${tokenName} (${tokenSymbol}) is a cryptocurrency token on the Solana blockchain. Current price: ${tokenPrice} (${changeText}). ${tokenData.extensions?.description || `Track real-time ${tokenName} price, market cap ($${(tokenData.marketCap / 1e9).toFixed(2)}B), 24h trading volume ($${(tokenData.v24hUSD / 1e6).toFixed(2)}M), price changes, holder count (${tokenData.holder.toLocaleString()}), liquidity metrics, and comprehensive trading analytics on Hubra.`}`
    : `Live ${tokenName} (${tokenSymbol}) price, market cap, trading volume, and price charts. Track ${tokenName} performance on Solana blockchain.`;

  return {
    title,
    description,
    keywords: [
      tokenName,
      tokenSymbol,
      `${tokenName} price`,
      `${tokenSymbol} token`,
      "solana token",
      "crypto price",
      "token chart",
      "defi",
      "birdeye",
    ],
    openGraph: {
      title: `${tokenName} (${tokenSymbol}) - ${tokenPrice} ${changeText}`,
      description,
      type: "website",
      url: `${siteConfig.domain}/tokens/${address}`,
      images: [
        {
          url: tokenData?.logoURI || "/image/token.svg",
          width: 1200,
          height: 630,
          alt: `${tokenName} (${tokenSymbol}) Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tokenName} (${tokenSymbol}) - ${tokenPrice}`,
      description: `${tokenName} price ${tokenPrice} ${changeText}. Live market data on Hubra.`,
      images: [tokenData?.logoURI || "/image/token.svg"],
    },
    alternates: {
      canonical: `${siteConfig.domain}/tokens/${address}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = await params;

  const apiTokenData = await getCachedTokenData(address);

  if (!apiTokenData) {
    throw new Error(`Token not found: ${address}`);
  }

  const jsonLd = apiTokenData
    ? getFinancialProductJsonLd({
        name: apiTokenData.name,
        symbol: apiTokenData.symbol,
        price: apiTokenData.price,
        marketCap: apiTokenData.marketCap,
        volume24h: apiTokenData.v24hUSD,
        priceChange24h: apiTokenData.priceChange24hPercent,
        holders: apiTokenData.holder,
        logoURI: apiTokenData.logoURI,
        description: apiTokenData.extensions?.description
          ? `${apiTokenData.extensions.description} ${apiTokenData.name} (${apiTokenData.symbol}) is a cryptocurrency token on the Solana blockchain with real-time price tracking, market analytics, and trading data available.`
          : undefined,
        url: `${siteConfig.domain}/tokens/${address}`,
      })
    : null;

  const breadcrumbJsonLdString = getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "Tokens", url: `${siteConfig.domain}/tokens` },
    { name: apiTokenData?.name || "Token", url: `${siteConfig.domain}/tokens/${address}` },
  ]);

  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  return (
    <>
      {jsonLdString && <script dangerouslySetInnerHTML={{ __html: jsonLdString }} defer id="token-jsonld" type="application/ld+json" />}
      <script dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} defer id="breadcrumb-jsonld" type="application/ld+json" />
      <TokenDetailPageClient apiTokenData={apiTokenData} />
    </>
  );
}
