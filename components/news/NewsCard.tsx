import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import { Icon } from "@iconify/react";

interface NewsCardProps {
  post: CryptoPanicPost;
  onClick: () => void;
}

function getKindTagStyles(kind: string): string {
  const styles: Record<string, string> = {
    news: "bg-blue-500/20 text-blue-400",
    media: "bg-purple-500/20 text-purple-400",
    blog: "bg-green-500/20 text-green-400",
    twitter: "bg-cyan-500/20 text-cyan-400",
    reddit: "bg-orange-500/20 text-orange-400",
  };

  return styles[kind.toLowerCase()] || "bg-primary/20 text-primary";
}

export function NewsCard({ post, onClick }: NewsCardProps) {
  const url = post.original_url || post.url;
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <button
      className="group relative block p-4 bg-card/80 hover:bg-card rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-black/20 w-[320px] shrink-0 text-left cursor-pointer backdrop-blur-sm"
      type="button"
      onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold text-gray-300 leading-snug line-clamp-2 group-hover:text-white/90 transition-colors flex-1">
              {post.title || "Untitled"}
            </p>
            {post.kind && (
              <span
                className={`px-2 py-0.5 text-[10px] font-medium rounded-md uppercase tracking-wide shrink-0 ${getKindTagStyles(post.kind)}`}>
                {post.kind}
              </span>
            )}
          </div>
          {formattedDate && (
            <time className="text-xs text-gray-400" dateTime={post.published_at}>
              {formattedDate}
            </time>
          )}
        </div>

        {url && (
          <div className="flex-shrink-0 pt-0.5">
            <Icon
              className="w-4 h-4 text-gray-400/60 group-hover:text-primary transition-colors duration-200"
              icon="lucide:external-link"
              onClick={() => window.open(url, "_blank")}
            />
          </div>
        )}
      </div>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent pointer-events-none transition-all duration-200" />
    </button>
  );
}
