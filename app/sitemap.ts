import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { fetchMarketData } from "@/lib/data/market-data";
import { fetchProtocolsData } from "@/lib/data/defi-data";
import { isParentProtocol } from "@/lib/data/protocol-utils";
import { getAllPosts } from "@/app/blog/lib";

export const dynamic = "force-dynamic";

/**
 * Generate dynamic sitemap for SEO
 * Includes: main pages, token pages, protocol pages, and blog posts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domain;
  const currentDate = new Date();

  // Main application pages
  const mainPages = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/tokens`, lastModified: currentDate, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${baseUrl}/defi`, lastModified: currentDate, changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${baseUrl}/stats`, lastModified: currentDate, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  try {
    // Fetch all data in parallel
    const [marketData, protocolsData, blogPosts] = await Promise.all([fetchMarketData(50, 0), fetchProtocolsData(), getAllPosts()]);

    const tokens = marketData.data;

    // Generate token pages
    const tokenPages = tokens.slice(0, 50).map((token) => ({
      url: `${baseUrl}/tokens/${token.id}`,
      lastModified: currentDate,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    }));

    // Generate protocol pages (only parent protocols, top 10)
    const protocolPages = protocolsData.solanaProtocols
      .filter(isParentProtocol)
      .slice(0, 10)
      .map((protocol) => ({
        url: `${baseUrl}/defi/${protocol.slug || protocol.id}`,
        lastModified: currentDate,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      }));

    // Generate blog post pages
    const blogPages = blogPosts
      .filter((post) => !post.draft)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.lastUpdated ? new Date(post.lastUpdated) : new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    return [...mainPages, ...tokenPages, ...protocolPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    return mainPages;
  }
}
