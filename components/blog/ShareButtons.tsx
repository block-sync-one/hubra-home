"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useMemo } from "react";

interface ShareButtonsProps {
  url: string;
  title?: string;
  description?: string;
}

interface SocialPlatform {
  name: string;
  icon: string;
  getUrl: (url: string, title?: string, description?: string) => string;
  ariaLabel: string;
}

/**
 * Reusable ShareButtons component for blog posts
 * Supports Twitter, Facebook, LinkedIn, and copy-to-clipboard
 */
export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  }, [url]);

  const socialPlatforms: SocialPlatform[] = useMemo(
    () => [
      {
        name: "Twitter",
        icon: "mdi:twitter",
        getUrl: (url, title) => {
          const text = title ? `${title} - ` : "";

          return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        },
        ariaLabel: "Share on Twitter",
      },
      {
        name: "Facebook",
        icon: "mdi:facebook",
        getUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        ariaLabel: "Share on Facebook",
      },
      {
        name: "LinkedIn",
        icon: "mdi:linkedin",
        getUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        ariaLabel: "Share on LinkedIn",
      },
    ],
    []
  );

  return (
    <div aria-label="Share options" className="flex items-center gap-3" role="group">
      {/* Copy Link Button */}
      <button
        aria-label={copied ? "Link copied" : "Copy link"}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors relative"
        type="button"
        onClick={handleCopyLink}>
        <Icon className="w-5 h-5" icon={copied ? "mdi:check" : "mdi:link"} />
        {copied && (
          <span
            aria-live="polite"
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 px-2 py-1 rounded text-white whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>

      {/* Social Share Links */}
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          aria-label={platform.ariaLabel}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors"
          href={platform.getUrl(url, title, description)}
          rel="noopener noreferrer"
          target="_blank">
          <Icon className="w-5 h-5" icon={platform.icon} />
        </a>
      ))}
    </div>
  );
}
