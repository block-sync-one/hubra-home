import { Metadata } from "next";

import { siteConfig } from "@/config/site";

const title = "Cryptocurrency Prices | Live Solana Token Market Data | Hubra";
const description =
  "Track real-time Solana cryptocurrency prices, market cap, trading volume, and price changes. Explore hot tokens, top gainers, losers, and trading volume on the Solana blockchain. Comprehensive token analytics for the Solana ecosystem.";
const ogTitle = "Live Solana Token Prices & Market Data | Hubra";
const ogDescription =
  "Track real-time Solana token prices, market trends, and trading data. Discover hot tokens, gainers, and losers on the Solana blockchain.";
const twitterTitle = "Live Solana Token Prices | Hubra";
const twitterDescription = "Track real-time Solana cryptocurrency prices, market cap, and trading volume.";
const canonical = `${siteConfig.domain}/tokens`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "solana tokens",
    "solana",
    "solana blockchain",
    "crypto prices",
    "cryptocurrency market",
    "token prices",
    "crypto trading",
    "market cap",
    "trading volume",
    "hot tokens",
    "crypto gainers",
    "crypto losers",
    "birdeye",
    "defi",
    "solana ecosystem",
    "wallet portfolio",
    "token portfolio",
  ],
  openGraph: {
    title: ogTitle,
    description: ogDescription,
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
    title: twitterTitle,
    description: twitterDescription,
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
