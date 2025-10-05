"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

// Lazy load components for better performance
const TokenHeader = dynamic(
  () =>
    import("@/components/token-detail/TokenHeader").then((mod) => ({
      default: mod.TokenHeader,
    })),
  {
    loading: () => <div className="h-32 bg-gray-800 animate-pulse rounded mb-8" />,
  }
);

const PriceChart = dynamic(
  () =>
    import("@/components/token-detail/PriceChart").then((mod) => ({
      default: mod.PriceChart,
    })),
  {
    loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-2xl" />,
  }
);

const VolumeStats = dynamic(
  () =>
    import("@/components/token-detail/VolumeStats").then((mod) => ({
      default: mod.VolumeStats,
    })),
  {
    loading: () => <div className="h-80 bg-gray-800 animate-pulse rounded-2xl" />,
  }
);

const TradingSection = dynamic(
  () =>
    import("@/components/token-detail/TradingSection").then((mod) => ({
      default: mod.TradingSection,
    })),
  {
    loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-2xl" />,
  }
);

const TokenDescription = dynamic(
  () =>
    import("@/components/token-detail/TokenDescription").then((mod) => ({
      default: mod.TokenDescription,
    })),
  {
    loading: () => <div className="h-48 bg-gray-800 animate-pulse rounded-2xl" />,
  }
);

interface TokenDetailPageProps {}

export default function TokenDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const [symbol, setSymbol] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then(({ symbol }) => setSymbol(symbol));
  }, [params]);
  const [selectedPeriod, setSelectedPeriod] = useState("6M");

  // Memoized token data - in real app, fetch from API with caching
  const tokenData = useMemo(
    () => ({
      name: "Moo Deng",
      symbol: "MOODENG",
      price: "0.22",
      change: 75.43,
      marketCap: "$4.02B",
      marketCapChange: 35.54,
      volume24h: "$195.40K",
      volume24hChange: -55.54,
      supply: "$1.0B",
      buyVolume: "$3.24M",
      buyVolumePercent: 75,
      sellVolume: "$1.08M",
      sellVolumePercent: 25,
      exchangeRate: "1 MOODENG ≈ 4.547659 USDC",
      tradesCount: "8.468",
      tokenAddress: "0x88e6...5640",
      holders: "8.468",
      description:
        "Moo Deng (MOODENG) is a memecoin based on the famous pygmy hippopotamus at the Khao Kheow Open Zoo in Si Racha, Chonburi, Thailand. The Solana-based token is held by fans of the hippo, whose community congregates on X and Telegram. As a memecoin, MOODENG has no stated utility, its value instead arising from the vibrancy of its community and the virality of Moo Deng the hippo.",
      imgUrl: "/logo.svg",
    }),
    []
  );

  // Memoized chart data for better performance
  const chartData = useMemo(
    () => [
      { month: "Jan", price: 0.15 },
      { month: "Feb", price: 0.18 },
      { month: "Mar", price: 0.12 },
      { month: "Apr", price: 0.2 },
      { month: "May", price: 0.25 },
      { month: "Jun", price: 0.22 },
    ],
    []
  );

  const periods = useMemo(() => ["24H", "1W", "1M", "6M", "1Y"], []);

  // Memoized event handlers for better performance
  const handleSwap = useCallback(() => {
    // Implement swap functionality
    console.log("Swap initiated");
  }, []);

  const handleTwitterClick = useCallback(() => {
    // Open Twitter profile
    window.open("https://twitter.com/hubra", "_blank");
  }, []);

  const handleWebsiteClick = useCallback(() => {
    // Open project website
    window.open("https://hubra.app", "_blank");
  }, []);

  const handleTokensClick = useCallback(() => {
    // Navigate back to tokens page
    router.push("/tokens");
  }, [router]);

  return (
    <div className="md:max-w-7xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-400 pb-10">
        <button className="hover:text-white transition-colors cursor-pointer" onClick={handleTokensClick}>
          Tokens
        </button>
        <Icon className="h-4 w-4" icon="lucide:chevron-right" />
        <span className="text-white">{tokenData.name}</span>
      </div>

      {/* Token Header */}
      <TokenHeader
        change={tokenData.change}
        imgUrl={tokenData.imgUrl}
        marketCap={tokenData.marketCap}
        marketCapChange={tokenData.marketCapChange}
        name={tokenData.name}
        supply={tokenData.supply}
        symbol={tokenData.symbol}
        volume24h={tokenData.volume24h}
        volume24hChange={tokenData.volume24hChange}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <PriceChart
            chartData={chartData}
            periods={periods}
            price={tokenData.price}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Volume Stats */}
          <VolumeStats
            buyVolume={tokenData.buyVolume}
            buyVolumePercent={tokenData.buyVolumePercent}
            exchangeRate={tokenData.exchangeRate}
            holders={tokenData.holders}
            sellVolume={tokenData.sellVolume}
            sellVolumePercent={tokenData.sellVolumePercent}
            tokenAddress={tokenData.tokenAddress}
            tradesCount={tokenData.tradesCount}
          />
        </div>

        {/* Right Column - Trading and Description */}
        <div className="space-y-6">
          {/* Trading Section */}
          <TradingSection tokenImgUrl={tokenData.imgUrl} tokenName={tokenData.name} onSwap={handleSwap} />

          {/* Description */}
          <TokenDescription description={tokenData.description} onTwitterClick={handleTwitterClick} onWebsiteClick={handleWebsiteClick} />
        </div>
      </div>
    </div>
  );
}
