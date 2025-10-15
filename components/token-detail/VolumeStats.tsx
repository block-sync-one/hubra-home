import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

import { formatBigNumbers } from "@/lib/utils";

interface VolumeStatsProps {
  buyVolume: string;
  buyVolumePercent: number;
  sellVolume: string;
  sellVolumePercent: number;
  exchangeRate: string;
  tradesCount: string;
  tokenAddress: string;
  holders: string;
}

// Reusable components to eliminate duplication
const VolumeBar = ({ label, volume, percentage, isBuy }: { label: string; volume: string; percentage: number; isBuy: boolean }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{volume}</span>
          <span className="text-base font-medium text-gray-400">({formatBigNumbers(percentage)}%)</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className={`h-1 ${isBuy ? "bg-success-500" : "bg-error-500"} rounded`} style={{ width: `${percentage}%` }} />
        <div className="h-1 bg-white/10 rounded" style={{ width: `${100 - percentage}%` }} />
      </div>
    </div>
  );
};

const VolumeSection = ({
  buyVolume,
  buyVolumePercent,
  sellVolume,
  sellVolumePercent,
}: {
  buyVolume: string;
  buyVolumePercent: number;
  sellVolume: string;
  sellVolumePercent: number;
}) => (
  <div className="space-y-6">
    <VolumeBar isBuy={true} label="Buy vol" percentage={buyVolumePercent} volume={buyVolume} />
    <VolumeBar isBuy={false} label="Sell vol" percentage={sellVolumePercent} volume={sellVolume} />
  </div>
);

const TokenInfo = ({
  exchangeRate,
  tradesCount,
  tokenAddress,
  holders,
}: {
  exchangeRate: string;
  tradesCount: string;
  tokenAddress: string;
  holders: string;
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">Exchange rate:</p>
        <p className="text-sm font-medium text-white">{exchangeRate}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">Trades count:</p>
        <p className="text-sm font-medium text-white">{tradesCount}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">Token Address:</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{tokenAddress}</span>
          <Icon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" icon="lucide:copy" />
          <Icon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" icon="lucide:external-link" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">Holders:</p>
        <p className="text-sm font-medium text-white">{holders}</p>
      </div>
    </div>
  </div>
);

const MobileTokenInfo = ({
  exchangeRate,
  tradesCount,
  tokenAddress,
  holders,
}: {
  exchangeRate: string;
  tradesCount: string;
  tokenAddress: string;
  holders: string;
}) => (
  <div>
    <div className="border-b border-white/10 p-5 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">Exchange rate:</p>
      <p className="text-sm font-medium text-white">{exchangeRate}</p>
    </div>
    <div className="border-b border-white/10 p-5 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">Trades count:</p>
      <p className="text-sm font-medium text-white">{tradesCount}</p>
    </div>
    <div className="border-b border-white/10 p-5 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">Token Address:</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">{tokenAddress}</span>
        <Icon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" icon="lucide:copy" />
        <Icon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" icon="lucide:external-link" />
      </div>
    </div>
    <div className="p-5 flex items-center justify-between">
      <p className="text-sm font-medium text-gray-400">Holders:</p>
      <p className="text-sm font-medium text-white">{holders}</p>
    </div>
  </div>
);

export function VolumeStats({
  buyVolume,
  buyVolumePercent,
  sellVolume,
  sellVolumePercent,
  exchangeRate,
  tradesCount,
  tokenAddress,
  holders,
}: VolumeStatsProps) {
  return (
    <div className="space-y-6">
      {/* Desktop - Single Card */}
      <Card className="hidden md:block bg-card rounded-2xl">
        <CardBody className="space-y-6 p-5">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Volume:</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                <VolumeBar isBuy={true} label="Buy vol" percentage={buyVolumePercent} volume={buyVolume} />
              </div>
              <div className="flex-1">
                <VolumeBar isBuy={false} label="Sell vol" percentage={sellVolumePercent} volume={sellVolume} />
              </div>
            </div>
          </div>

          <TokenInfo exchangeRate={exchangeRate} holders={holders} tokenAddress={tokenAddress} tradesCount={tradesCount} />
        </CardBody>
      </Card>

      {/* Mobile - Two Separate Cards */}
      <div className="md:hidden space-y-4">
        <Card className="bg-card rounded-2xl">
          <CardBody className="p-5">
            <VolumeSection
              buyVolume={buyVolume}
              buyVolumePercent={buyVolumePercent}
              sellVolume={sellVolume}
              sellVolumePercent={sellVolumePercent}
            />
          </CardBody>
        </Card>

        <Card className="bg-card rounded-2xl">
          <MobileTokenInfo exchangeRate={exchangeRate} holders={holders} tokenAddress={tokenAddress} tradesCount={tradesCount} />
        </Card>
      </div>
    </div>
  );
}
