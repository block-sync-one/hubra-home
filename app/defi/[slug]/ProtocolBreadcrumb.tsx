"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface ProtocolBreadcrumbProps {
  protocolName: string;
}

export function ProtocolBreadcrumb({ protocolName }: ProtocolBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-8 text-gray-400">
      <Link
        aria-label="Navigate back to DeFi protocols list"
        className="cursor-pointer hover:text-white transition-colors bg-transparent border-none p-0 text-gray-400 text-sm focus:outline-none focus:text-white"
        href="/defi">
        DeFi
      </Link>
      <Icon aria-hidden="true" className="h-4 w-4" icon="lucide:chevron-right" />
      <span className="text-white font-medium">{protocolName}</span>
    </nav>
  );
}
