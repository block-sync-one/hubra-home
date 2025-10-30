"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        aria-label="Copy link"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors relative"
        type="button"
        onClick={handleCopyLink}>
        <Icon className="w-5 h-5" icon={copied ? "mdi:check" : "mdi:link"} />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 px-2 py-1 rounded text-white">Copied!</span>
        )}
      </button>
      <a
        aria-label="Share on Twitter"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
        rel="noopener noreferrer"
        target="_blank">
        <Icon className="w-5 h-5" icon="mdi:twitter" />
      </a>
      <a
        aria-label="Share on Facebook"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        rel="noopener noreferrer"
        target="_blank">
        <Icon className="w-5 h-5" icon="mdi:facebook" />
      </a>
      <a
        aria-label="Share on LinkedIn"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        rel="noopener noreferrer"
        target="_blank">
        <Icon className="w-5 h-5" icon="mdi:linkedin" />
      </a>
    </div>
  );
}
