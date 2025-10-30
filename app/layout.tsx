import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { WebVitals } from "@/components/WebVitals";
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: siteConfig.ogImage
      ? [
          {
            url: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: siteConfig.name,
          },
        ]
      : [],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.ogImage ? [siteConfig.ogImage] : [],
    creator: siteConfig.twitter?.handle,
    site: siteConfig.twitter?.site,
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

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization structured data for better brand recognition
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hubra",
    "description": "Hubra - the power of CEX, the freedom of DeFi",
    "url": "https://hubra.app",
    "logo": "https://hubra.app/logo.png",
    "sameAs": ["https://twitter.com/hubraApp"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "url": "https://hubra.app",
    },
  };

  // Website schema with search functionality
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hubra",
    "description": "Solana DeFi Analytics Platform",
    "url": "https://hubra.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://hubra.app/tokens?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {/* Preconnect to external APIs for faster loading */}
        <link href="https://public-api.birdeye.so" rel="preconnect" />
        <link href="https://stablecoins.llama.fi" rel="preconnect" />
        <link href="https://api.llama.fi" rel="preconnect" />
        <link href="https://public-api.birdeye.so" rel="dns-prefetch" />
        <link href="https://stablecoins.llama.fi" rel="dns-prefetch" />
        <link href="https://api.llama.fi" rel="dns-prefetch" />

        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          id="organization-jsonld"
          type="application/ld+json"
        />
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} id="website-jsonld" type="application/ld+json" />
      </head>
      <body className={clsx("min-h-screen text-foreground font-sans antialiased overflow-x-hidden")}>
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:font-medium"
          href="#main">
          Skip to content
        </a>
        <Providers themeProps={{ attribute: "class" }}>
          <div className="relative flex flex-col items-center">
            <Navbar />
            <main className="w-full px-6 md:px-10 flex flex-col scroll-mt-24" id="main" tabIndex={-1}>
              {children}
            </main>
          </div>
        </Providers>
        <WebVitals />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
