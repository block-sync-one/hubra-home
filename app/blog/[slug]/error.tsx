"use client";

import { useEffect } from "react";

import { ErrorPage } from "@/components/ErrorPage";

export default function BlogPostError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <ErrorPage
      backHref="/blog"
      backLabel="View All Posts"
      error={error}
      message="We couldn't load this blog post. It may have been moved or deleted."
      quickLinks={[
        { label: "Home", href: "/" },
        { label: "Tokens", href: "/tokens" },
        { label: "All Posts", href: "/blog" },
      ]}
      reset={reset}
      title="Post Not Found"
    />
  );
}
