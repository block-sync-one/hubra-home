"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { useCryptoData } from "@/lib/hooks/useCryptoData";
import { TokenCard } from "./TokenCard";

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;
  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-error-500",
    iconColor: isPositive ? "text-success-500" : "text-error-500"
  };
};

const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);
  
  return (
    <div className={`flex items-center gap-1 ${config.bgColor} rounded-lg px-2 py-1`}>
      <Icon 
        icon={config.icon} 
        className={`w-3 h-3 ${config.iconColor}`}
      />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {Math.abs(value).toFixed(1)}%
      </span>
    </div>
  );
});

ChangeIndicator.displayName = "ChangeIndicator";

interface HotTokenCardProps {
  name: string;
  symbol?: string;
  imgUrl?: string;
  price?: string;
  change?: number;
  volume?: string;
  className?: string;
}

export function HotTokenCard({
  name,
  symbol,
  imgUrl,
  price,
  change,
  volume,
}: HotTokenCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (symbol) {
      router.push(`/tokens/${symbol.toLowerCase()}`);
    }
  };

  return (
    <div 
      className="backdrop-blur-[10px] bg-white/5 border border-white/10 rounded-xl p-4 min-h-[140px] flex flex-col cursor-pointer hover:bg-white/10 transition-colors"
      onClick={handleClick}
    >
      {/* Header with token info */}
      <div className="flex items-center gap-3 mb-4 pb-4 -mx-4 px-4 border-b border-white/10">
        <div className="w-5 h-5 rounded-full overflow-hidden">
          <Image 
            alt={name} 
            height={20} 
            src={imgUrl || "/logo.svg"} 
            width={20}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{name}</span>
          {symbol && (
            <span className="text-sm text-gray-400">{symbol}</span>
          )}
        </div>
      </div>

      {/* Price and change */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-lg font-medium text-white">
          {price}
        </span>
        {change !== undefined && (
          <ChangeIndicator value={change} />
        )}
      </div>

      {/* Mini chart placeholder */}
      <div className="flex-1 relative">
        <div className="h-14 w-full bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg flex items-end">
          <div className="w-full h-full bg-gradient-to-t from-green-500/30 to-transparent rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export const GainersContent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  
  // Live crypto data from CoinGecko
  const { gainers, loading, error } = useCryptoData();

  // Loading state
  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading live data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-white mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mobile = () => (
    <div className="space-y-4">
      {gainers.map((token, index) => (
        <TokenCard
          key={index}
          name={token.name}
          symbol={token.symbol}
          price={token.price}
          change={token.change}
          imgUrl={token.imgUrl}
          coinId={token.id}
        />
      ))}
    </div>
  );

  const desktop = () => (
    <div className="flex gap-4 w-full overflow-x-auto scrollbar-none pb-2">
      {gainers.map((token, index) => (
        <div key={index} className="flex-shrink-0 w-80">
          <TokenCard
            name={token.name}
            symbol={token.symbol}
            price={token.price}
            change={token.change}
            imgUrl={token.imgUrl}
            coinId={token.id}
          />
        </div>
      ))}
    </div>
  );

  return <>{isMobile ? mobile() : desktop()}</>;
};
