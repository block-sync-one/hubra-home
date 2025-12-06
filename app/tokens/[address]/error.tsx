"use client";

import { ErrorPage } from "@/components/ErrorPage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TokenError({ error, reset }: ErrorProps) {
  const isNotFound = error.message?.toLowerCase().includes("not found");

  return (
    <ErrorPage
      backHref="/tokens"
      backLabel="Back to Tokens"
      error={error}
      message={
        isNotFound
          ? "This token doesn't exist or couldn't be found on Solana. It may have been delisted or the address is incorrect."
          : "We encountered an error while loading the token data. This might be temporary."
      }
      quickLinks={[
        { label: "All Tokens", href: "/tokens" },
        { label: "Home", href: "/" },
      ]}
      reset={reset}
      title={isNotFound ? "Token Not Found" : "Token Error"}
    />
  );
}
