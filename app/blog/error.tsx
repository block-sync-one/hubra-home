"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

import { ErrorPage } from "@/components/ErrorPage";

export default function BlogError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Blog error:", error);
  }, [error]);

  return (
    <ErrorPage
      error={error}
      message="We encountered an error while loading the blog content. Please try again."
      quickLinks={[
        { label: "Home", href: "/" },
        { label: "Tokens", href: "/tokens" },
        { label: "All Posts", href: "/blog" },
      ]}
      reset={reset}
      secondaryButton={{
        label: "Back to Blog",
        href: "/blog",
        icon: ArrowLeft,
      }}
      title="Blog Error"
    />
  );
}
