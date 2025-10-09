"use client";

import type { TokenDetail } from "@/lib/types/token";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { useCurrency } from "@/lib/context/currency-format";
import { useCurrentToken } from "@/lib/context/current-token-context";
import { toTokenDetail } from "@/lib/helpers/token";
import {
  TokenHeaderSkeleton,
  TokenInfoSkeleton,
  TokenStatsSkeleton,
  TokenPriceChartSkeleton,
  VolumeStatsSkeleton,
  TradingSectionSkeleton,
  TokenDescriptionSkeleton,
} from "@/components/token-detail/TokenDetailSkeleton";

// Lazy load components with proper skeletons
const TokenHeader = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenHeader })), {
  loading: () => <TokenHeaderSkeleton />,
});

const TokenInfo = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenInfo })), {
  loading: () => <TokenInfoSkeleton />,
});

const TokenStats = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenStats })), {
  loading: () => <TokenStatsSkeleton />,
});

const TokenPriceChart = dynamic(
  () => import("@/components/token-detail/TokenPriceChart").then((mod) => ({ default: mod.TokenPriceChart })),
  {
    loading: () => <TokenPriceChartSkeleton />,
  }
);

const VolumeStats = dynamic(() => import("@/components/token-detail/VolumeStats").then((mod) => ({ default: mod.VolumeStats })), {
  loading: () => <VolumeStatsSkeleton />,
});

const TradingSection = dynamic(() => import("@/components/token-detail/TradingSection").then((mod) => ({ default: mod.TradingSection })), {
  loading: () => <TradingSectionSkeleton />,
});

const TokenDescription = dynamic(
  () => import("@/components/token-detail/TokenDescription").then((mod) => ({ default: mod.TokenDescription })),
  { loading: () => <TokenDescriptionSkeleton /> }
);

interface TokenDetailPageClientProps {
  apiTokenData: any; // Server-fetched data
  tokenAddress: string; // Resolved token address
  symbol: string;
  tokenName: string;
}

export function TokenDetailPageClient({ apiTokenData, tokenAddress, symbol, tokenName }: TokenDetailPageClientProps) {
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const { currentToken } = useCurrentToken();
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const periods = ["24h", "7d", "1M", "3M", "1Y", "All"];

  // Transform API data using simple helper function
  const tokenData: TokenDetail = useMemo(() => {
    if (!apiTokenData) {
      // Return minimal placeholder while loading
      return {
        name: tokenName || "Loading...",
        symbol: "...",
        imgUrl: "/logo.svg",
        address: tokenAddress,
        addressShort: "...",
        price: "$0.00",
        priceChange: "0",
        priceChangePercent: 0,
        marketCap: "N/A",
        volume24h: "N/A",
        supply: "N/A",
        buyVolume: "-",
        sellVolume: "-",
        buyPercent: 50,
        sellPercent: 50,
        holders: "0",
        trades: "0",
        description: "Loading...",
        website: "https://hubra.app",
        twitter: "https://twitter.com/hubra",
      };
    }

    // Simple one-line transformation
    return toTokenDetail(apiTokenData, formatPrice, currentToken?.imgUrl);
  }, [apiTokenData, formatPrice, currentToken, tokenName, tokenAddress]);

  const handleSwap = () => {
    console.log("Swap clicked");
  };

  const handleWebsiteClick = () => {
    if (tokenData.website) {
      window.open(tokenData.website, "_blank");
    }
  };

  const handleTwitterClick = () => {
    if (tokenData.twitter) {
      window.open(tokenData.twitter, "_blank");
    }
  };

  return (
    <div className="min-h-screen text-white md:max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6 text-gray-400">
        <button
          className="cursor-pointer hover:text-white transition-colors bg-transparent border-none p-0 text-gray-400 text-sm"
          type="button"
          onClick={() => router.push("/tokens")}>
          Tokens
        </button>
        <Icon className="h-4 w-4" icon="lucide:chevron-right" />
        <span className="text-white">{tokenName || tokenData.name}</span>
      </div>

      {/* Token Header - Desktop only */}
      <div className="hidden md:block">
        <TokenHeader
          change={tokenData.priceChange}
          imgUrl={tokenData.imgUrl}
          marketCap={tokenData.marketCap}
          marketCapChange={tokenData.priceChangePercent}
          name={tokenData.name}
          supply={tokenData.supply}
          symbol={tokenData.symbol}
          volume24h={tokenData.volume24h}
          volume24hChange={tokenData.priceChangePercent}
        />
      </div>

      {/* Token Info - Mobile only */}
      <div className="md:hidden mb-8">
        <TokenInfo imgUrl={tokenData.imgUrl} name={tokenData.name} symbol={tokenData.symbol} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <TokenPriceChart
            change={tokenData.priceChange}
            periods={periods}
            price={tokenData.price}
            selectedPeriod={selectedPeriod}
            tokenId={tokenAddress}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Token Stats - Mobile only */}
          <div className="md:hidden">
            <TokenStats
              change={tokenData.priceChange}
              marketCap={tokenData.marketCap}
              marketCapChange={tokenData.priceChangePercent}
              supply={tokenData.supply}
              volume24h={tokenData.volume24h}
              volume24hChange={tokenData.priceChangePercent}
            />
          </div>

          {/* Volume Stats */}
          <VolumeStats
            buyVolume={tokenData.buyVolume}
            buyVolumePercent={tokenData.buyPercent}
            exchangeRate={`1 ${tokenData.symbol} ≈ ${tokenData.price}`}
            holders={tokenData.holders}
            sellVolume={tokenData.sellVolume}
            sellVolumePercent={tokenData.sellPercent}
            tokenAddress={tokenData.addressShort}
            tradesCount={tokenData.trades}
          />
        </div>

        {/* Right Column - Trading and Description */}
        <div className="space-y-6">
          {/* Trading Section */}
          <TradingSection
            currentPrice={apiTokenData?.price || 0}
            tokenImgUrl={tokenData.imgUrl}
            tokenName={tokenData.name}
            tokenSymbol={tokenData.symbol}
            onSwap={handleSwap}
          />

          {/* Description */}
          <TokenDescription description={tokenData.description} onTwitterClick={handleTwitterClick} onWebsiteClick={handleWebsiteClick} />
        </div>
      </div>
    </div>
  );
}
