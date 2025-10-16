import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { fetchMarketData } from "@/lib/data/market-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  const mainPages = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/tokens`, lastModified: currentDate, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${baseUrl}/defi`, lastModified: currentDate, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/stats`, lastModified: currentDate, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  try {
    const tokens = await fetchMarketData(50, 0);

    const tokenPages = tokens.slice(0, 50).map((token) => ({
      url: `${baseUrl}/tokens/${token.id}`,
      lastModified: currentDate,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    }));

    return [...mainPages, ...tokenPages];
  } catch (error) {
    return mainPages;
  }
}
