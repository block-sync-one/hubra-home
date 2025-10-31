import { getAllPosts } from "../lib";

import { siteConfig } from "@/config/site";

/**
 * RSS Feed Generator
 * Standards-compliant RSS 2.0 feed for blog posts
 * Accessible at: /blog/feed.xml
 */
export async function GET() {
  const posts = await getAllPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Blog</title>
    <link>${siteConfig.welcomeUrl}/blog</link>
    <description>${siteConfig.longDescription}</description>
    <language>en</language>
    <atom:link href="${siteConfig.welcomeUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .slice(0, 20)
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteConfig.welcomeUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.welcomeUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.author ? `<author>${post.author}</author>` : ""}
      ${post.category ? `<category>${post.category}</category>` : ""}
      ${post.tags ? post.tags.map((tag) => `<category>${tag}</category>`).join("\n      ") : ""}
    </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

