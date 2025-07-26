import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { generateMetadata, generateStructuredData } from "@/lib/utils";

export const metadata: Metadata = generateMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  canonicalUrl: siteConfig.url,
});

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateStructuredData("Organization");
  const websiteSchema = generateStructuredData("WebSite");

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
        )}
      >
        <Providers themeProps={{ attribute: "class" }}>
          <div className="relative flex flex-col items-center">
            <Navbar />
            <main className="w-full px-0 md:px-10 flex flex-col items-center">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
