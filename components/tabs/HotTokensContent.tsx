"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { TokenCard } from "./TokenCard";
import { TokenCardSkeletonGrid, TokenCardSkeletonStack } from "./TokenCardSkeleton";

import { ChangeIndicator } from "@/components/price";
import { useCryptoData } from "@/lib/hooks/useCryptoData";
import { ICON_SIZES, BREAKPOINTS } from "@/lib/constants";
import { useCurrentToken } from "@/lib/context/current-token-context";
import { useBatchPrefetch } from "@/lib/hooks/usePrefetch";

export const HotTokensContent = () => {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE);
  const router = useRouter();
  const { setCurrentToken } = useCurrentToken();
  const { prefetchTokens } = useBatchPrefetch();

  // Live crypto data from Birdeye
  const { hotTokens, loading, error, retry } = useCryptoData();

  // Prefetch all visible hot tokens when they load
  React.useEffect(() => {
    if (hotTokens && hotTokens.length > 0) {
      prefetchTokens(hotTokens);
    }
  }, [hotTokens, prefetchTokens]);

  const handleTokenClick = (token: any) => {
    // Store token data in context
    setCurrentToken({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      imgUrl: token.imgUrl,
      price: token.price,
      change: token.change,
    });

    // Navigate with token address directly
    router.push(`/tokens/${token.id}`);
  };

  // Enhanced loading state
  if (loading) {
    return isMobile ? <TokenCardSkeletonStack count={4} /> : <TokenCardSkeletonGrid count={4} />;
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icon
          className="text-red-500 mb-4"
          icon="mdi:alert-circle"
          style={{ width: ICON_SIZES.EXTRA_LARGE, height: ICON_SIZES.EXTRA_LARGE }}
        />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load Data</h3>
        <p className="text-gray-400 text-center mb-4 max-w-md">{error}</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={retry}>
            Retry
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!hotTokens || hotTokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Icon
          className="text-gray-500 mb-4"
          icon="mdi:database-off"
          style={{ width: ICON_SIZES.EXTRA_LARGE, height: ICON_SIZES.EXTRA_LARGE }}
        />
        <h3 className="text-lg font-semibold text-white mb-2">No Data Available</h3>
        <p className="text-gray-400 text-center mb-6">Unable to fetch cryptocurrency data at this time.</p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const mobile = () => (
    <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">
      <div>
        {hotTokens.map((token, index) => (
          <div
            key={token.id}
            aria-label="Token details"
            className="flex items-center p-3 hover:bg-white/5 transition-colors cursor-pointer"
            role="button"
            onClick={() => handleTokenClick(token)}>
            {/* Rank */}
            <div className="mr-4 flex-shrink-0 text-center text-sm text-gray-400 font-normal">{index + 1}</div>

            {/* Token Info */}
            <div className="flex-1 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image alt={token.name} className="w-full h-full object-cover" height={24} src={token.imgUrl || "/logo.svg"} width={24} />
              </div>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-white">{token.name}</span>
              </div>
            </div>

            {/* Change */}
            <div className="w-20 flex justify-start">
              <ChangeIndicator value={token.change} />
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-24">
              <span className="text-xs text-gray-400">Vol</span>
              <span className="text-sm font-medium text-white">{token.volume}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const desktop = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {hotTokens.map((token) => (
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

  return isMobile ? mobile() : desktop();
};
