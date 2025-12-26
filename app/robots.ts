import { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Controls which pages search engines can crawl
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/*.json$"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}
