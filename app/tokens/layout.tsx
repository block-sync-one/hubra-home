import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Tokens",
  description: "Discover and track Solana tokens. Get real-time prices, market cap, trading volume, and comprehensive analytics for all SOL ecosystem tokens.",
  keywords: ["Solana tokens", "SOL", "cryptocurrency prices", "token analytics", "crypto market data", "SPL tokens"],
  openGraph: {
    title: "Tokens",
    description: "Discover and track Solana tokens. Get real-time prices, market cap, trading volume, and comprehensive analytics for all SOL ecosystem tokens.",
    url: `${siteConfig.url}/tokens`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokens",
    description: "Discover and track Solana tokens. Get real-time prices, market cap, trading volume, and comprehensive analytics for all SOL ecosystem tokens.",
  },
};

export default function TokensLayout({
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
