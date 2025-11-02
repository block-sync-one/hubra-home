import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { StatsGrid } from "../components/stats-grid";

import { DefiStatsAggrigate } from "@/lib/types/defi-stats";
import ChartPnl, { Chart } from "@/components/chart";
import { formatCurrency } from "@/lib/utils/helper";

type PageParams = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const protocol = await getProtocol(slug);

  if (!protocol) {
    return {
      title: "Protocol Not Found",
      description: "The requested protocol could not be found.",
    };
  }

  return {
    title: `${protocol.name || "Protocol"} | SolanaHub`,
    description: protocol.description || "",
    openGraph: {
      title: `${protocol.name || "Protocol"} | SolanaHub`,
      description: protocol.description || "",
      images: protocol.logo ? [protocol.logo] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${protocol.name || "Protocol"} | SolanaHub`,
      description: protocol.description || "",
      images: protocol.logo ? [protocol.logo] : [],
    },
  };
}

async function getProtocol(slug: string): Promise<DefiStatsAggrigate | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/defi/${slug}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching protocol:", error);

    return null;
  }
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const protocol = await getProtocol(slug);

  if (!protocol) {
    notFound();
  }
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
      change: `${protocol.change_1d?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.change_1d || 0) >= 0 ? "positive" : "negative",
      chartData: protocol.chartData || [],
    },
  ];

  if (protocol.inflows.chartData.length > 0) {
    chartData.push({
      key: "inflows",
      title: "Inflows",
      value: protocol.inflows?.chartData[protocol.inflows.chartData.length - 1]?.value || 0,
      suffix: "$",
      type: "number",
      tooltipType: "number-string",
      toolTipTitle: "fees",
      toolTip2Title: "revenue",
      change: `${protocol.inflows?.change_1d?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.inflows?.change_1d || 0) >= 0 ? "positive" : "negative",
      chartData: protocol.inflows?.chartData || [],
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
      value: formatCurrency(protocol.tvl || 0),
      icon: "solar:lock-bold",
      change: `${protocol.change_1d?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.change_1d || 0) >= 0 ? "positive" : "negative",
    },
    {
      name: "Inflows (24h)",
      value:
        protocol.inflows?.chartData.length > 0
          ? formatCurrency(protocol.inflows?.chartData[protocol.inflows.chartData.length - 1]?.value || 0)
          : "$0",
      icon: "solar:money-bag-bold",
      change: `${protocol.inflows?.change_1d?.toFixed(2) || "0.00"}%`,
      changeType: (protocol.inflows?.change_1d || 0) >= 0 ? "positive" : "negative",
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
  const protocolAny = protocol as any;

  if (protocolAny.github) {
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

  return (
    <main className="flex flex-col gap-8 overflow-x-hidden">
      <div className="md:max-w-7xl mx-auto w-full px-0 sm:px-0">
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
            <p className="text-gray-400 line-clamp-2 max-w-2xl">{protocol.description}</p>

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

        {/* Chart Section */}
        <div className="mb-6">
          <ChartPnl charts={chartData} title="Performance" />
        </div>

        {/* Statistics and metrics */}
        <div>
          <StatsGrid stats={statsData} title="Key Metrics" />
        </div>
      </div>
    </main>
  );
}
