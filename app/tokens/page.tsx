import React from "react";
import { Metadata } from "next";

import Tokens from "@/app/tokens/Tokens";
import AllTokens from "@/app/tokens/AllTokens";
import HotTokens from "@/app/tokens/HotTokens";
import { fetchMarketData } from "@/lib/data/market-data";
import { TokenFilter } from "@/lib/helpers/token";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cryptocurrency Prices | Live Solana Token Market Data | Hubra",
  description:
    "Track real-time Solana cryptocurrency prices, market cap, trading volume, and price changes. Explore hot tokens, top gainers, losers, and trading volume on Solana blockchain.",
  keywords: [
    "solana tokens",
    "crypto prices",
    "cryptocurrency market",
    "token prices",
    "solana blockchain",
    "crypto trading",
    "market cap",
    "trading volume",
    "hot tokens",
    "crypto gainers",
    "crypto losers",
    "birdeye",
    "defi",
  ],
  openGraph: {
    title: "Live Solana Token Prices & Market Data | Hubra",
    description:
      "Track real-time Solana token prices, market trends, and trading data. Discover hot tokens, gainers, and losers on the Solana blockchain.",
    type: "website",
    url: "https://hubra.app/tokens",
    images: [
      {
        url: "/og-tokens.png",
        width: 1200,
        height: 630,
        alt: "Hubra - Solana Token Market Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Solana Token Prices | Hubra",
    description: "Track real-time Solana cryptocurrency prices, market cap, and trading volume.",
    images: ["/og-tokens.png"],
  },
  alternates: {
    canonical: "https://hubra.app/tokens",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "index": true,
      "follow": true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Server Component - Fetches all data once and distributes to child components
 * This ensures HotTokens and AllTokens use the same data source
 * Market stats are calculated server-side and cached in Redis
 */
export default async function TokensPage() {
  const marketDataResult = await fetchMarketData(400, 0);
  const marketTokens = marketDataResult.data;
  const { totalMarketCap, totalVolume, totalFDV, marketCapChange } = marketDataResult.stats;
  const newTokensCount = 0;

  // Sort data for different views (reuse same data)
  const allAssetsSorted = TokenFilter.byMarketCap(marketTokens, marketTokens.length);
  const gainersSorted = TokenFilter.gainers(marketTokens, marketTokens.length);
  const losersSorted = TokenFilter.losers(marketTokens, marketTokens.length);
  const volumeSorted = TokenFilter.byVolume(marketTokens, marketTokens.length);

  // Breadcrumb structured data
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
    ],
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />
      <main className="flex flex-col gap-12">
        <div className="md:max-w-7xl mx-auto w-full">
          <Tokens
            marketCapChange={marketCapChange}
            newTokensCount={newTokensCount}
            solanaFDV={totalFDV}
            solanaFDVChange={0}
            totalMarketCap={totalMarketCap}
            totalVolume={totalVolume}
          />
        </div>
        <div className="md:max-w-7xl mx-auto w-full">
          {/* Pass top 4 from each category to HotTokens */}
          <HotTokens
            initialGainers={gainersSorted.slice(0, 4)}
            initialLosers={losersSorted.slice(0, 4)}
            initialVolume={volumeSorted.slice(0, 4)}
          />
        </div>
        <div className="md:max-w-7xl mx-auto w-full">
          {/* Pass full sorted data to AllTokens */}
          <AllTokens initialAllTokens={allAssetsSorted} initialGainers={gainersSorted} initialLosers={losersSorted} />
        </div>
      </main>
    </>
  );
}
