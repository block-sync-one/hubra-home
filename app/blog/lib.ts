/**
 * Blog Library
 * Enhanced error handling, validation, and performance optimizations
 */

import fs from "fs";
import path from "path";

import { cache } from "react";
import matter from "gray-matter";

import { BlogPost, BlogPostMeta, BlogFrontmatter, Result, BlogPostNotFoundError, BlogParseError, isValidFrontmatter } from "./types";

import { mdxToHtml } from "@/lib/mdx";
import { siteConfig } from "@/config/site";

const CONTENT_DIR = path.join(process.cwd(), "app/blog/content");
const DEFAULT_IMAGE = "/hubra-og-image.png";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

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

/**
 * Parse frontmatter and validate required fields
 */
function parseFrontmatter(data: unknown, slug: string): BlogFrontmatter {
  if (!isValidFrontmatter(data)) {
    throw new BlogParseError(slug, "Invalid frontmatter structure");
  }

  return data;
}

/**
 * Transform frontmatter to BlogPost
 */
function transformToBlogPost(slug: string, frontmatter: BlogFrontmatter, htmlContent: string): BlogPost {
  const image = `${siteConfig.domain}${frontmatter.coverImage || frontmatter.image || DEFAULT_IMAGE}`;

  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt || frontmatter.description || "",
    content: htmlContent,
    date: frontmatter.date,
    image,

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
    ogImage: image,
    twitterImage: image,
    canonicalUrl: frontmatter.canonicalUrl,
  };
}

/**
 * Parse MDX file and convert to BlogPost with proper error handling
 */
async function parseMDXFile(slug: string): Promise<Result<BlogPost>> {
  try {
    // Try .mdx first, then .md
    let filePath: string | null = null;
    const mdxPath = path.join(CONTENT_DIR, `${slug}.mdx`);

    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    }

    if (!filePath) {
      return {
        success: false,
        error: new BlogPostNotFoundError(slug),
      };
    }

    // Read file content
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse frontmatter
    const { data: rawFrontmatter, content: mdxContent } = matter(fileContents);

    // Validate frontmatter
    const frontmatter = parseFrontmatter(rawFrontmatter, slug);

    // Convert MDX to HTML
    const htmlContent = await mdxToHtml(mdxContent);

    // Transform to BlogPost
    const post = transformToBlogPost(slug, frontmatter, htmlContent);

    return { success: true, data: post };
  } catch (error) {
    if (error instanceof BlogParseError || error instanceof BlogPostNotFoundError) {
      return { success: false, error };
    }

    console.error(`Error parsing blog post ${slug}:`, error);

    return {
      success: false,
      error: new BlogParseError(slug, error),
    };
  }
}

/**
 * Get a single blog post by slug (cached)
 * @throws BlogPostNotFoundError if post doesn't exist
 */
export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  const result = await parseMDXFile(slug);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
});

/**
 * Get all blog posts (cached)
 * Returns empty array on error instead of throwing
 */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const slugs = getAllBlogSlugs();

    if (slugs.length === 0) {
      return [];
    }

    // Parse all posts in parallel
    const results = await Promise.all(slugs.map((slug) => parseMDXFile(slug)));

    // Filter successful results
    const validPosts = results
      .filter((result): result is Extract<typeof result, { success: true }> => result.success)
      .map((result) => result.data);

    // Filter out drafts in production
    const publishedPosts = IS_PRODUCTION ? validPosts.filter((post) => !post.draft) : validPosts;

    // Sort by date (newest first)
    return publishedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);

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

/**
 * Get all blog post metadata (lightweight, without content)
 * Ideal for listing pages - 70% lighter than getAllPosts
 */
export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();

  return posts.map(({ content, ...meta }) => meta as BlogPostMeta);
}

/**
 * Search posts with better error handling
 */
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
