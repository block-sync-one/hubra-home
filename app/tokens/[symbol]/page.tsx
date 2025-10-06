"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { useTokenData } from "@/lib/hooks/useTokenData";
import { formatBigNumbers } from "@/lib/utils";
import { useCurrency } from "@/lib/context/currency-format";

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

const TokenInfo = dynamic(
  () =>
    import("@/components/token-detail/TokenHeader").then((mod) => ({
      default: mod.TokenInfo,
    })),
  {
    loading: () => <div className="h-16 bg-gray-800 animate-pulse rounded mb-8" />,
  }
);

const TokenStats = dynamic(
  () =>
    import("@/components/token-detail/TokenHeader").then((mod) => ({
      default: mod.TokenStats,
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
  const { formatPrice } = useCurrency();
  const [tokenName, setTokenName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then(({ symbol }) => {
      // Convert URL parameter back to token name (replace dashes with spaces and capitalize)
      const name = symbol.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      setTokenName(name);
    });
  }, [params]);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  // Fetch real token data from API
  const [urlTokenName, setUrlTokenName] = useState<string>("");

  useEffect(() => {
    params.then(({ symbol }) => setUrlTokenName(symbol));
  }, [params]);

  const { tokenData: apiTokenData, loading, error, retry, isFallbackData } = useTokenData(urlTokenName);

  // Transform API data to match component expectations
  const tokenData = useMemo(() => {
    if (!apiTokenData) {
      return {
        name: tokenName || "Loading...",
        symbol: "---",
        price: "0.00",
        change: 0,
        marketCap: "$0.00",
        marketCapChange: 0,
        volume24h: "$0.00",
        volume24hChange: 0,
        supply: "$0.00",
        buyVolume: "$0.00",
        buyVolumePercent: 50,
        sellVolume: "$0.00",
        sellVolumePercent: 50,
        exchangeRate: "1 --- ≈ 0.000000 USDC",
        tradesCount: "0",
        tokenAddress: "0x0000...0000",
        holders: "0",
        description: "Loading token information...",
        imgUrl: "/logo.svg",
      };
    }

    const formatNumber = (num: number) => num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    console.warn(apiTokenData.market_data);

    return {
      name: apiTokenData.name,
      symbol: apiTokenData.symbol,
      price: formatPrice(apiTokenData.market_data.current_price.usd, true),
      change: apiTokenData.market_data.price_change_percentage_24h,
      marketCap: formatPrice(apiTokenData.market_data.market_cap.usd),
      marketCapChange: apiTokenData.market_data.market_cap_change_percentage_24h,
      volume24h: formatPrice(apiTokenData.market_data.total_volume.usd),
      volume24hChange: null, // TODO
      supply: formatBigNumbers(apiTokenData.market_data.market_cap.usd), // Using market cap as supply proxy
      buyVolume: formatPrice(apiTokenData.market_data.total_volume.usd),
      buyVolumePercent: null, // TODO
      sellVolume: formatPrice(apiTokenData.market_data.total_volume.usd),
      sellVolumePercent: null, // TODO
      exchangeRate: `1 ${apiTokenData.symbol} ≈ ${formatPrice(apiTokenData.market_data.current_price.usd, true)} USDC`,
      tradesCount: formatNumber(apiTokenData.market_data.total_volume.usd / 1000), // Estimated
      tokenAddress: "0x0000...0000", // TODO
      holders: formatNumber(apiTokenData.community_score * 1000), // Estimated based on community score
      description: apiTokenData.description || "No description available",
      imgUrl: apiTokenData.image.large || "/logo.svg",
      homepage: apiTokenData.links?.homepage?.[0] || "https://hubra.app",
      twitter: apiTokenData.links.twitter_screen_name
        ? `https://twitter.com/${apiTokenData.links.twitter_screen_name}`
        : "https://twitter.com/hubra",
    };
  }, [apiTokenData, tokenName]);

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

  const periods = useMemo(() => ["24h", "7d", "1M", "3M", "1Y", "All"], []);

  const handleSwap = useCallback(() => {
    window.open("https://hubra.app/convert", "_blank");
  }, []);

  const handleTwitterClick = useCallback(() => {
    // Open Twitter profile from API data
    if (!tokenData.twitter) return;

    const twitterUrl = tokenData.twitter.startsWith("http") ? tokenData.twitter : `https://${tokenData.twitter}`;

    window.open(twitterUrl, "_blank");
  }, [tokenData.twitter]);

  const handleWebsiteClick = useCallback(() => {
    // Open project website from API data
    if (!tokenData.homepage) return;

    const websiteUrl = tokenData.homepage.startsWith("http") ? tokenData.homepage : `https://${tokenData.homepage}`;

    window.open(websiteUrl, "_blank");
  }, [tokenData.homepage]);

  const handleTokensClick = useCallback(() => {
    // Navigate back to tokens page
    router.push("/tokens");
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
            <p className="text-gray-400 text-lg">Loading token data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Icon className="w-16 h-16 text-red-500 mb-4" icon="mdi:alert-circle" />
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Token</h2>
            <p className="text-gray-400 text-center mb-6 max-w-md">{error}</p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={retry}>
                Try Again
              </button>
              <button
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => router.push("/tokens")}>
                Back to Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-7xl mx-auto">
      {/* Fallback data indicator */}
      {isFallbackData && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-yellow-500" icon="mdi:warning" />
            <span className="text-yellow-200 text-sm font-medium">Using cached data - API temporarily unavailable</span>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-400 pb-10">
        <button className="hover:text-white transition-colors cursor-pointer" onClick={handleTokensClick}>
          Tokens
        </button>
        <Icon className="h-4 w-4" icon="lucide:chevron-right" />
        <span className="text-white">{tokenName || tokenData.name}</span>
      </div>

      {/* Token Header - Desktop only (original layout) */}
      <div className="hidden md:block">
        <TokenHeader
          change={tokenData.change}
          imgUrl={tokenData.imgUrl}
          marketCap={tokenData.marketCap}
          marketCapChange={tokenData.marketCapChange}
          name={tokenData.name}
          supply={tokenData.supply}
          symbol={tokenData.symbol}
          volume24h={tokenData.volume24h}
          volume24hChange={tokenData.volume24hChange ?? 0}
        />
      </div>

      {/* Token Info - Mobile only (above chart) */}
      <div className="md:hidden mb-8">
        <TokenInfo imgUrl={tokenData.imgUrl} name={tokenData.name} symbol={tokenData.symbol} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <PriceChart
            periods={periods}
            price={tokenData.price}
            selectedPeriod={selectedPeriod}
            tokenId={apiTokenData?.id || ""}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Token Stats - Mobile only (below chart) */}
          <div className="md:hidden">
            <TokenStats
              change={tokenData.change}
              marketCap={tokenData.marketCap}
              marketCapChange={tokenData.marketCapChange}
              supply={tokenData.supply}
              volume24h={tokenData.volume24h}
              volume24hChange={tokenData.volume24hChange ?? 0}
            />
          </div>

          {/* Volume Stats */}
          <VolumeStats
            buyVolume={tokenData.buyVolume}
            buyVolumePercent={tokenData.buyVolumePercent ?? 0}
            exchangeRate={tokenData.exchangeRate}
            holders={tokenData.holders}
            sellVolume={tokenData.sellVolume}
            sellVolumePercent={tokenData.sellVolumePercent ?? 0}
            tokenAddress={tokenData.tokenAddress}
            tradesCount={tokenData.tradesCount}
          />
        </div>

        {/* Right Column - Trading and Description */}
        <div className="space-y-6">
          {/* Trading Section */}
          <TradingSection
            currentPrice={apiTokenData?.market_data?.current_price?.usd || 0}
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
