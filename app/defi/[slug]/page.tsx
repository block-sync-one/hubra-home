import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

import { Suspense } from "react";

import { StatsGrid } from "../components/stats-grid";

import { ProtocolBreadcrumb } from "./ProtocolBreadcrumb";
import { KeyMetricsSection } from "./KeyMetricsSection";
import { formatTokenAddress, getTokenSymbol, getTokenDisplayValue } from "./helpers";

import { fetchProtocolWithResolution } from "@/lib/data/defi-data";
import { siteConfig } from "@/config/site";
import { getBreadcrumbJsonLdString } from "@/lib/utils/structured-data";
import ChartPnl, { Chart } from "@/components/chart";
import { formatCurrency } from "@/lib/utils/helper";

type PageParams = {
  slug: string;
};

const getCachedProtocolResolution = cache(fetchProtocolWithResolution);

function formatTvl(tvl: number): string {
  return tvl >= 1e9 ? `$${(tvl / 1e9).toFixed(2)}B` : `$${(tvl / 1e6).toFixed(2)}M`;
}

function formatChange(change?: number): string {
  const value = change ?? 0;

  return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
}

interface StatItem {
  name: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  url?: string;
  isExternal?: boolean;
  subtitle?: string;
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const resolution = await getCachedProtocolResolution(slug);

  if (!resolution) {
    return {
      title: "Protocol Not Found",
      description: "The requested protocol could not be found.",
    };
  }

  const protocol = resolution.protocol;

  const protocolName = protocol.name || "Protocol";
  const protocolTvl = protocol.tvl || 0;
  const tvlFormatted = formatTvl(protocolTvl);
  const changeText = formatChange(protocol.change1D);
  const protocolUrl = `${siteConfig.domain}/defi/${slug}`;
  const baseDescription = `${protocolName} is a DeFi protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`;
  const protocolDescription = protocol.description
    ? `${protocol.description} ${baseDescription}`
    : baseDescription.replace("DeFi protocol", "decentralized finance (DeFi) protocol");

