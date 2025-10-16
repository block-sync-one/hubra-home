"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { useCurrency } from "@/lib/context/currency-format";
import {
  TokenHeaderSkeleton,
  TokenInfoSkeleton,
  TokenStatsSkeleton,
  TokenPriceChartSkeleton,
  VolumeStatsSkeleton,
  TradingSectionSkeleton,
  TokenDescriptionSkeleton,
} from "@/components/token-detail/TokenDetailSkeleton";
import { fixedNumber, formatBigNumbers } from "@/lib/utils";

type TokenOverviewData = {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price: number;
  priceChange24hPercent: number;
  v24hUSD: number;
  v24hChangePercent?: number;
  vBuy24hUSD?: number;
  vSell24hUSD?: number;
  marketCap: number;
  liquidity: number;
  holder: number;
  decimals: number;
  fdv: number;
  totalSupply: number;
  circulatingSupply: number;
  trade24h: number;
  extensions?: {
    twitter?: string;
    website?: string;
    description?: string;
    discord?: string;
    coingeckoId?: string;
  };
};

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
  apiTokenData: TokenOverviewData | null;
}

export function TokenDetailPageClient({ apiTokenData }: TokenDetailPageClientProps) {
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const periods = ["24h", "7d", "1M", "3M", "1Y", "All"];

  // Handle case when token data is not available
  if (!apiTokenData) {
    return (
      <div className="min-h-screen text-white md:max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Token Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load token data. Please try again later.</p>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            type="button"
            onClick={() => router.push("/tokens")}>
            Back to Tokens
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (value: number | undefined, prefix = "") => {
    if (!value) return "N/A";

    return prefix + formatPrice(value);
  };
  const buyVolume = apiTokenData.vBuy24hUSD ?? 0;
  const sellVolume = apiTokenData.vSell24hUSD ?? 0;
  const totalVolume = apiTokenData.v24hUSD ?? 1;
  const buyPercent = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 50;
  const sellPercent = totalVolume > 0 ? (sellVolume / totalVolume) * 100 : 50;

  return (
    <div className="min-h-screen text-white md:max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8 text-gray-400">
        <button
          className="cursor-pointer hover:text-white transition-colors bg-transparent border-none p-0 text-gray-400 text-sm"
          type="button"
          onClick={() => router.push("/tokens")}>
          Tokens
        </button>
        <Icon className="h-4 w-4" icon="lucide:chevron-right" />
        <span className="text-white">{apiTokenData.name}</span>
      </div>

      {/* Token Header - Desktop only */}
      <div className="hidden md:block">
        <TokenHeader
          change={apiTokenData.priceChange24hPercent?.toFixed(2) || "0"}
          imgUrl={apiTokenData.logoURI || "/logo.svg"}
          marketCap={formatNumber(apiTokenData.marketCap)}
          marketCapChange={apiTokenData.priceChange24hPercent || 0}
          name={apiTokenData.name}
          supply={formatBigNumbers(apiTokenData.totalSupply)}
          symbol={apiTokenData.symbol}
          volume24h={formatNumber(apiTokenData.v24hUSD)}
          volume24hChange={apiTokenData.v24hChangePercent || 0}
        />
      </div>

      {/* Token Info - Mobile only */}
      <div className="md:hidden mb-3">
        <TokenInfo imgUrl={apiTokenData.logoURI || "/logo.svg"} name={apiTokenData.name} symbol={apiTokenData.symbol} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <TokenPriceChart
            change={apiTokenData.priceChange24hPercent?.toFixed(2) || "0"}
            periods={periods}
            price={formatPrice(apiTokenData.price || 0)}
            selectedPeriod={selectedPeriod}
            tokenId={apiTokenData.address}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Token Stats - Mobile only */}
          <div className="md:hidden">
            <TokenStats
              change={fixedNumber(apiTokenData.priceChange24hPercent) || "0"}
              marketCap={formatNumber(apiTokenData.marketCap)}
              marketCapChange={apiTokenData.priceChange24hPercent || 0}
              supply={formatBigNumbers(apiTokenData.totalSupply)}
              volume24h={formatNumber(apiTokenData.v24hUSD)}
              volume24hChange={apiTokenData.v24hChangePercent || 0}
            />
          </div>

          {/* Volume Stats */}
          <VolumeStats
            buyVolume={formatNumber(apiTokenData.vBuy24hUSD)}
            buyVolumePercent={buyPercent}
            exchangeRate={`1 ${apiTokenData.symbol} ≈ ${formatPrice(apiTokenData.price || 0, true)}`}
            holders={(apiTokenData.holder || 0).toLocaleString()}
            sellVolume={formatNumber(apiTokenData.vSell24hUSD)}
            sellVolumePercent={sellPercent}
            tokenAddress={apiTokenData.address}
            tradesCount={(apiTokenData.trade24h || 0).toLocaleString()}
          />
        </div>

        {/* Right Column - Trading and Description */}
        <div className="space-y-6">
          <TradingSection
            currentPrice={apiTokenData.price || 0}
            tokenImgUrl={apiTokenData.logoURI || "/logo.svg"}
            tokenName={apiTokenData.name}
            tokenSymbol={apiTokenData.symbol}
          />

          <TokenDescription
            description={
              apiTokenData.extensions?.description || `${apiTokenData.name} (${apiTokenData.symbol}) is a token on the Solana blockchain.`
            }
            twitter={apiTokenData.extensions?.twitter}
            website={apiTokenData.extensions?.website}
          />
        </div>
      </div>
    </div>
  );
}
