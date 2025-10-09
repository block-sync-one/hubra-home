import { Metadata } from "next";

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
