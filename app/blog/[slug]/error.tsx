"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

/**
 * Error Boundary for Individual Blog Post Pages
 * Catches and displays errors specific to blog post rendering
 */
export default function BlogPostError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Blog post error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 p-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Icon className="w-24 h-24 text-red-500" icon="mdi:file-document-alert" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          We couldn&apos;t load this blog post. It may have been moved or deleted.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800 text-left max-w-2xl mx-auto">
            <p className="text-sm font-mono text-red-400">{error.message}</p>
            {error.digest && <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
            type="button"
            onClick={() => reset()}>
            <Icon className="w-5 h-5" icon="mdi:refresh" />
            Try Again
          </button>

          <Link
            className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            href="/blog">
            <Icon className="w-5 h-5" icon="mdi:arrow-left" />
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
