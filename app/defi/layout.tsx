import { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "DeFi",
  description:
    "Explore the best DeFi protocols on Solana. Access lending, borrowing, yield farming, and decentralized trading opportunities in the Solana ecosystem.",
  keywords: ["DeFi", "Solana DeFi", "decentralized finance", "lending", "borrowing", "yield farming", "liquidity pools", "DEX"],
  alternates: {
    canonical: `${siteConfig.url}/defi`,
  },
  openGraph: {
    title: "DeFi",
    description:
      "Explore the best DeFi protocols on Solana. Access lending, borrowing, yield farming, and decentralized trading opportunities in the Solana ecosystem.",
    url: `${siteConfig.url}/defi`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeFi",
    description:
      "Explore the best DeFi protocols on Solana. Access lending, borrowing, yield farming, and decentralized trading opportunities in the Solana ecosystem.",
  },
};

export default function DefiLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">{children}</div>
    </section>
  );
}
