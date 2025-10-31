import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { getAllPosts } from "./lib";
import { DISPLAY_SETTINGS } from "./constants";

import { siteConfig } from "@/config/site";

export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
  title: "Blog | Hubra - Solana News, Guides & DeFi Insights",
  description:
    "Stay updated with the latest Solana and DeFi news, staking guides, and Web3 insights. Learn about blockchain technology, crypto trading, and decentralized finance.",
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
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Hubra Blog - Solana News & DeFi Insights",
    description:
      "Stay updated with the latest Solana and DeFi news, staking guides, and Web3 insights. Learn about blockchain technology and decentralized finance.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/hubra-og-image.png",
        width: 1200,
        height: 630,
        alt: "Hubra Blog - Solana & DeFi Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubra Blog - Solana News & DeFi Insights",
    description: "Stay updated with the latest Solana and DeFi news, staking guides, and Web3 insights.",
    images: ["/hubra-og-image.png"],
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
  const popularPosts = allPosts.filter((post) => post.popular).slice(0, DISPLAY_SETTINGS.POPULAR_POSTS_COUNT);

  // Structured data for blog listing
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Hubra Blog",
    "description": "Solana and DeFi news, guides, and insights",
    "url": `${siteConfig.url}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`,
      },
    },
    "blogPost": allPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "url": `${siteConfig.url}/blog/${post.slug}`,
      "image": post.image,
    })),
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
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} id="blog-jsonld" type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} id="breadcrumb-jsonld" type="application/ld+json" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Blog</h1>
          <p className="text-xl text-gray-400">
            Stay updated with the latest news, guides, and insights about Solana blockchain, staking, DeFi, and more.
          </p>
        </header>

        {featuredPost && (
          <section className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="relative h-96 rounded-xl overflow-hidden bg-card hover:ring-2 hover:ring-primary-500 transition-all duration-300">
                <Image
                  fill
                  priority
                  alt={featuredPost.title}
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={featuredPost.image}
                  unoptimized={featuredPost?.image?.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-3xl font-bold text-white mb-3">{featuredPost.title}</h2>
                  <p className="text-gray-300 text-lg">{featuredPost.excerpt}</p>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-white">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        unoptimized={post.image?.startsWith("http")}
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
            <h2 className="text-2xl font-bold mb-6 text-white">Popular Articles</h2>
            <div className="space-y-6 bg-card rounded-xl p-6">
              {popularPosts.map((post, index) => (
                <div key={post.slug}>
                  <Link href={`/blog/${post.slug}`}>
                    <div className="flex items-start group cursor-pointer">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <Icon className="text-primary-500" icon="mdi:fire" width={20} />
                      </div>
                      <article className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{post.title}</h3>
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
