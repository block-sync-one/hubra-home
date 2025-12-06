"use client";

import { ArrowLeft } from "lucide-react";

import { ErrorPage } from "@/components/ErrorPage";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TokenError({ error, reset }: ErrorProps) {
  const isNotFound = error.message?.toLowerCase().includes("not found");

  return (
    <ErrorPage
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
      secondaryButton={{
        label: "Back to Tokens",
        href: "/tokens",
        icon: ArrowLeft,
      }}
      title={isNotFound ? "Token Not Found" : "Token Error"}
    />
  );
}
