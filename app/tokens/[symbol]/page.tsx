import React from "react";
import { Metadata } from "next";

import { TokenDetailPageClient } from "./TokenDetailPageClient";

interface TokenDetailPageProps {
  params: Promise<{ symbol: string }>;
}

/**
 * Generate dynamic metadata for token detail pages
 */
export async function generateMetadata({ params }: TokenDetailPageProps): Promise<Metadata> {
  const { symbol } = await params;

  // Fetch token data for metadata
  const tokenData = await getTokenData(symbol);

  const tokenName = tokenData?.data?.name || "Token";
  const tokenSymbol = tokenData?.data?.symbol || "";
  const tokenPrice = tokenData?.data?.price ? `$${tokenData.data.price.toFixed(2)}` : "";
  const tokenChange = tokenData?.data?.price_change_24h_percent || 0;
  const changeText = tokenChange >= 0 ? `+${tokenChange.toFixed(2)}%` : `${tokenChange.toFixed(2)}%`;

  const title = `${tokenName} (${tokenSymbol}) Price ${tokenPrice} ${changeText} | Hubra`;
  const description = `Live ${tokenName} (${tokenSymbol}) price, market cap, trading volume, and price charts. ${tokenData?.data?.extensions?.description || `Track ${tokenName} performance on Solana blockchain.`}`;

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
      url: `https://hubra.app/tokens/${symbol}`,
      images: [
        {
          url: tokenData?.data?.logo_uri || "/og-token-default.png",
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
      images: [tokenData?.data?.logo_uri || "/og-token-default.png"],
    },
    alternates: {
      canonical: `https://hubra.app/tokens/${symbol}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Fetch token data server-side with smart caching
async function getTokenData(tokenAddress: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/crypto/token/${tokenAddress}`, {
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

/**
 * Server component - SSR with token data prefetching
 * Expects symbol to be a Solana address (not a name/slug)
 */
export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { symbol } = await params;

  // symbol is now the token address (e.g., "So111...112")
  const tokenAddress = symbol;

  // Prefetch token data on server (SSR - NO LOADING SPINNER!)
  const apiTokenData = await getTokenData(tokenAddress);

  console.log("TokenDetailPage server-side:", {
    tokenAddress,
    hasData: !!apiTokenData,
  });

  // Generate JSON-LD structured data for SEO
  const jsonLd = apiTokenData
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": apiTokenData.name,
        "description": apiTokenData.extensions?.description || `${apiTokenData.name} cryptocurrency token on Solana blockchain`,
        "image": apiTokenData.logo_uri,
        "brand": {
          "@type": "Brand",
          "name": "Solana",
        },
        "offers": {
          "@type": "Offer",
          "price": apiTokenData.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": `https://hubra.app/tokens/${symbol}`,
        },
        "aggregateRating": apiTokenData.market_cap
          ? {
              "@type": "AggregateRating",
              "ratingValue": apiTokenData.price_change_24h_percent > 0 ? "4.5" : "3.5",
              "reviewCount": apiTokenData.holder || 1000,
            }
          : undefined,
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Market Cap",
            "value": apiTokenData.market_cap,
          },
          {
            "@type": "PropertyValue",
            "name": "24h Volume",
            "value": apiTokenData.volume_24h,
          },
          {
            "@type": "PropertyValue",
            "name": "24h Change",
            "value": apiTokenData.price_change_24h_percent,
          },
        ],
      }
    : null;

  // Breadcrumb structured data for better navigation
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hubra.app",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tokens",
        "item": "https://hubra.app/tokens",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": apiTokenData?.name || "Token",
        "item": `https://hubra.app/tokens/${symbol}`,
      },
    ],
  };

  // Pass server-fetched data to client
  return (
    <>
      {jsonLd && <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} id="token-jsonld" type="application/ld+json" />}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />
      <TokenDetailPageClient
        apiTokenData={apiTokenData}
        symbol={symbol}
        tokenAddress={tokenAddress}
        tokenName={apiTokenData?.name || "Token"}
      />
    </>
  );
}
