import type { MetadataRoute } from "next";

import { getAllPosts } from "./lib";

import { siteConfig } from "@/config/site";

/**
 * Generate sitemap for blog posts
 * Automatically updates when new posts are added
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated || post.date),
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.7,
  }));

  return [
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogPosts,
  ];
}
