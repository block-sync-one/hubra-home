"use client";

import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

import { formatCurrency } from "@/lib/utils/helper";
import { Protocol } from "@/lib/types/defi-stats";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";

interface TopProtocolsProps {
  protocols: Protocol[];
}

export function TopProtocols({ protocols }: TopProtocolsProps) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white ">24h Top Protocols</h2>
        <p className="text-xs text-gray-400">By TVL growth</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {protocols.map((protocol) => {
          return (
            <Card
              key={protocol.name}
              className="bg-transparent rounded-none shadow-none md:shadow-card md:bg-card md:backdrop-blur-sm  md:rounded-xl  md:p-4">
              <div className="flex justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                    <ImageWithSkeleton
                      alt={`${protocol.name} logo`}
                      className="w-full h-full object-cover"
                      height={32}
                      src={protocol.logo || "/logo.svg"}
                      width={32}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-white">{protocol.name}</h3>
                    <p className="text-xs text-gray-400">{protocol.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-foreground">{formatCurrency(protocol.tvl, true)}</span>
                  <div
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      protocol.change_1d && protocol.change_1d > 0
                        ? "text-success"
                        : protocol.change_1d && protocol.change_1d < 0
                          ? "text-danger"
                          : "text-gray-400"
                    }`}>
                    {protocol.change_1d !== undefined && protocol.change_1d !== 0 && (
                      <Icon icon={protocol.change_1d > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
                    )}
                    <span>{protocol.change_1d ? Math.abs(protocol.change_1d).toFixed(2) : 0}%</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
