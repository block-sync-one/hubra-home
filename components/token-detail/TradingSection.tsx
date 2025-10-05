import React from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TradingSectionProps {
  tokenName: string;
  tokenImgUrl: string;
  onSwap: () => void;
}

export function TradingSection({ tokenName, tokenImgUrl, onSwap }: TradingSectionProps) {
  return (
    <Card className="bg-[#191a2c] border-white/10 rounded-2xl">
      <CardBody className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Image alt={`${tokenName} token`} height={24} loading="lazy" sizes="24px" src={tokenImgUrl} width={24} />
              <span className="text-lg font-medium text-white">{tokenName}</span>
            </div>
            <span className="text-lg font-medium text-white">1</span>
          </div>

          <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">U</span>
              </div>
              <span className="text-lg font-medium text-white">USDC</span>
            </div>
            <span className="text-lg font-medium text-white">0.22</span>
          </div>

          <Button className="w-full bg-[#feaa01] text-white font-semibold hover:bg-[#feaa01]/90 rounded-lg py-3" onClick={onSwap}>
            Swap on Hubra
            <Icon className="h-4 w-4" icon="lucide:chevron-right" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
