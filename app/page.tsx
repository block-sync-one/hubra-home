import { Metadata } from "next";

import { HeroSection } from "@/components/HeroSection";
import { MainContentSection } from "@/components/MainContent";
import { siteConfig } from "@/config/site";

const title = "Hubra - Trade, stake, and earn with the best yields - never miss a trend, all in one.";
const description =
  "Hubra steps directly into this gap by blending TradFi-level usability with DeFi principles. Gasless operations, curated earning opportunities from top Solana protocols like Kamino, Jupiter, and Lulo; multi-wallet visibility under a single account; and selective, quality-first integrations to reduce risk and noise";
const ogDescription =
  "Your Solana all-in-one portal to the decentralized world. Track tokens, Earn yields, DeFi protocols, and market analytics with CEX-grade experience.";
const canonical = siteConfig.domain;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana",
    "Solana validator",
    "Solana staking",
    "DeFi",
    "DeFi earn",
    "earn yield",
    "wallet portfolio",
    "clean wallet portfolio",
    "cryptocurrency",
    "blockchain analytics",
    "token prices",
    "Solana tokens",
    "DeFi protocols",
    "crypto trading",
    "SOL",
    "Solana ecosystem",
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
        alt: "Hubra - Solana DeFi Analytics Platform",
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
    <>
      <section className="w-full flex flex-col items-center justify-center gap-20">
        <header className="sr-only">
          <h1>Hubra - Trade, stake, and earn with the best yields on Solana</h1>
        </header>
        <HeroSection />
        <MainContentSection />
      </section>
    </>
  );
}
