/**
 * DeFi Statistics Types
 * Type definitions for DeFi protocols and aggregated statistics
 */

import { ChartData } from "@/components/chart";

export interface DefiStatsAggrigate {
  change_1d: number;
  chartData: ChartData[];
  inflows: {
    change_1d: number;
    chartData: {
      date: string;
      value: number;
      value2: number;
    }[];
  };
  solanaProtocols: Protocol[];
  hotProtocols: Protocol[];
  numberOfProtocols: number;
  totalTvl: number;
  totalRevenue_1d: number;
  totalFees_1d: number;
  description?: string;
  logo?: string;
  name?: string;
  tvl?: number;
  twitter?: string;
  github?: string;
  url?: string;
}

export interface Protocol {
  id: string;
  name: string;
  logo: string;
  tvl: number;
  change_1d?: number;
  change_7d?: number;
  change_1m?: number;
  category?: string | string[];
  chains?: string[];
  slug?: string;
  description?: string;
  url?: string;
  twitter?: string;
  github?: string;
}

export type { DefiStatsAggrigate as defiStatsAggrigate };
export type { Protocol as protocol };
