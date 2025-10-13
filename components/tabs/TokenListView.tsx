"use client";

import type { Token } from "@/lib/types/token";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { TokenCard } from "./TokenCard";
import { TokenCardSkeletonGrid } from "./TokenCardSkeleton";
import { TokenListViewSkeleton } from "./TokenListViewSkeleton";
import { TokenListItem } from "./TokenListItem";
import { ErrorDisplay } from "./ErrorDisplay";

import { useCurrentToken } from "@/lib/context/current-token-context";
import { useBatchPrefetch } from "@/lib/hooks/usePrefetch";

interface TokenListViewProps {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const TokenListView: React.FC<TokenListViewProps> = ({ tokens, loading, error, onRetry }) => {
  const router = useRouter();
  const { setCurrentToken } = useCurrentToken();
  const { prefetchTokens } = useBatchPrefetch();

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      prefetchTokens(tokens);
    }
  }, [tokens, prefetchTokens]);

  const handleTokenClick = (token: Token) => {
    setCurrentToken(token);
    router.push(`/tokens/${token.id}`);
  };

  if (loading) {
    return (
      <>
        <div className="md:hidden w-full">
          <TokenListViewSkeleton count={4} />
        </div>
        <div className="hidden md:block w-full">
          <TokenCardSkeletonGrid count={4} />
        </div>
      </>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  return (
    <>
      {/* Mobile List View */}
      <div className="md:hidden bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden w-full">
        <div>
          {tokens.map((token, index) => (
            <TokenListItem key={token.id} rank={index + 1} token={token} onClick={handleTokenClick} />
          ))}
        </div>
      </div>

      {/* Desktop Card Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            change={token.change}
            coinId={token.id}
            imgUrl={token.imgUrl}
            name={token.name}
            price={token.price}
            symbol={token.symbol}
            volume={token.volume}
          />
        ))}
      </div>
    </>
  );
};
