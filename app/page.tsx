import { Metadata } from "next";

import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Trust } from "@/components/landing/Trust";
import { Partners } from "@/components/landing/Partners";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { siteConfig } from "@/config/site";

const title = "Hubra (AI ARC) — Your Own AI DeFi Agent";
const description =
  "Hubra is an AI agent that manages your DeFi portfolio on Solana. It finds the best yields, moves your funds, and keeps optimizing — automatically. Self-custody, transparent, open source.";
const ogDescription =
  "Your Own AI DeFi Agent. Hubra watches your portfolio, finds the best yields, and moves your funds — automatically. Built on Solana.";
const canonical = siteConfig.domain;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI DeFi agent",
    "Solana AI agent",
    "automated DeFi",
    "yield optimization",
    "DeFi automation",
    "Solana",
    "Solana staking",
    "DeFi",
    "earn yield",
    "crypto portfolio",
    "auto rebalancing",
    "onchain agent",
    "SOL",
    "Solana ecosystem",
    "self-custody",
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
        alt: "Hubra (AI ARC) — Your Own AI DeFi Agent",
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
    <div className="flex flex-col">
      <header className="sr-only">
        <h1>Hubra (AI ARC) — Your Own AI DeFi Agent on Solana</h1>
      </header>
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <Trust />
      <Partners />
      <CTA />
      <Footer />
    </div>
  );
}
