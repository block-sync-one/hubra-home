import { Metadata } from "next";

import { siteConfig } from "@/config/site";

const title = "Tokens";
const description =
  "Discover and track Solana tokens. Get real-time prices, market cap, trading volume, and comprehensive analytics for all SOL ecosystem tokens.";
const canonical = `${siteConfig.welcomeUrl}/tokens`;

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Solana tokens", "SOL", "cryptocurrency prices", "token analytics", "crypto market data", "SPL tokens"],
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return <section className="py-6 md:py-11">{children}</section>;
}
