import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SEO utility functions
export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: "website" | "article"
  canonicalUrl?: string
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
}: SEOProps = {}): Metadata {
  const seoTitle = title ? `${title} - ${siteConfig.name}` : siteConfig.name
  const seoDescription = description || siteConfig.description
  const seoImage = ogImage || siteConfig.ogImage
  const seoUrl = canonicalUrl || siteConfig.url
  const allKeywords = [...siteConfig.keywords, ...keywords]

  const metadata: Metadata = {
    title: seoTitle,
    description: seoDescription,
    keywords: allKeywords.join(", "),
    authors: authors ? authors.map(author => ({ name: author })) : [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: seoUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: "en_US",
      url: seoUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(section && { section }),
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      images: [seoImage],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    manifest: "/manifest.json",
  }

  return metadata
}

export function generateStructuredData(type: "Organization" | "WebSite" | "Article", data: any = {}) {
  const baseUrl = siteConfig.url

  const structuredData: any = {
    "@context": "https://schema.org",
  }

  switch (type) {
    case "Organization":
      return {
        ...structuredData,
        "@type": "Organization",
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        logo: `${baseUrl}/favicon.ico`,
        sameAs: [
          siteConfig.links.twitter,
          siteConfig.links.github,
          siteConfig.links.discord,
        ],
        ...data,
      }

    case "WebSite":
      return {
        ...structuredData,
        "@type": "WebSite",
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        ...data,
      }

    case "Article":
      return {
        ...structuredData,
        "@type": "Article",
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/favicon.ico`,
          },
        },
        ...data,
      }

    default:
      return structuredData
  }
}
