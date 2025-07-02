import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Blog - ${siteConfig.name}`,
  description: siteConfig.description,
  openGraph: {
    title: `Blog - ${siteConfig.name}`,
    description: siteConfig.description,
    url: "/blog",
    siteName: siteConfig.name,
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog - ${siteConfig.name}`,
    description: siteConfig.description,
    site: siteConfig.links.twitter,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
