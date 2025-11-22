import { Metadata } from "next";

import { siteConfig } from "@/config/site";

const title = "Solana DeFi Protocols & Analytics | Hubra";
const description = "Find the best DeFi opportunities to earn yield, maximize returns, and grow your crypto portfolio on Solana.";
const canonical = `${siteConfig.domain}/defi`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana DeFi",
    "DeFi earn",
    "DeFi yield",
    "earn DeFi",
    "yield farming",
    "DeFi protocols",
    "Solana",
    "Solana blockchain",
    "DeFi analytics",
    "TVL tracking",
    "Solana TVL",
    "DeFi metrics",
    "protocol performance",
    "DeFi statistics",
    "blockchain analytics",
    "crypto metrics",
    "Solana ecosystem",
    "DeFi opportunities",
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: canonical,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Hubra DeFi Dashboard - Solana Protocol Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
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

export default function DeFiLayout({ children }: { children: React.ReactNode }) {
  return <section className="py-6 md:py-11">{children}</section>;
}
