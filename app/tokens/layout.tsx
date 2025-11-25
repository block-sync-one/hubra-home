import { Metadata } from "next";

import { siteConfig } from "@/config/site";

const title = "Tokens";
const description =
  "Discover and track Solana tokens. Get real-time prices, market cap, trading volume, and comprehensive analytics for all SOL ecosystem tokens.";
const canonical = `${siteConfig.domain}/tokens`;

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Solana tokens", "SOL", "cryptocurrency prices", "token analytics", "crypto market data", "SPL tokens"],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage || "/hubra-og-image.png",
        width: 1200,
        height: 630,
        alt: "Hubra - Solana Token Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage || "/hubra-og-image.png"],
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

export default function TokensLayout({ children }: { children: React.ReactNode }) {
  return <section className="py-6 md:py-11">{children}</section>;
}
