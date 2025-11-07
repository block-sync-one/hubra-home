import { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopProtocols } from "./components/top-protocols";
import { ProtocolsTable } from "./components/protocols-table";

import { fetchProtocolsData } from "@/lib/data/defi-data";
import ChartPnl, { Chart } from "@/components/chart";

export const metadata: Metadata = {
  title: "DeFi Statistics",
  description: "View detailed DeFi statistics and analytics about Solana protocols, TVL, and performance metrics.",
  keywords: [
    "Solana DeFi",
    "DeFi analytics",
    "crypto metrics",
    "blockchain analytics",
    "Hubra DeFi",
    "TVL tracking",
    "protocol performance",
    "DeFi metrics",
  ],
  openGraph: {
    title: "Hubra DeFi Statistics & Analytics",
    description: "View detailed DeFi statistics and analytics about Solana protocols, TVL, and performance metrics.",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Hubra DeFi Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubra DeFi Statistics & Analytics",
    description: "View detailed DeFi statistics and analytics about Solana protocols, TVL, and performance metrics.",
    images: ["/logo.jpg"],
  },
};

export default async function DeFiPage() {
  // Fetch DeFi protocols data (with Redis caching)
  const protocols = await fetchProtocolsData();

  // Check if we have valid data
  if (!protocols || protocols.numberOfProtocols === 0) {
    notFound();
  }
  const chartData: Chart[] = [
    {
      key: "tvl",
      title: "TVL",
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
      title: "Inflows",
      value: protocols.totalFees_1d,
      suffix: "",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "fees",
      toolTip2Title: "revenue",
      change: `${protocols.inflows.change_1d.toFixed(2)}%`,
      changeType: protocols.inflows.change_1d >= 0 ? "positive" : "negative",
      chartData: protocols.inflows.chartData,
    },
  ];

  return (
    <main>
      <div className="md:max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Solana DeFi Ecosystem</h1>
          <p className="text-sm text-gray-400">Track real-time DeFi metrics and protocol performance on Solana</p>
        </div>

        <div className="flex flex-col gap-12">
          <ChartPnl charts={chartData} title="DeFi TVL" />
          <TopProtocols protocols={protocols.hotProtocols} />
          <ProtocolsTable protocols={protocols.solanaProtocols} />
        </div>
      </div>
    </main>
  );
}
