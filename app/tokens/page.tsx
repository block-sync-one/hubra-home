import React from "react";
import { Metadata } from "next";

import Tokens from "@/app/tokens/Tokens";
import AllTokens from "@/app/tokens/AllTokens";
import HotTokens from "@/app/tokens/HotTokens";
import { fetchMarketData } from "@/lib/data/market-data";
import { fetchNewlyListedTokens } from "@/lib/data/newly-listed-tokens";
import { fetchTrendingData } from "@/lib/data/trending-data";
import { fetchGlobalStats } from "@/lib/data/global-stats";
import { TokenFilter } from "@/lib/helpers/token";
import { transformTrendingToTokens } from "@/lib/helpers/trending-transformer";
import { TOKEN_LIMITS } from "@/lib/constants/market";
import { siteConfig } from "@/config/site";
import { COMMON_BREADCRUMBS, getCollectionPageJsonLd, getDatasetJsonLd } from "@/lib/utils/structured-data";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const title = "Solana Token Prices | Live Crypto Prices & Market Data | Hubra";
const description =
  "Track real-time Solana token prices and market data. View price charts, market cap, 24h volume, and discover trending tokens. Updated every minute.";
const ogTitle = "Live Solana Token Prices & Market Data";
const canonical = `${siteConfig.domain}/tokens`;

export const metadata: Metadata = {
  title,
  description,
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
    title: ogTitle,
    description,
    type: "website",
    url: canonical,
    images: [
      {
        url: "/image/df-2.svg",
        width: 1200,
        height: 630,
        alt: "Hubra - Solana Token Market Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description,
    images: ["/image/df-2.svg"],
  },
  alternates: {
    canonical,
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

export default async function TokensPage() {
  const perfStart = performance.now();

  const results = await Promise.allSettled([
    fetchMarketData(TOKEN_LIMITS.TOKENS_PAGE, 0),
    fetchNewlyListedTokens(TOKEN_LIMITS.TOKENS_PAGE, 0, 24), // Last 24 hours
    fetchTrendingData(TOKEN_LIMITS.HOT_TOKENS),
    fetchGlobalStats(),
  ]);

  // Extract results with fallbacks for failed requests
  const marketDataResult =
    results[0].status === "fulfilled"
      ? results[0].value
      : { data: [], stats: { totalFDV: 0, totalVolume: 0, solFDV: 0, totalFDVChange: 0 } };
  const newlyListedResult =
    results[1].status === "fulfilled"
      ? results[1].value
      : { data: [], stats: { totalFDV: 0, totalVolume: 0, solFDV: 0, totalFDVChange: 0 } };
  const trendingData = results[2].status === "fulfilled" ? results[2].value : { tokens: [] };
  const globalStats = results[3].status === "fulfilled" ? results[3].value : { stablecoins_tvl: 0, stablecoins_tvl_change: 0 };

  const perfDuration = performance.now() - perfStart;

  if (process.env.NODE_ENV === "development") {
    console.log(`📊 Tokens page data fetch: ${perfDuration.toFixed(0)}ms`);
  }

  // Extract data and stats
  const marketTokens = marketDataResult.data;
  const newlyListedTokens = newlyListedResult.data;
  const { totalFDV, totalVolume, solFDV, totalFDVChange } = marketDataResult.stats;
  const newTokensCount = newlyListedTokens.length;

  // Transform trending data to Token format
  const trendingTokens = transformTrendingToTokens(trendingData);

  const allAssetsSorted = TokenFilter.byMarketCap(marketTokens, marketTokens.length);
  const gainersSorted = TokenFilter.gainers(marketTokens, marketTokens.length);
  const losersSorted = TokenFilter.losers(marketTokens, marketTokens.length);
  const volumeSorted = TokenFilter.byVolume(marketTokens, marketTokens.length);

  const collectionJsonLd = getCollectionPageJsonLd(
    "Solana Token Prices & Market Data",
    `Track real-time prices for ${marketTokens.length}+ Solana tokens, including market cap, trading volume, and price changes`,
    marketTokens.length,
    marketTokens.slice(0, 10).map((token) => ({
      name: token.name,
      url: `${siteConfig.domain}/tokens/${token.id}`,
    }))
  );

  const datasetJsonLd = getDatasetJsonLd({
    name: "Solana Token Market Data",
    description: `Real-time market data for ${marketTokens.length}+ Solana tokens including prices, market cap, trading volume, price changes, holders, and liquidity metrics`,
    url: `${siteConfig.domain}/tokens`,
    keywords: [
      "Solana tokens",
      "crypto prices",
      "cryptocurrency market",
      "token prices",
      "market cap",
      "trading volume",
      "blockchain tokens",
    ],
    creator: {
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    datePublished: "2024-01-01",
  });

  const collectionJsonLdString = JSON.stringify(collectionJsonLd);
  const datasetJsonLdString = JSON.stringify(datasetJsonLd);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: COMMON_BREADCRUMBS.tokens }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: collectionJsonLdString }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: datasetJsonLdString }} defer type="application/ld+json" />
      <main className="flex flex-col gap-12">
        <header className="sr-only">
          <h1>Solana Token Prices</h1>
          <p>
            Track live Solana token prices and market data in real-time. 
            Our comprehensive dashboard displays current prices, 24-hour trading volume, market capitalization, 
            and price changes for thousands of tokens on the Solana blockchain. Discover trending tokens, 
            track top gainers and losers, and spot newly listed projects before they take off. Solana&apos;s 
            high-speed, low-cost network has attracted hundreds of innovative projects — from meme coins 
            to DeFi tokens and NFT-related assets. Whether you&apos;re researching your next investment or 
            monitoring your portfolio, Hubra provides the accurate, up-to-date token data you need to 
            stay ahead of the market.
          </p>
        </header>
        <div className="md:max-w-7xl mx-auto w-full">
          <Tokens
            fdvChange={totalFDVChange}
            newTokensCount={newTokensCount}
            solFDV={solFDV}
            solFDVChange={0}
            stablecoinTVL={globalStats.stablecoins_tvl}
            stablecoinTVLChange={globalStats.stablecoins_tvl_change}
            totalFDV={totalFDV}
            totalVolume={totalVolume}
          />
        </div>
        {/* HotTokens - full width background, content constrained internally */}
        <HotTokens
          initialGainers={gainersSorted.slice(0, TOKEN_LIMITS.HOT_TOKENS)}
          initialLosers={losersSorted.slice(0, TOKEN_LIMITS.HOT_TOKENS)}
          initialTrending={trendingTokens}
          initialVolume={volumeSorted.slice(0, TOKEN_LIMITS.HOT_TOKENS)}
        />
        <div className="md:max-w-7xl mx-auto w-full">
          {/* Pass full sorted data to AllTokens */}
          <AllTokens
            initialAllTokens={allAssetsSorted}
            initialGainers={gainersSorted}
            initialLosers={losersSorted}
            initialNewlyListed={newlyListedTokens}
          />
        </div>
      </main>
    </>
  );
}
