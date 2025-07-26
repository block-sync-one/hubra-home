import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stay updated with the latest Solana and DeFi news, tutorials, and insights. Learn about blockchain technology, crypto trading, and Web3 developments.",
  keywords: ["Solana blog", "DeFi news", "crypto education", "blockchain tutorials", "Web3 insights", "cryptocurrency news"],
  openGraph: {
    title: "Blog",
    description: "Stay updated with the latest Solana and DeFi news, tutorials, and insights. Learn about blockchain technology, crypto trading, and Web3 developments.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Stay updated with the latest Solana and DeFi news, tutorials, and insights. Learn about blockchain technology, crypto trading, and Web3 developments.",
  },
};

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
