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
  const [rawSearchResults, setRawSearchResults] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search function calling server-side API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setRawSearchResults([]);
      setIsDropdownOpen(false);

      return;
    }

    let isCancelled = false;

    const timeoutId = setTimeout(async () => {
      if (isCancelled) return;

      setIsLoading(true);
      setIsDropdownOpen(true);

      try {
        const response = await fetch(`/api/crypto/search?keyword=${encodeURIComponent(searchQuery)}`);

        // Check if search was cancelled during fetch
        if (isCancelled) return;

        if (!response.ok) {
          setRawSearchResults([]);

          return;
        }

        const result = await response.json();

        // Final check before updating state
        if (isCancelled) return;

        setRawSearchResults(result.data || []);
      } catch (error) {
        if (!isCancelled) {
          setRawSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  // Format results on render - prevents re-fetch when currency changes
  const searchResults = rawSearchResults.map((token) => ({
    ...token,
    price: formatPrice(token.rawPrice || 0),
    volume: formatBigNumbers(token.rawVolume || 0),
  }));

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
    setRawSearchResults([]);
    router.push(`/tokens/${token.id}`);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <Input
        ref={inputRef}
        classNames={{
          inputWrapper: "bg-card md:bg-background h-10 w-full border-none",
          input: "text-sm text-white placeholder:text-gray-500 w-full bg-transparent",
        }}
        placeholder="Search tokens..."
        size="sm"
        startContent={<Icon className="text-gray-500" icon="solar:magnifer-linear" width={20} />}
        type="text"
        value={searchQuery}
        variant="flat"
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery && setIsDropdownOpen(true)}
      />

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div
          className="absolute top-full mt-2 left-0 right-0 bg-card rounded-xl z-50 max-h-[400px] overflow-y-auto backdrop-blur-sm transition-all"
          style={{ boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)" }}>
          {isLoading && (
            <div className="p-4 text-center">
              <Icon className="animate-spin text-gray-500 mx-auto mb-2" icon="solar:refresh-linear" width={24} />
              <p className="text-xs text-gray-400">Searching...</p>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && searchQuery && (
            <div className="p-4 text-center">
              <Icon className="text-gray-500 mx-auto mb-2" icon="solar:search-linear" width={24} />
              <p className="text-xs text-gray-400">No results found</p>
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.slice(0, 10).map((token, index) => (
                <button
                  key={`${token.id}-${index}`}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-900 cursor-pointer transition-colors text-left"
                  type="button"
                  onClick={() => handleResultClick(token)}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="flex-shrink-0" name={token.symbol} size="sm" src={token.imgUrl} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs truncate">{token.symbol}</h4>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        {token.id.slice(0, 4)}...{token.id.slice(-4)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {token.marketCap && token.marketCap > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">MCap</p>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          <PriceDisplay value={token.marketCap} />
                        </p>
                      </div>
                    )}
                    <Icon className="text-gray-500" icon="solar:arrow-right-linear" width={16} />
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
