"use client";

import type { ImageProps } from "next/image";

import React, { useState } from "react";
import Image from "next/image";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
}

/**
 * Image component with loading skeleton and automatic fallback
 *
 * Features:
 * - Shows skeleton while loading
 * - Automatic fallback to default logo on error
 * - Prevents infinite loops
 * - Works with Next.js Image optimization
 */
export function ImageWithSkeleton({ src, alt, fallbackSrc = "/logo.svg", className = "", ...props }: ImageWithSkeletonProps) {
  const [error, setError] = useState(false);

  // Determine which src to use
  const imageSrc = error ? fallbackSrc : src;

  const handleError = () => {
    // Prevent infinite loop - only try fallback once
    if (imageSrc !== fallbackSrc) {
      setError(true);
    }
  };

  return (
    <div suppressHydrationWarning className="relative w-full h-full">
      {/* Animated skeleton background (shows while image loads) */}
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />

      {/* Image (loads on top of skeleton) */}
      <Image {...props} alt={alt} className={`${className} relative z-10`} src={imageSrc} onError={handleError} />
    </div>
  );
}

/**
 * Memoized version for performance in lists
 */
export const MemoizedImageWithSkeleton = React.memo(ImageWithSkeleton);
