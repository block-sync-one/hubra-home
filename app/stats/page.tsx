import { Metadata } from "next";

import { title as titleStyle } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { COMMON_BREADCRUMBS, getWebPageJsonLd, getDatasetJsonLd } from "@/lib/utils/structured-data";

const title = "Statistics & Analytics | Hubra - Solana Market Data";
const description =
  "View comprehensive Solana blockchain statistics, market analytics, validator performance data, and network metrics. Track TVL, trading volume, DeFi protocol data, validator uptime, staking rewards, and network health on the Solana blockchain.";
const ogTitle = "Statistics & Analytics | Hubra";
const ogDescription = "View comprehensive Solana blockchain statistics, market analytics, and performance metrics.";
const twitterTitle = "Statistics & Analytics | Hubra";
const canonical = `${siteConfig.domain}/stats`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana statistics",
    "Solana validator",
    "Solana validators",
    "validator performance",
    "Solana staking",
    "blockchain analytics",
    "crypto metrics",
    "market data",
    "DeFi analytics",
    "Solana TVL",
    "trading statistics",
    "validator data",
    "network metrics",
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    type: "website",
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage || "/hubra-og-image.png",
        width: 1200,
        height: 630,
        alt: "Hubra Statistics & Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: twitterTitle,
    description: ogDescription,
    images: [siteConfig.ogImage || "/hubra-og-image.png"],
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

export default function StatsPage() {
  const webpageJsonLd = getWebPageJsonLd(
    "Statistics & Analytics",
    "Comprehensive Solana blockchain statistics and market analytics",
    `${siteConfig.domain}/stats`,
    [
      { name: "Home", url: siteConfig.domain },
      { name: "Stats", url: `${siteConfig.domain}/stats` },
    ]
  );

  const datasetJsonLd = getDatasetJsonLd({
    name: "Solana Blockchain Statistics & Market Analytics",
    description:
      "Comprehensive dataset of Solana blockchain statistics including TVL, trading volume, market cap, DeFi protocol metrics, and real-time market analytics",
    url: `${siteConfig.domain}/stats`,
    keywords: [
      "Solana statistics",
      "Solana validator",
      "validator performance",
      "Solana staking",
      "blockchain analytics",
      "crypto metrics",
      "market data",
      "DeFi analytics",
      "TVL data",
      "trading statistics",
      "validator data",
      "network metrics",
    ],
    creator: {
      name: siteConfig.name,
      url: siteConfig.domain,
    },
    datePublished: "2024-01-01",
    license: "https://creativecommons.org/licenses/by/4.0/",
  });

  const webpageJsonLdString = JSON.stringify(webpageJsonLd);
  const datasetJsonLdString = JSON.stringify(datasetJsonLd);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: COMMON_BREADCRUMBS.stats }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: webpageJsonLdString }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: datasetJsonLdString }} defer type="application/ld+json" />
      <div>
        <h1 className={titleStyle()}>Statistics & Analytics</h1>
      </div>
    </>
  );
}
