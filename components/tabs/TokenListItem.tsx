"use client";

import type { Token } from "@/lib/types/token";

import React from "react";
import { Icon } from "@iconify/react";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

interface TokenListItemProps {
  token: Token;
  rank: number;
  onClick: (token: Token) => void;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({ token, rank, onClick }) => {
  return (
    <div
      aria-label="Token details"
      className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors cursor-pointer"
      role="button"
      onClick={() => onClick(token)}>
      {/* Left Column: Image, Name, Symbol */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithSkeleton
            alt={`${token.name} (${token.symbol}) logo`}
            className="w-full h-full object-cover"
            height={32}
            src={token.logoURI || "/logo.svg"}
            width={32}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">{token.name}</span>
          <span className="text-xs text-gray-400 uppercase font-medium">{token.symbol}</span>
        </div>
      </div>

      {/* Right Column: Price and Price Change */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-medium text-foreground">{token.price}</span>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            token.change && token.change > 0 ? "text-success" : token.change && token.change < 0 ? "text-danger" : "text-gray-400"
          }`}>
          {token.change !== undefined && token.change !== 0 && (
            <Icon icon={token.change > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
          )}
          <span>{token.change ? Math.abs(token.change).toFixed(2) : 0}%</span>
        </div>
      </div>
    </div>
  );
};
