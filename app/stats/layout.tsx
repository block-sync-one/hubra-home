import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = generateMetadata({
  title: "Stats",
  description: "Real-time Solana blockchain statistics and analytics. Track network performance, transaction volumes, validator data, and ecosystem metrics.",
  keywords: ["Solana stats", "blockchain analytics", "SOL statistics", "network metrics", "validator data", "transaction volume"],
  canonicalUrl: `${siteConfig.url}/stats`,
});

export default function StatsLayout({
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
