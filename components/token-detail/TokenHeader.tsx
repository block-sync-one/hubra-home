import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { fixedNumber } from "@/lib/utils";

interface TokenHeaderProps {
  name: string;
  symbol: string;
  imgUrl: string;
  change: string;
  marketCap: string;
  marketCapChange: number;
  volume24h: string;
  volume24hChange: number;
  supply: string;
}

// Helper component for stat cards
function StatCard({
  label,
  value,
  change,
  isPositive,
  roundedClass,
  valueClass,
}: {
  label: string;
  value: string;
  change?: number;
  isPositive?: boolean;
  roundedClass: string;
  valueClass?: string;
}) {
  return (
    <div className={`${roundedClass} p-4 md:p-0`}>
      <p className={`text-sm font-medium text-gray-400 mb-1`}>{label}:</p>
      <div className="flex items-center gap-2">
        <p className={`text-lg font-medium ${valueClass}`}>{value}</p>
        {change && (
          <div className="flex items-center gap-0.5">
            <Icon
              className={`h-3 w-3 ${isPositive ? "text-success-500" : "text-error-500"} ${!isPositive ? "rotate-180" : ""}`}
              icon="mdi:arrow-up"
            />
            <span className={`text-xs font-medium ${isPositive ? "text-success-500" : "text-error-500"}`}>{fixedNumber(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Token info component (name, symbol, image)
export function TokenInfo({ name, symbol, imgUrl }: { name: string; symbol: string; imgUrl: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <Image
          priority
          alt={`${name} token logo`}
          className="w-full h-full object-cover"
          height={32}
          sizes="32px"
          src={imgUrl}
          width={32}
        />
      </div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium text-white">{name}</h1>
        <span className="text-xl font-medium text-gray-400 uppercase">{symbol}</span>
      </div>
    </div>
  );
}

// Stats component (StatCard)
export function TokenStats({
  change,
  marketCap,
  marketCapChange,
  volume24h,
  volume24hChange,
  supply,
}: {
  change: string;
  marketCap: string;
  marketCapChange: number;
  volume24h: string;
  volume24hChange: number;
  supply: string;
}) {
  const changeValue = parseFloat(change);
  const stats = [
    {
      label: "Change",
      value: `${fixedNumber(changeValue)}%`,
      valueClass: `${changeValue > 0 ? "text-success-500" : "text-error-500"}`,
      roundedClass: "rounded-tl-lg",
    },
    { label: "Market Cap", value: marketCap, roundedClass: "rounded-tr-lg" },
    {
      label: "24 Hour Trading Vol",
      value: volume24h,
      change: volume24hChange,
      isPositive: volume24hChange > 0,
      roundedClass: "rounded-bl-lg",
    },
    { label: "Supply", value: supply, roundedClass: "rounded-br-lg" },
  ];

  return (
    <div className="w-full md:w-auto">
      <div className="bg-card rounded-xl md:bg-transparent grid grid-cols-2 md:flex md:gap-12">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            change={stat.change}
            isPositive={stat.isPositive}
            label={stat.label}
            roundedClass={stat.roundedClass}
            value={stat.value}
            valueClass={stat.valueClass}
          />
        ))}
      </div>
    </div>
  );
}

// Main TokenHeader component (keeps original structure for desktop)
export function TokenHeader({
  name,
  symbol,
  imgUrl,
  change,
  marketCap,
  marketCapChange,
  volume24h,
  volume24hChange,
  supply,
}: TokenHeaderProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <TokenInfo imgUrl={imgUrl} name={name} symbol={symbol} />
        <TokenStats
          change={change}
          marketCap={marketCap}
          marketCapChange={marketCapChange}
          supply={supply}
          volume24h={volume24h}
          volume24hChange={volume24hChange}
        />
      </div>
    </div>
  );
}
