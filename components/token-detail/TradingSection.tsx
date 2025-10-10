import React from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TradingSectionProps {
  tokenName: string;
  tokenSymbol: string;
  tokenImgUrl: string;
  currentPrice: number;
  onSwap: () => void;
}

export function TradingSection({ tokenName, tokenSymbol, tokenImgUrl, currentPrice, onSwap }: TradingSectionProps) {
  return (
    <Card className="bg-[#191a2c] border-white/10 rounded-2xl">
      <CardBody className="p-6">
        <div className="space-y-4">
          {/* Token Input */}
          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <Image
                alt={`${tokenName} token`}
                className="rounded-full"
                height={32}
                loading="lazy"
                sizes="32px"
                src={tokenImgUrl}
                width={32}
              />
              <div>
                <div className="text-lg font-medium text-white">{tokenSymbol}</div>
                <div className="text-sm text-gray-400">{tokenName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium text-white">1</div>
              <div className="text-sm text-gray-400">
                ≈ ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
            </div>
          </div>

          {/* USDC Output */}
          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <Image
                alt="USDC token"
                className="rounded-full"
                height={32}
                loading="lazy"
                sizes="32px"
                src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
                width={32}
              />
              <div>
                <div className="text-lg font-medium text-white">USDC</div>
                <div className="text-sm text-gray-400">USD Coin</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium text-white">
                {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
              <div className="text-sm text-gray-400">≈ 1 {tokenSymbol}</div>
            </div>
          </div>

          {/* Swap Button */}
          <Button
            className="w-full bg-[#feaa01] text-white font-semibold hover:bg-[#feaa01]/90 rounded-lg py-3 transition-colors"
            onPress={onSwap}>
            Swap on Hubra
            <Icon className="h-4 w-4" icon="lucide:chevron-right" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
