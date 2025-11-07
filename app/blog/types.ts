/**
 * Blog Types
 * Enhanced type definitions with validation and utility types
 */

// ============================================
// Core Types
// ============================================

/**
 * Frontmatter data from MDX files (raw data before processing)
 */
export interface BlogFrontmatter {
  title: string;
  description?: string;
  excerpt?: string;
  date: string;
  image?: string;
  coverImage?: string;
  featured?: boolean;
  popular?: boolean;
  draft?: boolean;
  keywords?: string[];
  tags?: string[];
  category?: string;
  author?: string;
  readingTime?: number;
  lastUpdated?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
}

/**
 * Processed blog post ready for display
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;

  // Optional metadata
  featured?: boolean;
  popular?: boolean;
  draft?: boolean;
  keywords?: string[];
  tags?: string[];
  category?: string;
  author?: string;
  readingTime?: number;
  lastUpdated?: string;

  // SEO fields
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  twitterImage?: string;
}

/**
 * Blog post metadata for listing pages (without heavy content)
 */
export interface BlogPostMeta extends Omit<BlogPost, "content"> {
  excerpt: string;
}

// ============================================
// Utility Types
// ============================================

/**
 * Result type for async operations
 */
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

/**
 * Blog filter options
 */
export interface BlogFilterOptions {
  category?: string;
  tag?: string;
  featured?: boolean;
  popular?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Paginated blog posts result
 */
export interface PaginatedBlogPosts {
  posts: BlogPostMeta[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Type Guards
// ============================================

/**
 * Type guard to check if frontmatter is valid
 */
export function isValidFrontmatter(data: unknown): data is BlogFrontmatter {
  if (typeof data !== "object" || data === null) return false;

  const fm = data as Record<string, unknown>;

  return (
    typeof fm.title === "string" &&
    typeof fm.date === "string" &&
    (!fm.excerpt || typeof fm.excerpt === "string") &&
    (!fm.featured || typeof fm.featured === "boolean") &&
    (!fm.draft || typeof fm.draft === "boolean")
  );
}

// ============================================
// Constants
// ============================================

export const BLOG_CONSTANTS = {
  CACHE: {
    REVALIDATE: 60 * 60 * 24, // 24 hours
    STATIC: 60 * 60 * 24 * 7, // 7 days
    DYNAMIC: 60 * 60, // 1 hour
  },
  DISPLAY: {
    POSTS_PER_PAGE: 12,
    FEATURED_COUNT: 1,
    POPULAR_COUNT: 3,
    RELATED_COUNT: 3,
    RECENT_COUNT: 5,
  },
  LIMITS: {
    EXCERPT_LENGTH: 160,
    META_DESCRIPTION_LENGTH: 155,
    TITLE_LENGTH: 60,
    MAX_KEYWORDS: 10,
    MAX_TAGS: 5,
  },
  READING: {
    WORDS_PER_MINUTE: 225,
    MIN_READING_TIME: 1,
  },
} as const;

// ============================================
// Error Types
// ============================================

export class BlogError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "BlogError";
  }
}

export class BlogPostNotFoundError extends BlogError {
  constructor(slug: string) {
    super(`Blog post not found: ${slug}`, "POST_NOT_FOUND", { slug });
    this.name = "BlogPostNotFoundError";
  }
}

export class BlogParseError extends BlogError {
  constructor(slug: string, cause: unknown) {
    super(`Failed to parse blog post: ${slug}`, "PARSE_ERROR", { slug, cause });
    this.name = "BlogParseError";
  }
}
