import fs from "fs";
import path from "path";

import { cache } from "react";
import matter from "gray-matter";

import { BlogPost } from "./types";

import { mdxToHtml } from "@/lib/mdx";

const CONTENT_DIR = path.join(process.cwd(), "app/blog/content");

export function getAllBlogSlugs(): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      return [];
    }

    const files = fs.readdirSync(CONTENT_DIR);

    return files
      .filter((file) => (file.endsWith(".mdx") || file.endsWith(".md")) && file.toLowerCase() !== "readme.md")
      .map((file) => file.replace(/\.(mdx|md)$/, ""))
      .sort();
  } catch {
    return [];
  }
}

async function parseMDXFile(slug: string): Promise<BlogPost | null> {
  try {
    // Try .mdx first, then .md
    let filePath: string | null = null;
    const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const mdPath = path.join(CONTENT_DIR, `${slug}.md`);

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    }

    if (!filePath) {
      return null;
    }

    // Read file content
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse frontmatter
    const { data: frontmatter, content: mdxContent } = matter(fileContents);

    // Validate required fields
    if (!frontmatter.title || !frontmatter.date) {
      return null;
    }

    // Convert MDX to HTML
    const htmlContent = await mdxToHtml(mdxContent);

    // Build BlogPost object from frontmatter
    const post: BlogPost = {
      slug,
      title: frontmatter.title,
      excerpt: frontmatter.excerpt || frontmatter.description || "",
      content: htmlContent, // HTML content for rendering
      date: frontmatter.date,
      image: frontmatter.coverImage || frontmatter.image || "/hubra-og-image.png",

      // Optional fields
      featured: frontmatter.featured || false,
      popular: frontmatter.popular || false,
      keywords: frontmatter.keywords || frontmatter.tags || [],
      tags: frontmatter.tags || [],
      category: frontmatter.category,
      author: frontmatter.author || "Hubra Team",
      readingTime: frontmatter.readingTime,
      lastUpdated: frontmatter.lastUpdated,
      draft: frontmatter.draft || false,
      metaDescription: frontmatter.metaDescription || frontmatter.description,
      ogImage: frontmatter.ogImage,
      twitterImage: frontmatter.twitterImage,
      canonicalUrl: frontmatter.canonicalUrl,
    };

    return post;
  } catch {
    return null;
  }
}

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  const post = await parseMDXFile(slug);

  if (!post) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  return post;
});

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const slugs = getAllBlogSlugs();

    if (slugs.length === 0) {
      return [];
    }

    // Parse all posts in parallel
    const postsPromises = slugs.map((slug) => parseMDXFile(slug));
    const posts = await Promise.all(postsPromises);

    // Filter out nulls
    const validPosts = posts.filter((post): post is BlogPost => post !== null);

    // Filter out drafts in production
    const publishedPosts = process.env.NODE_ENV === "production" ? validPosts.filter((post) => !post.draft) : validPosts;

    // Sort by date (newest first)
    return publishedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    });
  } catch {
    return [];
  }
});

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  return allPosts.filter((post) => post.featured === true).slice(0, limit);
}

export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  return allPosts.filter((post) => post.popular === true).slice(0, limit);
}

export async function getPostsByCategory(category: string, limit?: number): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const filtered = allPosts.filter((post) => post.category?.toLowerCase() === category.toLowerCase());

  return limit ? filtered.slice(0, limit) : filtered;
}

export async function getPostsByTag(tag: string, limit?: number): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const filtered = allPosts.filter((post) => post.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));

  return limit ? filtered.slice(0, limit) : filtered;
}

export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  // Filter out the current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentPost.slug);

  // Score posts based on similarity
  const scoredPosts = otherPosts.map((post) => {
    let score = 0;

    // Same category gets highest score
    if (post.category && post.category === currentPost.category) {
      score += 10;
    }

    // Shared tags
    if (post.tags && currentPost.tags) {
      const sharedTags = post.tags.filter((tag) => currentPost.tags?.includes(tag));

      score += sharedTags.length * 5;
    }

    // Shared keywords
    if (post.keywords && currentPost.keywords) {
      const sharedKeywords = post.keywords.filter((keyword) => currentPost.keywords?.includes(keyword));

      score += sharedKeywords.length * 2;
    }

    return { post, score };
  });

  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const categories = new Set<string>();

  allPosts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories).sort();
}

export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

export async function searchPosts(query: string): Promise<BlogPost[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const allPosts = await getAllPosts();
  const searchTerm = query.toLowerCase().trim();

  return allPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    const keywordMatch = post.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm));
    const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm));

    return titleMatch || excerptMatch || contentMatch || keywordMatch || tagMatch;
  });
}
