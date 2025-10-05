import { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "Real-time Solana blockchain statistics and analytics. Track network performance, transaction volumes, validator data, and ecosystem metrics.",
  keywords: ["Solana stats", "blockchain analytics", "SOL statistics", "network metrics", "validator data", "transaction volume"],
  openGraph: {
    title: "Stats",
    description:
      "Real-time Solana blockchain statistics and analytics. Track network performance, transaction volumes, validator data, and ecosystem metrics.",
    url: `${siteConfig.url}/stats`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stats",
    description:
      "Real-time Solana blockchain statistics and analytics. Track network performance, transaction volumes, validator data, and ecosystem metrics.",
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">{children}</div>
    </section>
  );
}
