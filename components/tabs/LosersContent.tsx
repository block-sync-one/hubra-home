"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { TokenCard } from "./TokenCard";
import { TokenCardSkeletonGrid, TokenCardSkeletonStack } from "./TokenCardSkeleton";

import { useCryptoData } from "@/lib/hooks/useCryptoData";
import { BREAKPOINTS } from "@/lib/constants";
import { useBatchPrefetch } from "@/lib/hooks/usePrefetch";

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;

  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-error-500",
    iconColor: isPositive ? "text-success-500" : "text-error-500",
  };
};

const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);

  return (
    <div className={`flex items-center gap-1 ${config.bgColor} rounded-lg px-2 py-1`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} icon={config.icon} />
      <span className={`text-xs font-medium ${config.textColor}`}>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
});

ChangeIndicator.displayName = "ChangeIndicator";

export const LosersContent = () => {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);
  const router = useRouter();
  const { prefetchTokens } = useBatchPrefetch();

  // Live crypto data from Birdeye
  const { losers, loading, error } = useCryptoData();

  // Prefetch all visible losers when they load
  React.useEffect(() => {
    if (losers && losers.length > 0) {
      prefetchTokens(losers);
    }
  }, [losers, prefetchTokens]);

  // Loading state
  if (loading) {
    return isMobile ? <TokenCardSkeletonStack count={4} /> : <TokenCardSkeletonGrid count={4} />;
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon className="w-12 h-12 text-red-500 mx-auto mb-4" icon="mdi:alert-circle" />
            <p className="text-white mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mobile = () => (
    <div className="space-y-4">
      {losers.map((token, index) => (
        <TokenCard
          key={index}
          change={token.change}
          coinId={token.id}
          imgUrl={token.imgUrl}
          name={token.name}
          price={token.price}
          symbol={token.symbol}
        />
      ))}
    </div>
  );

  const desktop = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {losers.map((token) => (
        <TokenCard
          key={token.id}
          change={token.change}
          coinId={token.id}
          imgUrl={token.imgUrl}
          name={token.name}
          price={token.price}
          symbol={token.symbol}
        />
      ))}
    </div>
  );

  return <>{isMobile ? mobile() : desktop()}</>;
};
