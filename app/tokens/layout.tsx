import { Metadata } from "next";

import { siteConfig } from "@/config/site";

const title = "Solana Token Prices | Live Crypto Market Data | Hubra";
const description =
  "Live Solana token prices and market data. Track SOL, JUP, RAY, BONK, memecoins, and 100+ tokens with real-time charts and market caps.";
const canonical = `${siteConfig.domain}/tokens`;

export const metadata: Metadata = {
  title,
  description,
  keywords: ["solana token prices", "solana tokens", "sol price", "crypto prices", "solana market data", "SPL tokens"],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage || "/hubra-og-image.png",
        width: 1200,
        height: 630,
        alt: "Hubra - Solana Token Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return <section className="container">{children}</section>;
}
