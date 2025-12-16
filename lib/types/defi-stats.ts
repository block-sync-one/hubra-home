/**
 * DeFi Statistics Types
 * Type definitions for DeFi protocols and aggregated statistics
 */

import { ChartData } from "@/components/chart";

export interface DefiStatsAggregate {
  change1D: number;
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

export interface BaseProtocol {
  id: string;
  name: string;
  logo: string;
  tvl: number;
  change1D?: number;
  change7D?: number;
  change1H?: number;
  category?: string | string[];
}

export interface Protocol extends BaseProtocol {
  chains?: string[];
  slug?: string;
  description?: string;
  url?: string;
  twitter?: string;
  github?: string;
  tvlChartData?: Array<{ date: number; totalLiquidityUSD: number }>;
  otherProtocols?: string[];
}

export interface ProtocolAggregate extends BaseProtocol {
  lookup: string[];
  breakdown: Protocol[];
}
