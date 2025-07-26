import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = generateMetadata({
  title: "DeFi",
  description: "Explore the best DeFi protocols on Solana. Access lending, borrowing, yield farming, and decentralized trading opportunities in the Solana ecosystem.",
  keywords: ["DeFi", "Solana DeFi", "decentralized finance", "lending", "borrowing", "yield farming", "liquidity pools", "DEX"],
  canonicalUrl: `${siteConfig.url}/defi`,
});

export default function DefiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
