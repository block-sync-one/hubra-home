import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { addrUtil, formatBigNumbers } from "@/lib/utils";
import { CopyText } from "@/lib/helpers";

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

const VolumeBar = React.memo(
  ({ label, volume, percentage, isBuy }: { label: string; volume: string; percentage: number; isBuy: boolean }) => (
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
  )
);

VolumeBar.displayName = "VolumeBar";

const AddressActions = React.memo(({ tokenAddress }: { tokenAddress: string }) => (
  <div className="flex flex-row items-center gap-2">
    <CopyText className="text-primary" copyText={tokenAddress} copyValue={tokenAddress}>
      {addrUtil(tokenAddress)?.addrShort}
    </CopyText>
    <Link
      aria-label="View token on Solscan"
      href={`https://solscan.io/token/${tokenAddress}`}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => e.stopPropagation()}>
      <Icon className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" icon="lucide:external-link" />
    </Link>
  </div>
));

AddressActions.displayName = "AddressActions";

const InfoRow = React.memo(({ label, value, isLast = false }: { label: string; value: React.ReactNode; isLast?: boolean }) => (
  <div className={`${isLast ? "" : "border-b border-white/10"} p-4 flex items-center justify-between`}>
    <p className="text-sm font-medium text-gray-400">{label}</p>
    <div className="text-sm font-medium text-white">{value}</div>
  </div>
));

InfoRow.displayName = "InfoRow";

const InfoGrid = React.memo(({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 mb-2.5">{label}</p>
    <div className="text-sm font-medium text-white">{value}</div>
  </div>
));

InfoGrid.displayName = "InfoGrid";

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
      <Card className="hidden md:block bg-card rounded-2xl">
        <CardBody className="space-y-7 p-5">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Volume:</h3>
            <div className="flex gap-6">
              <div className="flex-1">
                <VolumeBar isBuy label="Buy vol" percentage={buyVolumePercent} volume={buyVolume} />
              </div>
              <div className="flex-1">
                <VolumeBar isBuy={false} label="Sell vol" percentage={sellVolumePercent} volume={sellVolume} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoGrid label="Exchange rate:" value={exchangeRate} />
            <InfoGrid label="Trades count:" value={tradesCount} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InfoGrid label="Token Address:" value={<AddressActions tokenAddress={tokenAddress} />} />
            <InfoGrid label="Holders:" value={holders} />
          </div>
        </CardBody>
      </Card>

      <div className="md:hidden space-y-4">
        <Card className="bg-card rounded-2xl gap-4 p-4">
          <VolumeBar isBuy label="Buy vol" percentage={buyVolumePercent} volume={buyVolume} />
          <VolumeBar isBuy={false} label="Sell vol" percentage={sellVolumePercent} volume={sellVolume} />
        </Card>

        <Card className="bg-card rounded-2xl">
          <InfoRow label="Exchange rate:" value={exchangeRate} />
          <InfoRow label="Trades count:" value={tradesCount} />
          <InfoRow label="Token Address:" value={<AddressActions tokenAddress={tokenAddress} />} />
          <InfoRow isLast label="Holders:" value={holders} />
        </Card>
      </div>
    </div>
  );
}
