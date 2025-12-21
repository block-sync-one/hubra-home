"use client";

import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import React, { useState, useEffect } from "react";

import { NewsModal } from "./NewsModal";
import { NewsMarquee } from "./NewsMarquee";
import { NewsMarqueeSkeleton } from "./NewsMarqueeSkeleton";
import { NewsEmptyState } from "./NewsEmptyState";

import { getCryptoPanicNews } from "@/lib/actions/cryptopanic-news";

interface CryptoPanicNewsProps {
  tokenSymbol: string;
  maxItems?: number;
}

export function CryptoPanicNews({ tokenSymbol, maxItems = 15 }: CryptoPanicNewsProps) {
  const [news, setNews] = useState<CryptoPanicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<CryptoPanicPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!tokenSymbol) {
      setLoading(false);

      return;
    }

    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        const result = await getCryptoPanicNews(tokenSymbol);

        if (result && result.length > 0) {
          setNews(result);
        } else {
          setError("No news available");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [tokenSymbol]);

  if (loading) {
    return <NewsMarqueeSkeleton />;
  }

  if (error || !news || news.length === 0) {
    return <NewsEmptyState />;
  }

  const handleCardClick = (post: CryptoPanicPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Limit news items
  const displayNews = news.slice(0, maxItems);
  const hasEnoughItems = displayNews.length >= 10;

  // Split into first half and second half if we have at least 10 items
  const firstHalf = hasEnoughItems ? displayNews.slice(0, Math.ceil(displayNews.length / 2)) : displayNews;
  const secondHalf = hasEnoughItems ? displayNews.slice(Math.ceil(displayNews.length / 2)) : [];

  return (
    <>
      <NewsMarquee posts={firstHalf} onCardClick={handleCardClick} />
      {secondHalf.length > 0 && <NewsMarquee reverse posts={secondHalf} onCardClick={handleCardClick} />}
      <NewsModal isOpen={isModalOpen} post={selectedPost} onClose={handleCloseModal} />
    </>
  );
}
