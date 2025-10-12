"use client";

import type { Token } from "@/lib/types/token";

import React, { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";

import { TokenCard } from "./TokenCard";
import { TokenCardSkeletonGrid, TokenCardSkeletonStack } from "./TokenCardSkeleton";
import { TokenListItem } from "./TokenListItem";
import { ErrorDisplay } from "./ErrorDisplay";

import { useCurrentToken } from "@/lib/context/current-token-context";
import { useBatchPrefetch } from "@/lib/hooks/usePrefetch";
import { BREAKPOINTS } from "@/lib/constants";

interface TokenListViewProps {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const TokenListView: React.FC<TokenListViewProps> = ({ tokens, loading, error, onRetry }) => {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);
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
    return isMobile ? <TokenCardSkeletonStack count={4} /> : <TokenCardSkeletonGrid count={4} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }

  if (isMobile) {
    return (
      <div className="bg-card rounded-2xl overflow-hidden">
        <div>
          {tokens.map((token, index) => (
            <TokenListItem key={token.id} rank={index + 1} token={token} onClick={handleTokenClick} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
  );
};
