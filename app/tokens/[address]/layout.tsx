import { Metadata } from "next";

interface TokenLayoutProps {
  children: React.ReactNode;
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;

  return {
    metadataBase: new URL("https://hubra.app"),
    title: `${symbol} Token Details | Hubra - DeFi Analytics Platform`,
    description: `View detailed analytics, price charts, and trading information for ${symbol} token on Hubra. Track market cap, volume, and trading data.`,
    keywords: [
      symbol,
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
      title: `${symbol} Token Details | Hubra`,
      description: `View detailed analytics and trading information for ${symbol} token`,
      type: "website",
      siteName: "Hubra",
    },
    twitter: {
      card: "summary_large_image",
      title: `${symbol} Token Details | Hubra`,
      description: `View detailed analytics and trading information for ${symbol} token`,
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
      canonical: `/tokens/${symbol}`,
    },
  };
}

export default function TokenLayout({ children }: TokenLayoutProps) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Token Analytics",
            "description": "Cryptocurrency token analytics and trading data",
            "provider": {
              "@type": "Organization",
              "name": "Hubra",
              "url": "https://hubra.app",
            },
            "category": "Cryptocurrency",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
            },
          }),
        }}
        type="application/ld+json"
      />
      {children}
    </>
  );
}
