"use client";

import type { Token } from "@/lib/types/token";

import React, { useState, useEffect, useRef } from "react";
import { Input, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { PriceDisplay } from "@/components/price";
import { useCurrency } from "@/lib/context/currency-format";
import { formatBigNumbers } from "@/lib/utils";

export const SearchInput: React.FC = () => {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search function calling server-side API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);

      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setIsDropdownOpen(true);

      try {
        const response = await fetch(`/api/crypto/search?keyword=${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
          console.error("Search API error:", response.status);
          setSearchResults([]);

          return;
        }

        const result = await response.json();

        // API returns Token[] format already - just format prices
        const tokens: Token[] = (result.data || []).map((token: Token) => ({
          ...token,
          price: formatPrice(token.rawPrice || 0),
          volume: formatBigNumbers(token.rawVolume || 0),
        }));

        setSearchResults(tokens);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, formatPrice, formatBigNumbers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (token: Token) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    setSearchResults([]);
    router.push(`/tokens/${token.id}`);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <Input
        ref={inputRef}
        classNames={{
          inputWrapper: "bg-background hover:bg-white/10 h-10",
          input: "text-sm",
        }}
        placeholder="Search tokens..."
        size="sm"
        startContent={<Icon className="text-default-400" icon="solar:magnifer-linear" width={20} />}
        type="text"
        value={searchQuery}
        variant="flat"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery && setIsDropdownOpen(true)}
      />

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-card rounded-lg shadow-lg border border-default-200 z-50 max-h-[400px] overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center">
              <Icon className="animate-spin text-default-400 mx-auto mb-2" icon="solar:refresh-linear" width={24} />
              <p className="text-sm text-default-500">Searching...</p>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && searchQuery && (
            <div className="p-4 text-center">
              <Icon className="text-default-400 mx-auto mb-2" icon="solar:search-linear" width={24} />
              <p className="text-sm text-default-500">No results found</p>
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.slice(0, 10).map((token, index) => (
                <button
                  key={`${token.id}-${index}`}
                  className="w-full flex items-center justify-between p-3 hover:bg-default-100 cursor-pointer transition-colors text-left"
                  type="button"
                  onClick={() => handleResultClick(token)}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="flex-shrink-0" name={token.symbol} size="sm" src={token.imgUrl} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate">{token.symbol}</h4>
                        <span className="text-xs text-default-500 truncate">{token.name}</span>
                      </div>
                      <p className="text-xs text-default-400 font-mono truncate">
                        {token.id.slice(0, 4)}...{token.id.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {token.marketCap && token.marketCap > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-default-500">MCap</p>
                        <p className="text-xs font-medium">
                          <PriceDisplay value={token.marketCap} />
                        </p>
                      </div>
                    )}
                    <Icon className="text-default-400" icon="solar:arrow-right-linear" width={16} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
