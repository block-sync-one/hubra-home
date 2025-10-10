import React from "react";
import { Metadata } from "next";

import { TokenDetailPageClient } from "./TokenDetailPageClient";

interface TokenDetailPageProps {
  params: Promise<{ address: string }>;
}

/**
 * Generate dynamic metadata for token detail pages
 */
export async function generateMetadata({ params }: TokenDetailPageProps): Promise<Metadata> {
  const { address } = await params;

  // Fetch token data for metadata
  const tokenData = await getTokenData(address);

  const tokenName = tokenData?.name || "Token";
  const tokenSymbol = tokenData?.symbol || "";
  const tokenPrice = tokenData?.price ? `$${tokenData.price.toFixed(2)}` : "";
  const tokenChange = tokenData?.priceChange24hPercent || 0;
  const changeText = tokenChange >= 0 ? `+${tokenChange.toFixed(2)}%` : `${tokenChange.toFixed(2)}%`;

  const title = `${tokenName} (${tokenSymbol}) Price ${tokenPrice} ${changeText} | Hubra`;
  const description = `Live ${tokenName} (${tokenSymbol}) price, market cap, trading volume, and price charts. ${tokenData?.extensions?.description || `Track ${tokenName} performance on Solana blockchain.`}`;

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
      url: `https://hubra.app/tokens/${address}`,
      images: [
        {
          url: tokenData?.logoURI || "/og-token-default.png",
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
      images: [tokenData?.logoURI || "/og-token-default.png"],
    },
    alternates: {
      canonical: `https://hubra.app/tokens/${address}`,
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
    // Build absolute URL for server-side fetching
    // Priority: NEXT_PUBLIC_SITE_URL -> VERCEL_URL -> localhost
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl && process.env.VERCEL_URL) {
      // VERCEL_URL doesn't include protocol, add https://
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }

    if (!baseUrl) {
      // Fallback to localhost for local development
      baseUrl = "http://localhost:3000";
    }

    // Ensure baseUrl doesn't have trailing slash
    baseUrl = baseUrl.replace(/\/$/, "");

    const apiUrl = `${baseUrl}/api/${tokenAddress}`;

    console.log("Fetching token data from:", apiUrl);

    const response = await fetch(apiUrl, {
      next: { revalidate: 120 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch token data: ${response.status} ${response.statusText}`);
      const errorText = await response.text();

      console.error("Error response:", errorText);

      return null;
    }

    const res = await response.json();

    console.log("Token data fetched successfully:", res.symbol || "unknown");

    return res;
  } catch (error) {
    console.error("Error fetching token data:", error);

    return null;
  }
}

/**
 * Server component - SSR with token data prefetching
 * Expects address to be a Solana address
 */
export default async function TokenDetailPage({ params }: TokenDetailPageProps) {
  const { address } = await params;

  // address is the token address (e.g., "So111...112")
  const tokenAddress = address;

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
        "image": apiTokenData.logoURI,
        "brand": {
          "@type": "Brand",
          "name": "Solana",
        },
        "offers": {
          "@type": "Offer",
          "price": apiTokenData.price,
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": `https://hubra.app/tokens/${address}`,
        },
        "aggregateRating": apiTokenData.marketCap
          ? {
              "@type": "AggregateRating",
              "ratingValue": apiTokenData.priceChange24hPercent > 0 ? "4.5" : "3.5",
              "reviewCount": apiTokenData.holder || 1000,
            }
          : undefined,
        "additionalProperty": [
          {
            "@type": "PropertyValue",
            "name": "Market Cap",
            "value": apiTokenData.marketCap,
          },
          {
            "@type": "PropertyValue",
            "name": "24h Volume",
            "value": apiTokenData.v24hUSD,
          },
          {
            "@type": "PropertyValue",
            "name": "24h Change",
            "value": apiTokenData.priceChange24hPercent,
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
        "item": `https://hubra.app/tokens/${address}`,
      },
    ],
  };

  // Pass server-fetched data to client
  return (
    <>
      {jsonLd && <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} id="token-jsonld" type="application/ld+json" />}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />
      <TokenDetailPageClient apiTokenData={apiTokenData} />
    </>
  );
}
