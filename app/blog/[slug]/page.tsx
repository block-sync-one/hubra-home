import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { getPostBySlug, getAllBlogSlugs } from "../lib";
import ShareButtons from "../ShareButtons";

import { siteConfig } from "@/config/site";
import { calculateReadingTime, formatReadingTime } from "@/lib/utils/blog-helpers";

/**
 * Enable ISR with 5-minute revalidation
 * Faster updates for blog content
 */
export const revalidate = 300; // 5 minutes

/**
 * Generate static paths for all blog posts
 * Improves initial load performance
 */
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  const url = `${siteConfig.url}/blog/${post.slug}`;

  // Use custom meta description or fall back to excerpt
  const description = post.metaDescription || post.excerpt;

  // Use custom OG image or fall back to post image
  const ogImage = post.ogImage || post.image;

  return {
    title: `${post.title} | Hubra Blog`,
    description: description,
    keywords: post.keywords || post.tags,
    authors: post.author ? [{ name: post.author }] : [{ name: "Hubra Team" }],
    alternates: {
      canonical: post.canonicalUrl || url,
    },
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.lastUpdated || post.date,
      authors: post.author ? [post.author] : ["Hubra Team"],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      url: url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.twitterImage || ogImage],
    },
    robots: {
      index: !post.draft,
      follow: !post.draft,
      googleBot: {
        "index": !post.draft,
        "follow": !post.draft,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  const url = `${siteConfig.url}/blog/${post.slug}`;

  // Calculate reading time if not provided
  const readingTimeMinutes = post.readingTime || calculateReadingTime(post.content);
  const readingTimeText = formatReadingTime(readingTimeMinutes);

  // Structured data for blog post
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.lastUpdated || post.date,
    "author": {
      "@type": "Person",
      "name": post.author || "Hubra Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "keywords": post.keywords?.join(", ") || post.tags?.join(", "),
    "articleSection": post.category,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteConfig.url}/blog`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": url,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} id="article-jsonld" type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group" href="/blog">
            <Icon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" icon="mdi:arrow-left" />
            <span>Back to Blog</span>
          </Link>
        </div>

        <article className="max-w-7xl mx-auto">
          <header className="mb-12">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-400 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">{post.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-500" icon="mdi:calendar" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-500" icon="mdi:clock-outline" />
                <span>{readingTimeText}</span>
              </div>
              {post.author && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-500" icon="mdi:account" />
                    <span>{post.author}</span>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Cover Image */}
          <div className="relative w-full rounded-xl overflow-hidden mb-12 bg-gray-900">
            <Image
              priority
              alt={post.title}
              className="w-full h-auto"
              height={600}
              sizes="(max-width: 1024px) 100vw, 1024px"
              src={post.image}
              unoptimized={post.image?.startsWith("http")}
              width={1200}
            />
          </div>

          {/* Content */}

          {/* MDX Content - Rendered as HTML */}
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2 prose-h3:text-2xl
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary-500 prose-a:underline hover:prose-a:text-primary-400 hover:prose-a:no-underline
              prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-200 prose-em:italic
              prose-code:text-primary-400 prose-code:bg-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:border prose-code:border-gray-800
              prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg prose-pre:p-4
              prose-ul:text-gray-300 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-ul:marker:text-primary-500
              prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6 prose-ol:marker:text-primary-500
              prose-li:text-gray-300 prose-li:mb-2 prose-li:pl-2
              prose-blockquote:border-l-4 prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-400 prose-blockquote:bg-card prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
              prose-img:rounded-xl prose-img:shadow-lg
              prose-hr:border-gray-800 prose-hr:my-8
              prose-table:border prose-table:border-gray-800 prose-table:rounded-lg prose-table:my-8
              prose-th:bg-card prose-th:text-white prose-th:font-semibold prose-th:p-3
              prose-td:text-gray-300 prose-td:p-3 prose-td:border-t prose-td:border-gray-800"
          />

          <footer className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center text-gray-400">
                <Icon className="w-5 h-5 mr-2 text-gray-500" icon="mdi:share-variant" />
                <span className="text-sm font-medium">Share this article</span>
              </div>

              <ShareButtons url={url} />
            </div>
          </footer>
        </article>
      </div>
    </>
  );
}
