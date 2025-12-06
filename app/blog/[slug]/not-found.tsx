import { Metadata } from "next";

import { NotFoundPage } from "@/components/NotFoundPage";

export const metadata: Metadata = {
  title: "Post Not Found | Hubra Blog",
  description: "The blog post you're looking for doesn't exist or has been removed.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BlogPostNotFound() {
  return (
    <NotFoundPage
      message="This blog post doesn't exist or has been removed. Check out our other posts!"
      primaryHref="/blog"
      primaryIcon="arrow-left"
      primaryLabel="View All Posts"
      quickLinks={[
        { label: "All Posts", href: "/blog" },
        { label: "Tokens", href: "/tokens" },
        { label: "Home", href: "/" },
      ]}
      secondaryHref="/"
      secondaryIcon="home"
      secondaryLabel="Go Home"
      title="Post Not Found"
    />
  );
}
