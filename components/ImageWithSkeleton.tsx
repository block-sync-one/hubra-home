"use client";

import type { ImageProps } from "next/image";

import React, { useState } from "react";
import Image from "next/image";

interface ImageWithSkeletonProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
}

/**
 * Validate if a string is a valid URL or path
 */
function isValidImageSrc(src: any): boolean {
  if (!src || src.trim() === "") {
    return false;
  }

  // Check if it's a valid path (starts with /)
  if (src.startsWith("/")) {
    return true;
  }

  // Check if it's a valid URL
  try {
    new URL(src);

    return true;
  } catch {
    return false;
  }
}

/**
 * Image component with loading skeleton and automatic fallback
 *
 * Features:
 * - Shows skeleton while loading
 * - Automatic fallback to default logo on error
 * - Prevents infinite loops
 * - Works with Next.js Image optimization
 * - Validates URLs before rendering
 */
export function ImageWithSkeleton({ src, alt, fallbackSrc = "", className = "", ...props }: ImageWithSkeletonProps) {
  const [error, setError] = useState(false);

  // Validate and determine which src to use
  const isValidSrc = isValidImageSrc(src);
  const imageSrc = error || !isValidSrc ? fallbackSrc : src;
  const shouldRenderImage = isValidImageSrc(imageSrc);

  // Check if image is external (starts with http:// or https://)
  // External images including IP addresses with ports should use unoptimized
  const isExternalImage = typeof imageSrc === "string" && (imageSrc.startsWith("http://") || imageSrc.startsWith("https://"));

  const handleError = () => {
    // Prevent infinite loop - only try fallback once
    if (imageSrc !== fallbackSrc) {
      setError(true);
    }
  };

  return (
    <div suppressHydrationWarning className="relative w-full h-full">
      {/* Animated skeleton background (shows while image loads or if no image) */}
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />

      {/* Image (loads on top of skeleton) */}
      {shouldRenderImage && (
        <Image
          {...props}
          alt={alt}
          className={`${className} relative z-10`}
          src={imageSrc}
          unoptimized={isExternalImage}
          onError={handleError}
        />
      )}
    </div>
  );
}

/**
 * Memoized version for performance in lists
 */
export const MemoizedImageWithSkeleton = React.memo(ImageWithSkeleton);