  return {
    title: `${protocolName} DeFi Protocol | TVL ${tvlFormatted} ${changeText} | Hubra - Solana DeFi Tracker`,
    description: protocolDescription,
    keywords: [
      protocolName,
      `${protocolName} DeFi`,
      `${protocolName} protocol`,
      "Solana DeFi",
      "DeFi protocol",
      "TVL tracking",
      "protocol analytics",
      "Solana blockchain",
      "DeFi yield",
      "DeFi metrics",
      "protocol performance",
    ],
    alternates: {
      canonical: protocolUrl,
    },
    openGraph: {
      title: `${protocolName} DeFi Protocol | TVL ${tvlFormatted} ${changeText}`,
      description: protocolDescription,
      type: "website",
      url: protocolUrl,
      siteName: "Hubra",
      images: protocol.logo
        ? [
            {
              url: protocol.logo,
              width: 1200,
              height: 630,
              alt: `${protocolName} Logo`,
            },
          ]
        : [
            {
              url: siteConfig.ogImage,
              width: 1200,
              height: 630,
              alt: `${protocolName} DeFi Protocol`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${protocolName} DeFi Protocol | TVL ${tvlFormatted}`,
      description: `${protocolName} TVL ${tvlFormatted} ${changeText}. Live DeFi protocol data on Hubra.`,
      images: protocol.logo ? [protocol.logo] : [siteConfig.ogImage],
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
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const resolution = await getCachedProtocolResolution(slug);

  if (!resolution) {
    notFound();
  }

  const { protocol } = resolution;
  const protocolSlug = protocol.slug || protocol.id;

  // Transform TVL chart data to Chart component format (memoized formatter)
  const tvlChartData: Chart["chartData"] = protocol.tvlChartData
    ? protocol.tvlChartData.map((point: { date: number; totalLiquidityUSD: number }) => ({
        date: dateFormatter.format(new Date(point.date * 1000)),
        value: point.totalLiquidityUSD,
      }))
    : [];

  const chartData: Chart[] = [
    {
      key: "tvl",
      title: "TVL",
      value: protocol.tvl || 0,
      suffix: "$",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "TVL",
      toolTip2Title: "",
      change: `${protocol.change1D?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.change1D || 0) >= 0 ? "positive" : "negative",
      chartData: tvlChartData,
    },
  ];

  if (protocol.feesRevenueChartData && protocol.feesRevenueChartData.length > 0) {
    chartData.push({
      key: "fees-revenue",
      title: "24h Fees & Revenue",
      value: protocol.totalFees_1d || 0,
      suffix: "$",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "Fees",
      toolTip2Title: "Revenue",
      change: `${protocol.feesChange_1d?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.feesChange_1d || 0) >= 0 ? "positive" : "negative",
      chartData: protocol.feesRevenueChartData,
    });
  }

  // Transform protocol data to match StatsGrid expected format
  const statsData: StatItem[] = [
    {
      name: "TVL",
      value: formatCurrency(protocol.tvl || 0, true),
      icon: "solar:lock-bold",
      change: `${protocol.change1D?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.change1D || 0) >= 0 ? "positive" : "negative",
    },
    {
      name: "7d Change",
      value: `${protocol.change7D?.toFixed(2) || "0.00"}%`,
      icon: "solar:chart-bold",
      changeType: (protocol.change7D || 0) >= 0 ? "positive" : "negative",
    },
  ];

  // Add Official Token card if symbol or address is available
  const tokenAddress = protocol.address;
  const tokenSymbol = getTokenSymbol(protocol);

  // Show card if we have either address or symbol
  if (tokenAddress || tokenSymbol) {
    const addressDisplay = tokenAddress ? formatTokenAddress(tokenAddress) : undefined;
    const displayValue = getTokenDisplayValue(tokenSymbol);

    statsData.push({
      name: "Official Token",
      value: displayValue,
      subtitle: addressDisplay,
      icon: "lucide:external-link",
      url: tokenAddress ? `/tokens/${tokenAddress}` : undefined,
      isExternal: false,
    });
  }

  function buildSocialLinks(): StatItem[] {
    const links: StatItem[] = [];

    if (protocol.twitter) {
      const twitterHandle = protocol.twitter.replace(/^https?:\/\/twitter\.com\//, "").replace(/^@/, "");

      links.push({
        name: "Twitter",
        value: twitterHandle,
        icon: "simple-icons:x",
        url: protocol.twitter.startsWith("http") ? protocol.twitter : `https://twitter.com/${twitterHandle}`,
        isExternal: true,
      });
    }

    if (protocol.url) {
      try {
        const urlStr = protocol.url.startsWith("http") ? protocol.url : `https://${protocol.url}`;
        const urlObj = new URL(urlStr);

        links.push({
          name: "Website",
          value: urlObj.hostname.replace("www.", ""),
          icon: "lucide:globe",
          url: urlObj.href,
          isExternal: true,
        });
      } catch {
        const cleanUrl = protocol.url.replace(/^https?:\/\//, "").replace(/^www\./, "");

        links.push({
          name: "Website",
          value: cleanUrl,
          icon: "lucide:globe",
          url: protocol.url.startsWith("http") ? protocol.url : `https://${protocol.url}`,
          isExternal: true,
        });
      }
    }

    if (protocol.github) {
      const githubUrl = Array.isArray(protocol.github) ? protocol.github[0] : protocol.github;

      if (githubUrl) {
        links.push({
          name: "GitHub",
          value: "Repo",
          icon: "mdi:github",
          url: githubUrl.startsWith("http") ? githubUrl : `https://github.com/${githubUrl}`,
          isExternal: true,
        });
      }
    }

    return links;
  }

  const socialLinks = buildSocialLinks();

  const tvlFormatted = formatTvl(protocol.tvl || 0);
  const changeText = formatChange(protocol.change1D);
  const baseDesc = `${protocol.name} is a DeFi protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`;
  const enhancedDescription = protocol.description
    ? `${protocol.description} ${baseDesc}`
    : baseDesc.replace("DeFi protocol", "decentralized finance (DeFi) protocol");

  const protocolJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": protocol.name,
    "alternateName": protocol.name,
    "description": enhancedDescription,
    "image": protocol.logo || siteConfig.ogImage,
    "url": `${siteConfig.domain}/defi/${slug}`,
    "brand": {
      "@type": "Brand",
      "name": "Solana",
      "description": "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today.",
    },
    "provider": {
      "@type": "Organization",
      "name": protocol.name,
      "url": protocol.url || `${siteConfig.domain}/defi/${slug}`,
    },
    "category": "DeFi Protocol",
    "about": {
      "@type": "Blockchain",
      "name": "Solana",
      "description": "Solana blockchain ecosystem including DeFi protocols, staking, and token analytics",
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Total Value Locked",
        "value": tvlFormatted,
      },
      {
        "@type": "PropertyValue",
        "name": "24h Change",
        "value": changeText,
      },
      {
        "@type": "PropertyValue",
        "name": "Blockchain",
        "value": "Solana",
      },
      ...(protocol.change7D !== undefined
        ? [
            {
              "@type": "PropertyValue",
              "name": "7d Change",
              "value": `${protocol.change7D >= 0 ? "+" : ""}${protocol.change7D.toFixed(2)}%`,
            },
          ]
        : []),
    ],
  };

  const breadcrumbJsonLdString = getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "DeFi", url: `${siteConfig.domain}/defi` },
    { name: protocol.name, url: `${siteConfig.domain}/defi/${slug}` },
  ]);

  const protocolJsonLdString = JSON.stringify(protocolJsonLd);

  return (
    <main className="flex flex-col gap-8 overflow-x-hidden">
      <script dangerouslySetInnerHTML={{ __html: protocolJsonLdString }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} defer type="application/ld+json" />
      <div className="md:max-w-7xl mx-auto w-full px-0 sm:px-0">
        {/* Breadcrumb Navigation */}
        <ProtocolBreadcrumb protocolName={protocol.name} />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-shrink-0 h-14 w-14 overflow-hidden rounded-full bg-transparent flex items-center justify-center">
            <Image
              alt={protocol.name || "Protocol logo"}
              className="h-full w-full object-cover"
              height={56}
              src={protocol.logo || "/logo.svg"}
              style={{ aspectRatio: "1/1" }}
              width={56}
            />
          </div>

          <div className="flex-1 text-left">
            <h1 className="text-2xl font-bold mb-1 text-white">{protocol.name}</h1>
            <p className="text-gray-400 line-clamp-2 max-w-2xl">{protocol.description || ""}</p>

            {/* Social links in header */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    href={link.url || "#"}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={link.name}>
                    <Icon icon={link.icon} width={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Aggregate Chart Section */}
        <div className="mb-6">
          <ChartPnl charts={chartData} title="Aggregate Performance" />
        </div>

        {/* Protocol Statistics */}
        <div className="mb-8">
          <StatsGrid stats={statsData} title="Protocol Metrics" />
        </div>

        {/* Key Metrics for Child/Other Protocols */}
        <Suspense fallback={<div className="mb-8">Loading child protocols...</div>}>
          <KeyMetricsSection otherProtocols={protocol.otherProtocols} protocolSlug={protocolSlug} />
        </Suspense>
      </div>
    </main>
  );
}
