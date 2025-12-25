"use client";

import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import React, { useState, useEffect } from "react";

import { NewsModal } from "./NewsModal";
import { NewsMarquee } from "./NewsMarquee";
import { NewsMarqueeSkeleton } from "./NewsMarqueeSkeleton";
import { NewsEmptyState } from "./NewsEmptyState";

import { getCryptoPanicNews } from "@/lib/actions/cryptopanic-news";

export function CryptoPanicNews() {
  const [news, setNews] = useState<CryptoPanicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<CryptoPanicPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        const result = await getCryptoPanicNews();

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
  }, []);

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

  const hasEnoughItems = news.length >= 10;
  const firstHalf = hasEnoughItems ? news.slice(0, Math.ceil(news.length / 2)) : news;
  const secondHalf = hasEnoughItems ? news.slice(Math.ceil(news.length / 2)) : [];

  return (
    <>
      <NewsMarquee posts={firstHalf} onCardClick={handleCardClick} />
      {secondHalf.length > 0 && <NewsMarquee reverse posts={secondHalf} onCardClick={handleCardClick} />}
      <NewsModal isOpen={isModalOpen} post={selectedPost} onClose={handleCloseModal} />
    </>
  );
}
