import { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { TOKEN_ANALYTICS_JSON_LD_STRING } from "@/lib/utils/structured-data";

interface TokenLayoutProps {
  children: React.ReactNode;
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ address: string }> }): Promise<Metadata> {
  const { address } = await params;

  return {
    metadataBase: new URL(siteConfig.domain),
    title: `Token Details | Hubra - DeFi Analytics Platform`,
    description: `View detailed analytics, price charts, and trading information for token on Hubra. Track market cap, volume, and trading data.`,
    keywords: [
      "cryptocurrency",
      "token analytics",
      "DeFi",
      "trading",
      "market data",
      "price chart",
      "volume analysis",
      "Solana",
      "SOL",
      "blockchain",
      "blockchain analytics",
      "crypto trading",
      "crypto portfolio",
      "Web3",
      "DeFi",
      "Hubra",
    ],
    openGraph: {
      title: `Token Details | Hubra`,
      description: `View detailed analytics and trading information for token`,
      type: "website",
      siteName: "Hubra",
      url: `${siteConfig.domain}/tokens/${address}`,
      images: [
        {
          url: siteConfig.ogImage || "/hubra-og-image.png",
          width: 1200,
          height: 630,
          alt: "Hubra Token Analytics",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Token Details | Hubra`,
      description: `View detailed analytics and trading information for token`,
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
    alternates: {
      canonical: `${siteConfig.domain}/tokens/${address}`,
    },
  };
}

export default function TokenLayout({ children }: TokenLayoutProps) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: TOKEN_ANALYTICS_JSON_LD_STRING,
        }}
        defer
        type="application/ld+json"
      />
      {children}
    </>
  );
}
