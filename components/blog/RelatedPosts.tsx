import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { BlogPostMeta } from "@/app/blog/types";

interface RelatedPostsProps {
  posts: BlogPostMeta[];
}

/**
 * Related Posts Component
 * Shows recommended articles based on content similarity
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 sm:mt-14 md:mt-16 pt-6 sm:pt-7 md:pt-8 border-t border-gray-800">
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-7 md:mb-8">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" icon="mdi:link-variant" />
        <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-white">Related Articles</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            className="group bg-card rounded-xl overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-300"
            href={`/blog/${post.slug}`}>
            <article className="h-full flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  fill
                  alt={post.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={post.image}
                  unoptimized={post.image?.startsWith("http")}
                />
                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-medium bg-primary-500/90 text-white rounded-full backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 mb-3 sm:mb-4 flex-1">{post.excerpt}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4" icon="mdi:calendar" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  {post.readingTime && (
                    <div className="flex items-center gap-1">
                      <Icon className="w-4 h-4" icon="mdi:clock-outline" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded border border-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Read More Link */}
      <div className="mt-6 sm:mt-7 md:mt-8 text-center">
        <Link
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-card hover:bg-primary-500/20 text-white text-sm sm:text-base font-medium rounded-lg transition-all duration-300 border border-gray-800 hover:border-primary-500"
          href="/blog">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" icon="mdi:arrow-left" />
          <span>Browse All Articles</span>
        </Link>
      </div>
    </section>
  );
}
