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
}

interface TradingInputProps {
  tokenSymbol: string;
  tokenName: string;
  tokenImgUrl: string;
  amount: string;
  estimatedValue: string;
}

/**
 * Reusable Trading Input Component
 */
const TradingInput: React.FC<TradingInputProps> = ({ tokenSymbol, tokenName, tokenImgUrl, amount, estimatedValue }) => {
  return (
    <div className="flex items-center justify-between px-5 py-6 bg-background rounded-xl">
      <div className="flex items-center gap-2">
        <Image alt={`${tokenName} token`} className="rounded-full" height={32} loading="lazy" sizes="32px" src={tokenImgUrl} width={32} />
        <div>
          <div className="text-lg font-medium text-white">{tokenSymbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-medium text-white">{amount}</div>
      </div>
    </div>
  );
};

export function TradingSection({ tokenName, tokenSymbol, tokenImgUrl, currentPrice }: TradingSectionProps) {
  return (
    <Card className="bg-card rounded-2xl">
      <CardBody className="p-3.5">
        <div className="space-y-2">
          <TradingInput
            amount="1"
            estimatedValue={`≈ $${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
            tokenImgUrl={tokenImgUrl}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
          />

          <TradingInput
            amount={currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            estimatedValue={`≈ 1 ${tokenSymbol}`}
            tokenImgUrl="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            tokenName="USD Coin"
            tokenSymbol="USDC"
          />
        </div>
        <Button
          className="w-full bg-[#feaa01] text-white font-semibold hover:bg-[#feaa01]/90 rounded-lg mt-3.5 transition-colors"
          onPress={() => window.open("https://hubra.app/convert", "_blank")}>
          Swap on Hubra
          <Icon className="h-4 w-4" icon="lucide:chevron-right" />
        </Button>
      </CardBody>
    </Card>
  );
}
