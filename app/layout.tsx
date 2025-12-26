import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";
import dynamic from "next/dynamic";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { ORGANIZATION_JSON_LD_STRING, WEBSITE_JSON_LD_STRING } from "@/lib/utils/structured-data";
import { fontSans } from "@/config/fonts";
const CryptoPanicNews = dynamic(() => import("@/components/news/CryptoPanicNews").then((mod) => ({ default: mod.CryptoPanicNews })));

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.domain,
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
    url: siteConfig.domain,
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
  return (
    <html suppressHydrationWarning className={clsx(fontSans.variable)} lang="en">
      <head>
        {/* Preconnect to external APIs for faster loading */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://public-api.birdeye.so" rel="preconnect" />
        <link href="https://stablecoins.llama.fi" rel="preconnect" />
        <link href="https://api.llama.fi" rel="preconnect" />
        <link href="https://public-api.birdeye.so" rel="dns-prefetch" />
        <link href="https://stablecoins.llama.fi" rel="dns-prefetch" />
        <link href="https://api.llama.fi" rel="dns-prefetch" />

        <script
          dangerouslySetInnerHTML={{ __html: ORGANIZATION_JSON_LD_STRING }}
          defer
          id="organization-jsonld"
          type="application/ld+json"
        />
        <script dangerouslySetInnerHTML={{ __html: WEBSITE_JSON_LD_STRING }} defer id="website-jsonld" type="application/ld+json" />
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
            <main className="w-full px-4 md:px-10 flex flex-col scroll-mt-24" id="main" tabIndex={-1}>
              {children}
            </main>
            <CryptoPanicNews />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
