import { Metadata } from "next";

import {
  HeroSection,
  ProductsSection,
  RasolSection,
  TrustSection,
  CtaSection,
} from "@/components/homepage-2026";
import { siteConfig } from "@/config/site";

const title = "Hubra - The Power of CEX. The Freedom of DeFi.";
const description =
  "Trade, stake, and earn on Solana — all in one place. Gasless transactions, multi-wallet portfolio tracking, and the best yields from top protocols.";
const ogDescription =
  "Your Solana all-in-one portal. Trade, stake, and earn with CEX-grade experience and DeFi freedom.";
const canonical = siteConfig.domain;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana",
    "Solana staking",
    "DeFi",
    "DeFi earn",
    "earn yield",
    "raSOL",
    "liquid staking",
    "wallet portfolio",
    "cryptocurrency",
    "token swap",
    "Solana tokens",
    "DeFi protocols",
    "crypto trading",
    "SOL",
    "Solana ecosystem",
    "gasless transactions",
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description: ogDescription,
    type: "website",
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage || "/hubra-og-image.png",
        width: 1200,
        height: 630,
        alt: "Hubra - The Power of CEX. The Freedom of DeFi.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: ogDescription,
    images: [siteConfig.ogImage || "/hubra-og-image.png"],
    creator: siteConfig.twitter?.handle,
    site: siteConfig.twitter?.site,
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

export default function Home() {
  return (
    <main className="w-full">
      <header className="sr-only">
        <h1>Hubra - The Power of CEX. The Freedom of DeFi.</h1>
      </header>
      
      <HeroSection />
      <ProductsSection />
      <RasolSection />
      <TrustSection />
      <CtaSection />
    </main>
  );
}
