"use client";

import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
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
          const protocolSlug = protocol.id.toLowerCase();

          return (
            <Link key={protocol.name} href={`/defi/${protocolSlug}`}>
              <Card className="bg-transparent rounded-none shadow-none md:shadow-card md:bg-card md:backdrop-blur-sm md:rounded-xl md:p-4 cursor-pointer transition-all hover:opacity-80 hover:scale-[1.02]">
                <div className="flex justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithSkeleton
                        alt={`${protocol.name} logo`}
                        className="w-full h-full object-cover"
                        height={36}
                        src={protocol.logo || "/logo.svg"}
                        width={36}
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
                        protocol.change1D && protocol.change1D > 0
                          ? "text-success"
                          : protocol.change1D && protocol.change1D < 0
                            ? "text-danger"
                            : "text-gray-400"
                      }`}>
                      {protocol.change1D !== undefined && protocol.change1D !== 0 && (
                        <Icon icon={protocol.change1D > 0 ? "mdi:arrow-up" : "mdi:arrow-down"} width={12} />
                      )}
                      <span>{protocol.change1D ? Math.abs(protocol.change1D).toFixed(2) : 0}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
