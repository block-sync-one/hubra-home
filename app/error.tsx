"use client";

import { useEffect } from "react";

import { ErrorPage } from "@/components/ErrorPage";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <ErrorPage
      error={error}
      quickLinks={[
        { label: "Home", href: "/" },
        { label: "Tokens", href: "/tokens" },
        { label: "Blog", href: "/blog" },
      ]}
      reset={reset}
      secondaryButton={{
        label: "Go Home",
        href: "/",
      }}
    />
  );
}
