"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  message?: string;
  showTryAgain?: boolean;
  backLabel?: string;
  backHref?: string;
  quickLinks?: Array<{
    label: string;
    href: string;
  }>;
  showErrorDetails?: boolean;
}

export function ErrorPage({
  error,
  reset,
  title = "Something Went Wrong",
  message = "We encountered an error while loading this page. Please try again.",
  showTryAgain = true,
  backLabel = "Go Home",
  backHref = "/",
  quickLinks,
  showErrorDetails = true,
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="flex justify-center">
            <AlertTriangle className="w-32 h-32 md:w-40 md:h-40 text-primary animate-pulse" strokeWidth={1.5} />
          </div>
          <div className="absolute inset-0 blur-3xl opacity-20 bg-primary" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="text-lg text-gray-400 max-w-md mx-auto">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          {showTryAgain && reset && (
            <Button
              className="bg-white text-black hover:bg-gray-100 font-medium min-w-[160px]"
              radius="full"
              size="lg"
              startContent={<RefreshCw size={20} />}
              onClick={reset}>
              Try Again
            </Button>
          )}
          <Button
            as={Link}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium min-w-[160px]"
            href={backHref}
            radius="full"
            size="lg"
            startContent={<ArrowLeft size={20} />}
            variant="flat">
            {backLabel}
          </Button>
        </div>

        {quickLinks && quickLinks.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-4">
              {quickLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link className="text-sm text-gray-400 hover:text-white transition-colors" href={link.href}>
                    {link.label}
                  </Link>
                  {index < quickLinks.length - 1 && <span className="text-gray-600">•</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {showErrorDetails && process.env.NODE_ENV === "development" && (
          <details className="pt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">Error Details (Dev)</summary>
            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 text-left">
              <p className="text-sm font-mono text-red-400">{error.message}</p>
              {error.digest && <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>}
              {error.stack && <pre className="mt-2 text-xs text-gray-400 overflow-auto max-h-[200px]">{error.stack}</pre>}
            </div>
          </details>
        )}

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}
