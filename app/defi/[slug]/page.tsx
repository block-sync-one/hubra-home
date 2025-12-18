import React, { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { StatsGrid } from "../components/stats-grid";
import { ProtocolOption } from "../protocol-options";

import { ProtocolBreadcrumb } from "./ProtocolBreadcrumb";
import { ProtocolSelector } from "./ProtocolSelector";

import { fetchProtocolData, deriveProtocolSlugFromName } from "@/lib/data/defi-data";
import { siteConfig } from "@/config/site";
import { getBreadcrumbJsonLdString } from "@/lib/utils/structured-data";
import ChartPnl, { Chart } from "@/components/chart";
import { formatCurrency } from "@/lib/utils/helper";

type PageParams = {
  slug: string;
};

/**
 * Cached protocol data fetcher - ensures single fetch per request
 */
const getCachedProtocolData = cache(async (slug: string) => {
  return await fetchProtocolData(slug);
});

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const protocol = await getCachedProtocolData(slug);

  if (!protocol) {
    return {
      title: "Protocol Not Found",
      description: "The requested protocol could not be found.",
    };
  }

  const protocolName = protocol.name || "Protocol";
  const protocolTvl = protocol.tvl || 0;
  const tvlFormatted = protocolTvl >= 1e9 ? `$${(protocolTvl / 1e9).toFixed(2)}B` : `$${(protocolTvl / 1e6).toFixed(2)}M`;
  const change1D = protocol.change1D || 0;
  const changeText = change1D >= 0 ? `+${change1D.toFixed(2)}%` : `${change1D.toFixed(2)}%`;
  const protocolUrl = `${siteConfig.domain}/defi/${slug}`;

  const protocolDescription = protocol.description
    ? `${protocol.description} ${protocolName} is a DeFi protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`
    : `${protocolName} is a decentralized finance (DeFi) protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`;

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
  const protocol = await getCachedProtocolData(slug);

  if (!protocol) {
    notFound();
  }

  const currentProtocolSlug = protocol.slug || protocol.id;
  const relatedProtocols = protocol.otherProtocols?.map((name) => ({
    name,
    slug: deriveProtocolSlugFromName(name),
  })) as ProtocolOption[];

  // Transform TVL chart data to Chart component format
  const tvlChartData: Chart["chartData"] = protocol.tvlChartData
    ? protocol.tvlChartData.map((point) => ({
        date: new Date(point.date * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        value: point.totalLiquidityUSD,
      }))
    : [];

  const chartData: Chart[] = [
    {
      key: "tvl",
      title: "24h TVL",
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

  // Define StatItem type to match the one in StatsGrid
  type StatItem = {
    name: string;
    value: string;
    icon: string;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    url?: string;
    isExternal?: boolean;
  };

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

  // Social links and other external metrics
  const socialLinks: StatItem[] = [];

  // Add Twitter if available
  if (protocol.twitter) {
    try {
      const twitterHandle = protocol.twitter.replace("https://twitter.com/", "").replace("@", "");

      socialLinks.push({
        name: "Twitter",
        value: twitterHandle,
        icon: "mdi:twitter",
        url: protocol.twitter.startsWith("http") ? protocol.twitter : `https://twitter.com/${twitterHandle}`,
        isExternal: true,
      });
    } catch (e) {
      // Handle error
    }
  }

  // Add Website if available
  if (protocol.url) {
    try {
      const urlObj = new URL(protocol.url.startsWith("http") ? protocol.url : `https://${protocol.url}`);
      const hostname = urlObj.hostname.replace("www.", "");

      socialLinks.push({
        name: "Website",
        value: hostname,
        icon: "solar:link-circle-bold",
        url: urlObj.href,
        isExternal: true,
      });
    } catch (e) {
      // Fallback if URL is invalid
      socialLinks.push({
        name: "Website",
        value: protocol.url.replace("https://", "").replace("http://", "").replace("www.", ""),
        icon: "solar:link-circle-bold",
        url: protocol.url.startsWith("http") ? protocol.url : `https://${protocol.url}`,
        isExternal: true,
      });
    }
  }

  // Add GitHub if available
  if (protocol.github) {
    try {
      let githubUrl = "";

      if (Array.isArray(protocol.github) && protocol.github.length > 0) {
        githubUrl = protocol.github[0];
      } else if (typeof protocol.github === "string") {
        githubUrl = protocol.github;
      }

      if (githubUrl) {
        socialLinks.push({
          name: "GitHub",
          value: "Repo",
          icon: "mdi:github",
          url: githubUrl.startsWith("http") ? githubUrl : `https://github.com/${githubUrl}`,
          isExternal: true,
        });
      }
    } catch (e) {
      // Fallback if URL is invalid
      if (typeof protocol.github === "string") {
        socialLinks.push({
          name: "GitHub",
          value: "Repo",
          icon: "mdi:github",
          url: protocol.github,
          isExternal: true,
        });
      }
    }
  }

  const protocolTvl = protocol.tvl || 0;
  const tvlFormatted = protocolTvl >= 1e9 ? `$${(protocolTvl / 1e9).toFixed(2)}B` : `$${(protocolTvl / 1e6).toFixed(2)}M`;
  const change1D = protocol.change1D || 0;
  const changeText = change1D >= 0 ? `+${change1D.toFixed(2)}%` : `${change1D.toFixed(2)}%`;

  const enhancedDescription = protocol.description
    ? `${protocol.description} ${protocol.name} is a DeFi protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`
    : `${protocol.name} is a decentralized finance (DeFi) protocol on the Solana blockchain with a total value locked (TVL) of ${tvlFormatted} (${changeText}). Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics on Hubra.`;

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
            <ProtocolSelector
              currentProtocol={{
                name: protocol.name,
                slug: currentProtocolSlug,
              }}
              relatedProtocols={relatedProtocols}
            />
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
      </div>
    </main>
  );
}
