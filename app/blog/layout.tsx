import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = generateMetadata({
  title: "Blog",
  description: "Stay updated with the latest Solana and DeFi news, tutorials, and insights. Learn about blockchain technology, crypto trading, and Web3 developments.",
  keywords: ["Solana blog", "DeFi news", "crypto education", "blockchain tutorials", "Web3 insights", "cryptocurrency news"],
  canonicalUrl: `${siteConfig.url}/blog`,
  ogType: "article",
});

export default function BlogLayout({
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
