"use client";

import type { Token } from "@/lib/types/token";

import React from "react";

import { ChangeIndicator } from "@/components/price";

interface TokenListItemProps {
  token: Token;
  rank: number;
  onClick: (token: Token) => void;
}

export const TokenListItem: React.FC<TokenListItemProps> = ({ token, rank, onClick }) => {
  return (
    <div
      aria-label="Token details"
      className="flex items-center p-3 hover:bg-white/5 transition-colors cursor-pointer"
      role="button"
      onClick={() => onClick(token)}>
      <div className="mr-4 flex-shrink-0 text-center text-sm text-gray-400 font-normal">{rank}</div>

      <div className="flex-1 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          <img
            alt={token.name}
            className="w-full h-full object-cover"
            src={token.imgUrl || "/logo.svg"}
            onError={(e) => {
              e.currentTarget.src = "/logo.svg";
            }}
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-semibold text-white">{token.name}</span>
        </div>
      </div>

      <div className="w-20 flex justify-start">
        <ChangeIndicator value={token.change} />
      </div>

      <div className="flex items-center gap-2 w-20">
        <span className="text-xs text-gray-400">Vol</span>
        <span className="text-sm font-medium text-white">{token.volume}</span>
      </div>
    </div>
  );
};
