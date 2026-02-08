import { Metadata } from "next";

import { HeroSection2026, FeaturesGrid2026 } from "@/components/homepage-2026";
import { siteConfig } from "@/config/site";

// Updated metadata for 2026 rebrand - "Trust UX" positioning
const title = "Hubra - Your assets. Real yields. No middlemen.";
const description =
  "Deposit. Earn. Withdraw anytime. That's it. Hubra makes DeFi simple — no gas fees, no seed phrases, just your money growing.";
const ogDescription = "Your assets. Real yields. No middlemen. The simplest way to earn on your money.";
const canonical = siteConfig.domain;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "earn yield",
    "passive income",
    "high yield savings",
    "DeFi",
    "DeFi earn",
    "no gas fees",
    "easy crypto",
    "Solana",
    "Solana staking",
    "wallet portfolio",
    "cryptocurrency",
    "crypto trading",
    "SOL",
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
        alt: "Hubra - Your assets. Real yields. No middlemen.",
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
      <main className="w-full flex flex-col">
        <header className="sr-only">
          <h1>Hubra - Your assets. Real yields. No middlemen.</h1>
        </header>

        {/* Hero Section - Fintech Clean 2026 */}
        <HeroSection2026 />

        {/* Features Grid - 4-card layout */}
        <FeaturesGrid2026 />

        {/* TODO: How It Works section (pending copy from Seeker) */}
        {/* TODO: Security section (pending copy from Seeker) */}
        {/* TODO: Final CTA section */}
      </main>
    </>
  );
}
