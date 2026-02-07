import { Metadata } from "next";

import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/homepage-2026";
import { siteConfig } from "@/config/site";

const title = "Hubra — The easiest way to earn on Solana";
const description =
  "Connect with email or wallet. Earn yield across DeFi. No gas fees, no complexity. Social login, gasless transactions, and the best rates aggregated.";
const ogDescription =
  "DeFi without the friction. Sign in with email, earn yield on Solana, pay no gas. It's that simple.";
const canonical = siteConfig.domain;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana",
    "Solana DeFi",
    "earn yield",
    "DeFi yield aggregator",
    "gasless transactions",
    "social login crypto",
    "embedded wallet",
    "Solana staking",
    "crypto earn",
    "DeFi made easy",
    "SOL",
    "USDC yield",
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
        alt: "Hubra — The easiest way to earn on Solana",
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
    <main 
      className="w-full min-h-screen"
      style={{ backgroundColor: "#0D0D0F" }}
    >
      <header className="sr-only">
        <h1>Hubra — The easiest way to earn on Solana</h1>
      </header>
      
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
