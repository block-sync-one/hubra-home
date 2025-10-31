"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";

import { useCurrency } from "@/lib/context/currency-format";
import { TokenHeader, TokenInfo, TokenStats } from "@/components/token-detail/TokenHeader";
import { fixedNumber, formatBigNumbers } from "@/lib/utils";
import { CHART_PERIODS, VOLUME_DEFAULTS, type ChartPeriod } from "@/lib/constants/token-detail";
import { formatNumberWithPrefix, calculateVolumePercentages, getSafeLogoUrl, getTokenDescription } from "@/lib/utils/token-formatters";

// Dynamic imports for better code splitting
const VolumeStats = dynamic(() => import("@/components/token-detail/VolumeStats").then((mod) => ({ default: mod.VolumeStats })));
const TradingSection = dynamic(() => import("@/components/token-detail/TradingSection").then((mod) => ({ default: mod.TradingSection })));
const TokenDescription = dynamic(() =>
  import("@/components/token-detail/TokenDescription").then((mod) => ({ default: mod.TokenDescription }))
);
const TokenPriceChart = dynamic(() =>
  import("@/components/token-detail/TokenPriceChart").then((mod) => ({ default: mod.TokenPriceChart }))
);

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

interface TokenDetailPageClientProps {
  apiTokenData: TokenOverviewData | null;
}

export function TokenDetailPageClient({ apiTokenData }: TokenDetailPageClientProps) {
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>("24h");

  // Memoize period change handler
  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period as ChartPeriod);
  }, []);

  // Memoize navigation handler
  const handleBackToTokens = useCallback(() => {
    router.push("/tokens");
  }, [router]);

  // Memoize formatted data to avoid recalculation on every render
  const formattedData = useMemo(() => {
    if (!apiTokenData) return null;

    const formatNumber = (value: number | undefined, prefix = "") => formatNumberWithPrefix(value, formatPrice, prefix);

    const { buyPercent, sellPercent } = calculateVolumePercentages(
      apiTokenData.vBuy24hUSD,
      apiTokenData.vSell24hUSD,
      apiTokenData.v24hUSD,
      VOLUME_DEFAULTS.DEFAULT_PERCENT
    );

    const logoUrl = getSafeLogoUrl(apiTokenData.logoURI);
    const description = getTokenDescription(apiTokenData.name, apiTokenData.symbol, apiTokenData.extensions?.description);

    return {
      // Basic info
      name: apiTokenData.name,
      symbol: apiTokenData.symbol,
      address: apiTokenData.address,
      logoUrl,
      description,

      // Formatted numbers
      price: formatPrice(apiTokenData.price || 0),
      marketCap: formatNumber(apiTokenData.marketCap),
      volume24h: formatNumber(apiTokenData.v24hUSD),
      supply: formatBigNumbers(apiTokenData.totalSupply),
      buyVolume: formatNumber(apiTokenData.vBuy24hUSD),
      sellVolume: formatNumber(apiTokenData.vSell24hUSD),
      holders: (apiTokenData.holder || 0).toLocaleString(),
      tradesCount: (apiTokenData.trade24h || 0).toLocaleString(),

      // Raw numbers for calculations
      rawPrice: apiTokenData.price || 0,
      priceChange24h: apiTokenData.priceChange24hPercent || 0,
      priceChange24hFormatted: fixedNumber(apiTokenData.priceChange24hPercent) || "0",
      priceChange24hFixed: apiTokenData.priceChange24hPercent?.toFixed(2) || "0",
      volume24hChange: apiTokenData.v24hChangePercent || 0,

      // Volume percentages
      buyPercent,
      sellPercent,

      // Exchange rate
      exchangeRate: `1 ${apiTokenData.symbol} ≈ ${formatPrice(apiTokenData.price || 0, true)}`,

      // Social links
      twitter: apiTokenData.extensions?.twitter,
      website: apiTokenData.extensions?.website,
    };
  }, [apiTokenData, formatPrice]);

  // Handle case when token data is not available
  if (!apiTokenData || !formattedData) {
    return (
      <div className="min-h-screen text-white md:max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" icon="mdi:alert-circle" />
          <h2 className="text-2xl font-bold mb-4">Token Not Found</h2>
          <p className="text-gray-400 mb-6">Unable to load token data. Please try again later.</p>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="button"
            onClick={handleBackToTokens}>
            Back to Tokens
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white md:max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-8 text-gray-400">
        <button
          aria-label="Navigate back to tokens list"
          className="cursor-pointer hover:text-white transition-colors bg-transparent border-none p-0 text-gray-400 text-sm focus:outline-none focus:text-white"
          type="button"
          onClick={handleBackToTokens}>
          Tokens
        </button>
        <Icon aria-hidden="true" className="h-4 w-4" icon="lucide:chevron-right" />
        <span className="text-white font-medium">{formattedData.name}</span>
      </nav>

      {/* Token Header - Desktop only */}
      <div className="hidden md:block">
        <TokenHeader
          change={formattedData.priceChange24hFixed}
          logoURI={formattedData.logoUrl}
          marketCap={formattedData.marketCap}
          marketCapChange={formattedData.priceChange24h}
          name={formattedData.name}
          supply={formattedData.supply}
          symbol={formattedData.symbol}
          volume24h={formattedData.volume24h}
          volume24hChange={formattedData.volume24hChange}
        />
      </div>

      {/* Token Info - Mobile only */}
      <div className="md:hidden mb-3">
        <TokenInfo logoURI={formattedData.logoUrl} name={formattedData.name} symbol={formattedData.symbol} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <TokenPriceChart
            change={formattedData.priceChange24hFixed}
            periods={[...CHART_PERIODS]}
            price={formattedData.price}
            selectedPeriod={selectedPeriod}
            tokenId={formattedData.address}
            onPeriodChange={handlePeriodChange}
          />

          {/* Token Stats - Mobile only */}
          <div className="md:hidden">
            <TokenStats
              change={formattedData.priceChange24hFormatted}
              marketCap={formattedData.marketCap}
              marketCapChange={formattedData.priceChange24h}
              supply={formattedData.supply}
              volume24h={formattedData.volume24h}
              volume24hChange={formattedData.volume24hChange}
            />
          </div>

          {/* Volume Stats */}
          <VolumeStats
            buyVolume={formattedData.buyVolume}
            buyVolumePercent={formattedData.buyPercent}
            exchangeRate={formattedData.exchangeRate}
            holders={formattedData.holders}
            sellVolume={formattedData.sellVolume}
            sellVolumePercent={formattedData.sellPercent}
            tokenAddress={formattedData.address}
            tradesCount={formattedData.tradesCount}
          />
        </div>

        {/* Right Column - Trading and Description */}
        <div className="space-y-4">
          <TradingSection
            currentPrice={formattedData.rawPrice}
            tokenName={formattedData.name}
            tokenSymbol={formattedData.symbol}
            tokenlogoURI={formattedData.logoUrl}
          />

          <TokenDescription description={formattedData.description} twitter={formattedData.twitter} website={formattedData.website} />
        </div>
      </div>
    </div>
  );
}
