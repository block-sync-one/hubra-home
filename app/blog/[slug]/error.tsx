"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import { ErrorPage } from "@/components/ErrorPage";

export default function BlogPostError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <ErrorPage
      error={error}
      message="We couldn't load this blog post. It may have been moved or deleted."
      quickLinks={[
        { label: "Home", href: "/" },
        { label: "Tokens", href: "/tokens" },
        { label: "All Posts", href: "/blog" },
      ]}
      reset={reset}
      secondaryButton={{
        label: "View All Posts",
        href: "/blog",
        icon: ArrowLeft,
      }}
      title="Post Not Found"
    />
  );
}
