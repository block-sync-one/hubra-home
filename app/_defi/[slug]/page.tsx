import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { StatsGrid } from "../components/stats-grid";

import { fetchProtocolData } from "@/lib/data/defi-data";
import { siteConfig } from "@/config/site";
import { getBreadcrumbJsonLdString } from "@/lib/utils/structured-data";
import ChartPnl, { Chart } from "@/components/chart";
import { formatCurrency } from "@/lib/utils/helper";

type PageParams = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const protocol = await fetchProtocolData(slug);
  const firstInBreakDown = protocol && protocol.breakdown[0];

  if (!protocol) {
    return {
      title: "Protocol Not Found",
      description: "The requested protocol could not be found.",
    };
  }

  const protocolName = protocol.name || "Protocol";
  const protocolDescription =
    firstInBreakDown?.description || `${protocolName} DeFi protocol on Solana blockchain. Track TVL, performance metrics, and analytics.`;
  const protocolUrl = `${siteConfig.domain}/defi/${slug}`;
  const tvlFormatted = protocol.tvl ? `$${(protocol.tvl / 1e6).toFixed(2)}M` : "";

  return {
    title: `${protocolName} DeFi Protocol | TVL ${tvlFormatted} | Hubra`,
    description: protocolDescription,
    keywords: [protocolName, "Solana DeFi", "DeFi protocol", "TVL tracking", "protocol analytics", "Solana blockchain"],
    alternates: {
      canonical: protocolUrl,
    },
    openGraph: {
      title: `${protocolName} DeFi Protocol | Hubra`,
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
              url: "/hubra-og-image.png",
              width: 1200,
              height: 630,
              alt: `${protocolName} DeFi Protocol`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${protocolName} DeFi Protocol | Hubra`,
      description: protocolDescription,
      images: protocol.logo ? [protocol.logo] : ["/hubra-og-image.png"],
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
  const protocolAggregate = await fetchProtocolData(slug);

  if (!protocolAggregate) {
    notFound();
  }

  const protocolDetail = protocolAggregate.breakdown?.[0];

  const chartData: Chart[] = [
    {
      key: "tvl",
      title: "TVL",
      value: protocolAggregate.tvl || 0,
      suffix: "$",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "TVL",
      toolTip2Title: "",
      change: `${protocolAggregate.change1D?.toFixed(2) || "0.00"}%`,
      changeType: (protocolAggregate.change1D || 0) >= 0 ? "positive" : "negative",
      chartData: [], // TODO: Add historical chart data
    },
  ];

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
      value: formatCurrency(protocolAggregate.tvl || 0, true),
      icon: "solar:lock-bold",
      change: `${protocolAggregate.change1D?.toFixed(2) || "0.00"}%`,
      changeType: (protocolAggregate.change1D || 0) >= 0 ? "positive" : "negative",
    },
    {
      name: "7d Change",
      value: `${protocolAggregate.change7D?.toFixed(2) || "0.00"}%`,
      icon: "solar:chart-bold",
      changeType: (protocolAggregate.change7D || 0) >= 0 ? "positive" : "negative",
    },
  ];

  // Social links and other external metrics (from breakdown detail)
  const socialLinks: StatItem[] = [];

  // Add Twitter if available
  if (protocolDetail?.twitter) {
    try {
      const twitterHandle = protocolDetail.twitter.replace("https://twitter.com/", "").replace("@", "");

      socialLinks.push({
        name: "Twitter",
        value: twitterHandle,
        icon: "mdi:twitter",
        url: protocolDetail.twitter.startsWith("http") ? protocolDetail.twitter : `https://twitter.com/${twitterHandle}`,
        isExternal: true,
      });
    } catch (e) {
      // Handle error
    }
  }

  // Add Website if available
  if (protocolDetail?.url) {
    try {
      const urlObj = new URL(protocolDetail.url.startsWith("http") ? protocolDetail.url : `https://${protocolDetail.url}`);
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
        value: protocolDetail.url.replace("https://", "").replace("http://", "").replace("www.", ""),
        icon: "solar:link-circle-bold",
        url: protocolDetail.url.startsWith("http") ? protocolDetail.url : `https://${protocolDetail.url}`,
        isExternal: true,
      });
    }
  }

  // Add GitHub if available
  const protocolAny = protocolDetail as any;

  if (protocolAny?.github) {
    try {
      let githubUrl = "";

      if (Array.isArray(protocolAny.github) && protocolAny.github.length > 0) {
        githubUrl = protocolAny.github[0];
      } else if (typeof protocolAny.github === "string") {
        githubUrl = protocolAny.github;
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
      if (typeof protocolAny.github === "string") {
        socialLinks.push({
          name: "GitHub",
          value: "Repo",
          icon: "mdi:github",
          url: protocolAny.github,
          isExternal: true,
        });
      }
    }
  }

  const protocolDescription =
    protocolDetail?.description ||
    `${protocolAggregate.name} is a decentralized finance (DeFi) protocol on the Solana blockchain with a total value locked (TVL) of $${(protocolAggregate.tvl / 1e9).toFixed(2)}B. Track protocol performance, TVL changes, fees, revenue, and comprehensive DeFi analytics.`;

  const protocolJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": protocolAggregate.name,
    "alternateName": protocolAggregate.name,
    "description": protocolDescription,
    "url": `${siteConfig.domain}/defi/${slug}`,
    "provider": {
      "@type": "Organization",
      "name": protocolAggregate.name,
      "url": protocolDetail?.url || `${siteConfig.domain}/defi/${slug}`,
    },
    "category": "DeFi Protocol",
    "about": {
      "@type": "FinancialProduct",
      "name": "DeFi",
      "description": "Decentralized Finance on Solana blockchain",
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Total Value Locked",
        "value": `$${(protocolAggregate.tvl / 1e9).toFixed(2)}B`,
      },
      {
        "@type": "PropertyValue",
        "name": "Blockchain",
        "value": "Solana",
      },
    ],
  };

  const breadcrumbJsonLdString = getBreadcrumbJsonLdString([
    { name: "Home", url: siteConfig.domain },
    { name: "DeFi", url: `${siteConfig.domain}/defi` },
    { name: protocolAggregate.name, url: `${siteConfig.domain}/defi/${slug}` },
  ]);

  const protocolJsonLdString = JSON.stringify(protocolJsonLd);

  return (
    <main className="flex flex-col gap-8 overflow-x-hidden">
      <script dangerouslySetInnerHTML={{ __html: protocolJsonLdString }} defer type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }} defer type="application/ld+json" />
      <div className="md:max-w-7xl mx-auto w-full px-0 sm:px-0">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-shrink-0 h-14 w-14 overflow-hidden rounded-full bg-transparent flex items-center justify-center">
            <Image
              alt={protocolAggregate.name || "Protocol logo"}
              className="h-full w-full object-cover"
              height={56}
              src={protocolAggregate.logo || "/logo.svg"}
              style={{ aspectRatio: "1/1" }}
              width={56}
            />
          </div>

          <div className="flex-1 text-left">
            <h1 className="text-2xl font-bold mb-1 text-white">{protocolAggregate.name}</h1>
            <p className="text-gray-400 line-clamp-2 max-w-2xl">{protocolDetail?.description || ""}</p>

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

        {/* Aggregate Statistics */}
        <div className="mb-8">
          <StatsGrid stats={statsData} title="Aggregate Metrics" />
        </div>

        {/* Breakdown Section - Show individual protocols */}
        {protocolAggregate.breakdown && protocolAggregate.breakdown.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Protocol Breakdown</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {protocolAggregate.breakdown.map((individualProtocol, index) => {
                const protocolStats: StatItem[] = [
                  {
                    name: "TVL",
                    value: formatCurrency(individualProtocol.tvl || 0, true),
                    icon: "solar:lock-bold",
                    change: `${individualProtocol.change1D?.toFixed(2) || "0.00"}%`,
                    changeType: (individualProtocol.change1D || 0) >= 0 ? "positive" : "negative",
                  },
                  {
                    name: "7d Change",
                    value: `${individualProtocol.change7D?.toFixed(2) || "0.00"}%`,
                    icon: "solar:chart-bold",
                    changeType: (individualProtocol.change7D || 0) >= 0 ? "positive" : "negative",
                  },
                ];

                return (
                  <div key={individualProtocol.id || index} className="bg-card backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          alt={individualProtocol.name}
                          className="w-full h-full object-cover"
                          height={40}
                          src={individualProtocol.logo || "/logo.svg"}
                          width={40}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{individualProtocol.name}</h3>
                        {individualProtocol.category && <p className="text-xs text-gray-400">{individualProtocol.category}</p>}
                      </div>
                    </div>

                    <StatsGrid stats={protocolStats} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
