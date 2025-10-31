"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { BlogPostMeta } from "@/app/blog/types";

interface BlogSearchProps {
  posts: BlogPostMeta[];
}

/**
 * Client-side search component for blog posts
 * Searches through title, excerpt, keywords, and tags
 */
export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search logic
  const searchResults = useMemo(() => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    return posts
      .filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm);
        const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
        const keywordMatch = post.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm));
        const tagMatch = post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm));
        const categoryMatch = post.category?.toLowerCase().includes(searchTerm);

        return titleMatch || excerptMatch || keywordMatch || tagMatch || categoryMatch;
      })
      .slice(0, 5); // Limit to top 5 results
  }, [query, posts]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            window.location.href = `/blog/${searchResults[selectedIndex].slug}`;
          }
          break;
        case "Escape":
          setIsOpen(false);
          setQuery("");
          break;
      }
    },
    [isOpen, searchResults, selectedIndex]
  );

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (!target.closest(".blog-search-container")) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="blog-search-container relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" icon="mdi:magnify" />
        <input
          className="w-full pl-12 pr-12 py-3 bg-card border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          placeholder="Search articles..."
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}>
            <Icon className="w-5 h-5" icon="mdi:close" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-card border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((post, index) => (
                <Link
                  key={post.slug}
                  className={`block px-4 py-3 transition-colors ${
                    index === selectedIndex ? "bg-primary-500/20 border-l-4 border-primary-500" : "hover:bg-white/5"
                  }`}
                  href={`/blog/${post.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" icon="mdi:file-document" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1 line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {post.category && (
                          <span className="text-xs px-2 py-0.5 bg-primary-500/10 text-primary-400 rounded">{post.category}</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="px-4 py-2 border-t border-gray-800 mt-2">
                <p className="text-xs text-gray-500 text-center">
                  {searchResults.length === 5
                    ? "Showing top 5 results. Refine your search for more specific results."
                    : `Found ${searchResults.length} ${searchResults.length === 1 ? "result" : "results"}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Icon className="w-12 h-12 text-gray-600 mx-auto mb-3" icon="mdi:magnify-close" />
              <p className="text-sm text-gray-400 mb-1">No articles found</p>
              <p className="text-xs text-gray-600">Try different keywords or browse all articles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
