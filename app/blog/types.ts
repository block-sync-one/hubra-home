export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  featured?: boolean;
  popular?: boolean;
  keywords?: string[];
  readingTime?: number;
  lastUpdated?: string;
  category?: string;
  tags?: string[];
  canonicalUrl?: string;
  metaDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  author?: string;
  draft?: boolean;
}
