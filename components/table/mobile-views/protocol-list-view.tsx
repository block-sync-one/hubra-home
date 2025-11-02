/**
 * Protocol Mobile List View
 * Custom mobile view for protocols table
 */

import React from "react";
import { Icon } from "@iconify/react";

import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { formatCurrency } from "@/lib/utils/helper";
import { Protocol } from "@/lib/types/defi-stats";

interface ProtocolListViewProps {
  protocols: (Protocol & { _index?: number })[];
  onProtocolClick: (protocol: Protocol) => void;
}

export function ProtocolListView({ protocols, onProtocolClick }: ProtocolListViewProps) {
  return (
    <div className="md:hidden rounded-lg overflow-hidden">
      {protocols.length === 0 ? (
        <div className="py-6 text-center text-gray-500">No protocols available</div>
      ) : (
        protocols.map((protocol) => (
          <div
            key={protocol.id || protocol.name}
            aria-label="Protocol details"
            className="flex items-center justify-between py-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            role="button"
            onClick={() => onProtocolClick(protocol)}>
            {/* Left Column: Logo, Name, Category */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithSkeleton
                  alt={`${protocol.name} logo`}
                  className="w-full h-full object-cover"
                  height={32}
                  src={protocol.logo || "/logo.svg"}
                  width={32}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{protocol.name}</span>
                <span className="text-xs text-gray-400 font-medium truncate">
                  {Array.isArray(protocol.category) ? protocol.category[0] : protocol.category || "DeFi"}
                </span>
              </div>
            </div>

            {/* Right Column: TVL and Change */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-white">{formatCurrency(protocol.tvl, true)}</span>
              <div
                className={`flex items-center gap-1 text-xs font-semibold ${
                  protocol.change_7d && protocol.change_7d > 0
                    ? "text-success"
                    : protocol.change_7d && protocol.change_7d < 0
                      ? "text-danger"
                      : "text-gray-400"
                }`}>
                {protocol.change_7d !== undefined && protocol.change_7d !== 0 && (
                  <Icon icon={protocol.change_7d > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
                )}
                <span>{protocol.change_7d ? Math.abs(protocol.change_7d).toFixed(2) : "0.00"}%</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
