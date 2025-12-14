import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { getAllPosts } from "./lib";
import { BLOG_CONSTANTS } from "./types";

import { siteConfig } from "@/config/site";
import { COMMON_BREADCRUMBS } from "@/lib/utils/structured-data";

export const revalidate = 3600;

const title = "Blog | Solana News, Guides & DeFi Insights";
const description = "Stay updated with the latest Solana and DeFi news, staking guides, and Web3 insights";
const twitterTitle = "Hubra Blog | Solana News & DeFi Insights";
const canonical = `${siteConfig.domain}/blog`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Solana blog",
    "DeFi news",
    "crypto education",
    "staking guides",
    "Web3 insights",
    "blockchain tutorials",
    "cryptocurrency news",
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Hubra Blog - Solana & DeFi Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: twitterTitle,
    description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "index": true,
      "follow": true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  // Get the most recent featured post
  const featuredPost = allPosts.find((post) => post.featured);

  // Get all non-featured posts, or if all are featured, get all but the first one
  const regularPosts = allPosts.filter((post, index) => !post.featured || (index > 0 && post.featured));

  // Get popular posts for sidebar
  const popularPosts = allPosts.filter((post) => post.popular).slice(0, BLOG_CONSTANTS.DISPLAY.POPULAR_COUNT);

  // Structured data for blog listing
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Hubra Blog",
    "description": "Solana and DeFi news, guides, and insights",
    "url": `${siteConfig.domain}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.domain}/logo.png`,
      },
    },
    "blogPost": allPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "url": `${siteConfig.domain}/blog/${post.slug}`,
      "image": post.image,
    })),
  };

  const blogJsonLdString = JSON.stringify(blogJsonLd);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: blogJsonLdString }} defer id="blog-jsonld" type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: COMMON_BREADCRUMBS.blog }} defer id="breadcrumb-jsonld" type="application/ld+json" />

      <div className="max-w-5xl mx-auto">
        {/*        <header className="mb-8 sm:mb-10 md:mb-12">

          <p className="text-base sm:text-lg md:text-xl text-gray-400">
            Blog
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white lg:w-8/12">
            Stay updated with the latest news, guides, and insights about Solana blockchain, staking, DeFi, and more.
          </h1>
        </header>*/}

        {featuredPost && (
          <section className="mb-8 sm:mb-10 md:mb-12">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="relative h-64 sm:h-80 md:h-96 rounded-lg sm:rounded-xl overflow-hidden bg-card hover:ring-2 hover:ring-primary-500 transition-all duration-300">
                <Image
                  fill
                  priority
                  alt={featuredPost.title}
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={featuredPost.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">{featuredPost.title}</h2>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3">{featuredPost.excerpt}</p>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          <section className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-white">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group bg-card rounded-xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        fill
                        alt={post.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={post.image}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-3">{post.excerpt}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-white">Popular Articles</h2>
            <div className="space-y-6 bg-card rounded-xl p-6">
              {popularPosts.map((post, index) => (
                <div key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="flex items-start group cursor-pointer">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <Icon className="text-primary-500" icon="mdi:fire" width={20} />
                      </div>
                      <article className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {post.title}
                        </h3>
                      </article>
                    </div>
                  </Link>
                  {index < popularPosts.length - 1 && <hr className="my-4 border-gray-800" />}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
