"use client";

import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import React, { useState, useCallback } from "react";

import { NewsModal } from "./NewsModal";
import { NewsMarquee } from "./NewsMarquee";
import { NewsMarqueeSkeleton } from "./NewsMarqueeSkeleton";
import { NewsEmptyState } from "./NewsEmptyState";

import { useCryptoPanicNews } from "@/lib/hooks/useCryptoPanicNews";

export function CryptoPanicNews() {
  const { news, loading, error, firstHalf, secondHalf } = useCryptoPanicNews();
  const [selectedPost, setSelectedPost] = useState<CryptoPanicPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = useCallback((post: CryptoPanicPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPost(null);
  }, []);

  if (loading) {
    return <NewsMarqueeSkeleton />;
  }

  if (error || !news || news.length === 0) {
    return <NewsEmptyState />;
  }

  return (
    <>
      <NewsMarquee posts={firstHalf} onCardClick={handleCardClick} />
      {secondHalf.length > 0 && <NewsMarquee reverse posts={secondHalf} onCardClick={handleCardClick} />}
      <NewsModal isOpen={isModalOpen} post={selectedPost} onClose={handleCloseModal} />
    </>
  );
}
