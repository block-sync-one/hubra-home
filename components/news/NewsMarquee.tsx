import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import { NewsCard } from "./NewsCard";

import { Marquee } from "@/components/ui/marquee";

interface NewsMarqueeProps {
  posts: CryptoPanicPost[];
  reverse?: boolean;
  onCardClick: (post: CryptoPanicPost) => void;
}

export function NewsMarquee({ posts, reverse = false, onCardClick }: NewsMarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <Marquee pauseOnHover className="[--duration:40s] [--gap:1rem]" reverse={reverse}>
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} onClick={() => onCardClick(post)} />
        ))}
      </Marquee>
      {/* Gradient fade effects */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#0d0e21] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[#0d0e21] to-transparent" />
    </div>
  );
}
