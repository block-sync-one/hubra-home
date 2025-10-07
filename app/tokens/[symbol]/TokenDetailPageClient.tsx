"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { fixedNumber, formatBigNumbers } from "@/lib/utils";
import { useCurrency } from "@/lib/context/currency-format";

// Lazy load components
const TokenHeader = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenHeader })), {
  loading: () => <div className="h-32 bg-gray-800 animate-pulse rounded mb-8" />,
});

const TokenInfo = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenInfo })), {
  loading: () => <div className="h-16 bg-gray-800 animate-pulse rounded mb-8" />,
});

const TokenStats = dynamic(() => import("@/components/token-detail/TokenHeader").then((mod) => ({ default: mod.TokenStats })), {
  loading: () => <div className="h-32 bg-gray-800 animate-pulse rounded" />,
});

const TokenPriceChart = dynamic(
  () => import("@/components/token-detail/TokenPriceChart").then((mod) => ({ default: mod.TokenPriceChart })),
  {
    loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-2xl" />,
  }
);

const VolumeStats = dynamic(() => import("@/components/token-detail/VolumeStats").then((mod) => ({ default: mod.VolumeStats })), {
  loading: () => <div className="h-48 bg-gray-800 animate-pulse rounded-2xl" />,
});

const TradingSection = dynamic(() => import("@/components/token-detail/TradingSection").then((mod) => ({ default: mod.TradingSection })), {
  loading: () => <div className="h-64 bg-gray-800 animate-pulse rounded-2xl" />,
});

const TokenDescription = dynamic(
  () => import("@/components/token-detail/TokenDescription").then((mod) => ({ default: mod.TokenDescription })),
  { loading: () => <div className="h-48 bg-gray-800 animate-pulse rounded-2xl" /> }
);

interface TokenDetailPageClientProps {
  apiTokenData: any;
  symbol: string;
  tokenName: string;
}

export function TokenDetailPageClient({ apiTokenData, symbol, tokenName }: TokenDetailPageClientProps) {
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const periods = ["24h", "7d", "1M", "3M", "1Y", "All"];

  // Transform API data to match component expectations
  const tokenData = useMemo((): {
    name: string;
    symbol: string;
    price: string;
    change: string;
    marketCap: string;
    marketCapChange: number;
    volume24h: string;
    volume24hChange: number;
    supply: string;
    buyVolume: string;
    buyVolumePercent: number;
    sellVolume: string;
    sellVolumePercent: number;
    exchangeRate: string;
    tradesCount: string;
    tokenAddress: string;
    holders: string;
    description: string;
    imgUrl: string;
    homepage: string;
    twitter: string;
  } => {
    if (!apiTokenData) {
      return {
        name: tokenName || "Loading...",
        symbol: "---",
        price: "0.00",
        change: "0",
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
        homepage: "https://hubra.app",
        twitter: "https://twitter.com/hubra",
      };
    }

    const formatNumber = (num: number) => num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

    // Shorten address for display
    const shortAddress = apiTokenData.address ? `${apiTokenData.address.slice(0, 6)}...${apiTokenData.address.slice(-4)}` : "0x0000...0000";

    // Use API-provided data or show "-" if not available
    const buyVolumePercent = apiTokenData.buy_volume_percent ?? 50; // Default 50 for UI display only
    const sellVolumePercent = apiTokenData.sell_volume_percent ?? 50;

    // Display volumes: show "-" if not available from API
    const hasBuySellData = apiTokenData.buy_volume_24h !== null && apiTokenData.sell_volume_24h !== null;
    const displayBuyVolume = hasBuySellData ? formatPrice(apiTokenData.buy_volume_24h!) : "-";
    const displaySellVolume = hasBuySellData ? formatPrice(apiTokenData.sell_volume_24h!) : "-";

    return {
      name: apiTokenData.name,
      symbol: apiTokenData.symbol,
      price: formatPrice(apiTokenData.price, true),
      change: fixedNumber(apiTokenData.price_change_24h_percent),
      marketCap: apiTokenData.market_cap > 0 ? formatPrice(apiTokenData.market_cap) : "N/A",
      marketCapChange: apiTokenData.price_change_24h_percent,
      volume24h: apiTokenData.volume_24h > 0 ? formatPrice(apiTokenData.volume_24h) : "N/A",
      volume24hChange: apiTokenData.price_change_24h_percent,
      supply: apiTokenData.circulating_supply > 0 ? formatBigNumbers(apiTokenData.circulating_supply) : "N/A",
      buyVolume: displayBuyVolume,
      buyVolumePercent: buyVolumePercent,
      sellVolume: displaySellVolume,
      sellVolumePercent: sellVolumePercent,
      exchangeRate: `1 ${apiTokenData.symbol} ≈ ${formatPrice(apiTokenData.price, true)} USDC`,
      tradesCount: apiTokenData.trade_count_24h > 0 ? formatNumber(apiTokenData.trade_count_24h) : "N/A",
      tokenAddress: shortAddress,
      holders: apiTokenData.holder > 0 ? formatNumber(apiTokenData.holder) : "N/A",
      description: apiTokenData.extensions?.description || "No description available",
      imgUrl: apiTokenData.logo_uri || "/logo.svg",
      homepage: apiTokenData.extensions?.website || "https://hubra.app",
      twitter: apiTokenData.extensions?.twitter || "https://twitter.com/hubra",
    };
  }, [apiTokenData, tokenName, formatPrice]);

  const handleSwap = () => {
    console.log("Swap clicked");
  };

  const handleWebsiteClick = () => {
    if (tokenData.homepage) {
      window.open(tokenData.homepage, "_blank");
    }
  };

  const handleTwitterClick = () => {
    if (tokenData.twitter) {
      window.open(tokenData.twitter, "_blank");
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
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
            change={tokenData.change}
            periods={periods}
            price={tokenData.price}
            selectedPeriod={selectedPeriod}
            tokenId={apiTokenData?.id || symbol}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Token Stats - Mobile only */}
          <div className="md:hidden">
            <TokenStats
              change={tokenData.change}
              marketCap={tokenData.marketCap}
              marketCapChange={tokenData.marketCapChange}
              supply={tokenData.supply}
              volume24h={tokenData.volume24h}
              volume24hChange={tokenData.volume24hChange}
            />
          </div>

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
