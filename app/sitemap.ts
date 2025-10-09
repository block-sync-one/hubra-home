import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Enhanced sitemap with dynamic token pages
 * Includes top 50 trending tokens for better SEO indexing
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  // Static pages
  const routes = ["", "/tokens", "/defi", "/blog", "/stats"];

  const staticPages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch top trending tokens for dynamic sitemap
  let tokenPages: MetadataRoute.Sitemap = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/crypto/markets?limit=50`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (response.ok) {
      const tokens = await response.json();

      tokenPages = tokens.map((token: any) => ({
        url: `${baseUrl}/tokens/${token.id}`,
        lastModified: currentDate,
        changeFrequency: "hourly" as const,
        priority: 0.7,
      }));

      console.log(`✅ Sitemap: Added ${tokenPages.length} token pages`);
    }
  } catch (error) {
    console.error("❌ Sitemap: Failed to fetch tokens, using static pages only", error);
  }

  return [...staticPages, ...tokenPages];
}
