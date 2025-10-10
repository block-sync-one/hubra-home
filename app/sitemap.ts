import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Sitemap for search engine indexing
 * Includes main pages - token pages are dynamically discovered via crawling
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  // Main pages
  const routes = ["", "/tokens", "/defi", "/blog", "/stats"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1 : 0.8,
  }));
}
