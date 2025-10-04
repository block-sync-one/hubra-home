"use client";

import React from "react";
import { useMediaQuery } from "usehooks-ts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

import { PriceChangeChip } from "@/components/price";

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
    <div className={`${config.bgColor} rounded-xl px-1 py-0.5 flex items-center gap-1`}>
      <Icon 
        icon={config.icon}
        className={`w-3 h-3 ${config.iconColor}`}
      />
      <span className={`text-xs font-medium ${config.textColor}`}>
        {Math.abs(value)}%
      </span>
    </div>
  );
});

ChangeIndicator.displayName = 'ChangeIndicator';

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

export const HotTokensContent = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  
  // Sample token data
  const hotTokens = [
    {
      name: "Moo Deng",
      symbol: "MOODENG",
      price: "€0.22",
      change: 20,
      volume: "€207.20M",
      imgUrl: "/logo.svg"
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "€45.67",
      change: -12.5,
      volume: "€156.80M",
      imgUrl: "/logo.svg"
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "€28,450",
      change: 8.3,
      volume: "€2.1B",
      imgUrl: "/logo.svg"
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "€1,890",
      change: -5.2,
      volume: "€890.5M",
      imgUrl: "/logo.svg"
    }
  ];

  const mobile = () => (
    <div className="bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-2xl overflow-hidden">
      <div>
        {hotTokens.map((token, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => router.push(`/tokens/${token.symbol?.toLowerCase()}`)}
          >
            {/* Rank */}
            <div className="mr-4 flex-shrink-0 text-center text-sm text-gray-400 font-normal">
              {index + 1}
            </div>
            
            {/* Token Info */}
            <div className="flex-1 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  alt={token.name} 
                  height={24} 
                  src={token.imgUrl || "/logo.svg"} 
                  width={24}
                  className="w-full h-full object-cover"
                />
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
      {hotTokens.map((token, index) => (
        <HotTokenCard
          key={index}
          name={token.name}
          symbol={token.symbol}
          price={token.price}
          change={token.change}
          imgUrl={token.imgUrl}
        />
      ))}
    </div>
  );

  return <>{isMobile ? mobile() : desktop()}</>;
};
