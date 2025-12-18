import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopProtocols } from "./components/top-protocols";
import { ProtocolsTable } from "./components/protocols-table";

import { fetchProtocolsData } from "@/lib/data/defi-data";
import ChartPnl, { Chart } from "@/components/chart";
import { siteConfig } from "@/config/site";
import { getWebPageJsonLd, getCollectionPageJsonLd } from "@/lib/utils/structured-data";

const title = "Solana DeFi Protocols & Analytics | Hubra - TVL Tracking & Protocol Performance";
const description = "Find the best DeFi opportunities to earn yield, maximize returns, and grow your crypto portfolio on Solana.";
const canonical = `${siteConfig.domain}/defi`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana DeFi",
    "DeFi earn",
    "DeFi yield",
    "earn DeFi",
    "yield farming",
    "DeFi protocols",
    "Solana",
    "Solana blockchain",
    "DeFi analytics",
    "TVL tracking",
    "Solana TVL",
    "DeFi metrics",
    "protocol performance",
    "DeFi statistics",
    "blockchain analytics",
    "crypto metrics",
    "Solana ecosystem",
    "DeFi opportunities",
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: canonical,
    siteName: "Hubra",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Hubra DeFi Dashboard - Solana Protocol Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
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

export const revalidate = 300; // 5 minutes

export default async function DeFiPage() {
  const perfStart = performance.now();

  const protocols = await fetchProtocolsData();

  const perfDuration = performance.now() - perfStart;

  if (process.env.NODE_ENV === "development") {
    console.log(`📊 DeFi page data fetch: ${perfDuration.toFixed(0)}ms`);
  }

  if (!protocols || protocols.numberOfProtocols === 0) {
    notFound();
  }

  const defiPageJsonLd = getWebPageJsonLd(
    "Solana DeFi Protocols & Analytics",
    "Comprehensive DeFi protocol analytics and TVL tracking for Solana blockchain",
    `${siteConfig.domain}/defi`,
    [
      { name: "Home", url: siteConfig.domain },
      { name: "DeFi", url: `${siteConfig.domain}/defi` },
    ]
  );

  const collectionJsonLd = getCollectionPageJsonLd(
    "Solana DeFi Protocols",
    `Explore ${protocols.numberOfProtocols} DeFi protocols on Solana with total TVL of $${(protocols.totalTvl / 1e9).toFixed(2)}B`,
    protocols.numberOfProtocols
  );
  const chartData: Chart[] = [
    {
      key: "tvl",
      title: "24h TVL",
      value: protocols.totalTvl,
      suffix: "",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "TVL",
      toolTip2Title: "",
      change: `${protocols.change1D.toFixed(2)}%`,
      changeType: protocols.change1D >= 0 ? "positive" : "negative",
      chartData: protocols.chartData,
    },
    {
      key: "inflows",
      title: "24h Inflows",
      value: protocols.totalFees_1d,
      suffix: "",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "Fees",
      toolTip2Title: "Revenue",
      change: `${protocols.inflows.change_1d.toFixed(2)}%`,
      changeType: protocols.inflows.change_1d >= 0 ? "positive" : "negative",
      chartData: protocols.inflows.chartData,
    },
  ];

  const defiPageJsonLdString = JSON.stringify(defiPageJsonLd);
  const collectionJsonLdString = JSON.stringify(collectionJsonLd);

  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: defiPageJsonLdString }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: collectionJsonLdString }} defer type="application/ld+json" />
      <div className="md:max-w-7xl mx-auto">
        <header className="mb-6 sr-only">
          <h1 className="text-2xl font-bold text-white mb-1">Solana DeFi Ecosystem</h1>
          <p className="text-sm text-gray-400">Track real-time DeFi metrics and protocol performance on Solana</p>
        </header>

        <section className="flex flex-col gap-12">
          <ChartPnl charts={chartData} title="DeFi TVL" />
          <TopProtocols protocols={protocols.hotProtocols} />
          <ProtocolsTable protocols={protocols.solanaProtocols} />
        </section>
      </div>
    </main>
  );
}
