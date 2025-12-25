/**
 * DeFiLlama API Service
 *
 * Provides access to DeFiLlama's public APIs for Solana data
 * @see https://api-docs.defillama.com/
 */

import "server-only";

const STABLECOINS_API_URL = "https://stablecoins.llama.fi";
const DEFILLAMA_API_URL = "https://api.llama.fi";

export interface StablecoinChainData {
  gecko_id: string | null;
  name: string;
  tokenSymbol: string;
  totalCirculatingUSD: {
    peggedUSD?: number;
    peggedEUR?: number;
    peggedJPY?: number;
    peggedCHF?: number;
    peggedAUD?: number;
    peggedVAR?: number;
    peggedREAL?: number;
    peggedGBP?: number;
    peggedTRY?: number;
    [key: string]: number | undefined;
  };
}

export interface SolanaTVLData {
  name: string;
  tvl: number;
  tokenSymbol: string;
  gecko_id: string;
}

export interface HistoricalDataPoint {
  date: number;
  tvl: number;
}

export interface StablecoinHistoricalDataPoint {
  date: number;
  totalCirculating: {
    peggedUSD: number;
    peggedEUR?: number;
    peggedJPY?: number;
    [key: string]: number | undefined;
  };
}

/**
 * Generic fetch helper for DeFiLlama APIs
 */
async function fetchFromDeFiLlama<T>(url: string, errorContext: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`${errorContext}: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Find Solana data from chain array by gecko_id
 */
function findSolanaChain<T extends { gecko_id?: string | null }>(chains: T[], context: string): T {
  const solanaData = chains.find((chain) => chain.gecko_id?.toLowerCase() === "solana");

  if (!solanaData) {
    throw new Error(`Solana data not found in ${context}`);
  }

  return solanaData;
}

/**
 * Fetch Solana stablecoin data from DeFiLlama
 *
 * @returns Stablecoin chain data for Solana
 * @throws {Error} When API request fails or Solana not found
 */
export async function fetchSolanaStablecoins(): Promise<StablecoinChainData> {
  const chains = await fetchFromDeFiLlama<StablecoinChainData[]>(
    `${STABLECOINS_API_URL}/stablecoinchains`,
    "DeFiLlama Stablecoins API error"
  );

  return findSolanaChain(chains, "stablecoin chains");
}

/**
 * Fetch Solana TVL from DeFiLlama
 *
 * @returns Solana TVL data
 * @throws {Error} When API request fails or Solana not found
 */
export async function fetchSolanaTVL(): Promise<SolanaTVLData> {
  const chains = await fetchFromDeFiLlama<SolanaTVLData[]>(`${DEFILLAMA_API_URL}/v2/chains`, "DeFiLlama Chains API error");

  return findSolanaChain(chains, "TVL chains");
}

/**
 * Calculate 24h percentage change from historical data points
 */
function calculate24hChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

/**
 * Sum all values in an object
 */
function sumObjectValues(obj: Record<string, number | undefined>): number {
  return Object.values(obj).reduce<number>((sum, val) => sum + (val ?? 0), 0);
}

/**
 * Fetch historical Solana TVL to calculate 24h change
 *
 * @returns Object with current TVL and 24h change percentage
 */
export async function fetchSolanaTVLWithChange(): Promise<{ tvl: number; change24h: number }> {
  const historical = await fetchFromDeFiLlama<HistoricalDataPoint[]>(
    `${DEFILLAMA_API_URL}/v2/historicalChainTvl/Solana`,
    "DeFiLlama Historical TVL API error"
  );

  if (historical.length < 2) {
    throw new Error("Insufficient historical data for TVL change calculation");
  }

  const current = historical[historical.length - 1];
  const previous = historical[historical.length - 2];

  return {
    tvl: current.tvl,
    change24h: calculate24hChange(current.tvl, previous.tvl),
  };
}

/**
 * Fetch historical Solana stablecoin data to calculate 24h change
 *
 * @returns Object with current total and 24h change percentage
 */
export async function fetchSolanaStablecoinsWithChange(): Promise<{ totalCirculating: number; change24h: number }> {
  const historical = await fetchFromDeFiLlama<StablecoinHistoricalDataPoint[]>(
    `${STABLECOINS_API_URL}/stablecoincharts/Solana`,
    "DeFiLlama Stablecoin Historical API error"
  );

  if (historical.length < 2) {
    throw new Error("Insufficient historical data for stablecoin change calculation");
  }

  const current = historical[historical.length - 1];
  const previous = historical[historical.length - 2];

  const currentTotal = sumObjectValues(current.totalCirculating);
  const previousTotal = sumObjectValues(previous.totalCirculating);

  return {
    totalCirculating: currentTotal,
    change24h: calculate24hChange(currentTotal, previousTotal),
  };
}

/**
 * Get total of all stablecoins across all pegs
 *
 * @param chainData - Chain stablecoin data
 * @returns Total circulating amount across all pegs
 */
export function getTotalCirculating(chainData: StablecoinChainData): number {
  return sumObjectValues(chainData.totalCirculatingUSD);
}

/**
 * Interface for DeFiLlama protocol data
 */
export interface DeFiLlamaProtocol {
  id: string;
  isParentProtocol?: boolean;
  name: string;
  slug: string;
  logo: string;
  tvl: number;
  symbol?: string;
  assetToken?: string;
  change_1d?: number;
  change_7d?: number;
  change_1h?: number;
  category?: string | string[];
  chains?: string[];
  chain?: string;
  chainTvls?: {
    [key: string]: Array<{ date: number; totalLiquidityUSD: number }>;
  };
  currentChainTvls?: {
    [key: string]: string;
  };
  description?: string;
  url?: string;
  twitter?: string;
  github?: string;
  parentProtocol?: string;
  parentProtocolSlug?: string;
  otherProtocols?: string[];
}

export interface HistoricalTVL {
  data: string;
  tvl: number;
}

export interface FeeRevenueData {
  change_1d?: number;
  total24h?: number;
  totalDataChart?: Array<[number, number]>;
}

/**
 * Fetch all protocols with their TVL data
 *
 * @returns List of all DeFi protocols
 */
export async function fetchTVL(): Promise<DeFiLlamaProtocol[]> {
  return fetchFromDeFiLlama<DeFiLlamaProtocol[]>(`${DEFILLAMA_API_URL}/protocols`, "DeFiLlama All Protocols API error");
}

export async function fetchDailyFees(): Promise<any[]> {
  return fetchFromDeFiLlama<any[]>(
    `${DEFILLAMA_API_URL}/overview/fees/solana?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyFees`,
    "DeFiLlama Daily Fees API error"
  );
}

export async function fetchDailyRevenue(): Promise<any[]> {
  return fetchFromDeFiLlama<any[]>(
    `${DEFILLAMA_API_URL}/overview/fees/solana?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue`,
    "DeFiLlama Daily Revenue API error"
  );
}

export interface FeeRevenueData {
  change_1d?: number;
  total24h?: number;
  totalDataChart?: Array<[number, number]>;
}

export async function fetchProtocolFees(protocolSlug: string): Promise<FeeRevenueData> {
  return fetchFromDeFiLlama<FeeRevenueData>(
    `${DEFILLAMA_API_URL}/summary/fees/${protocolSlug}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyFees`,
    `DeFiLlama Protocol Fees API error for ${protocolSlug}`
  );
}

export async function fetchProtocolRevenue(protocolSlug: string): Promise<FeeRevenueData> {
  return fetchFromDeFiLlama<FeeRevenueData>(
    `${DEFILLAMA_API_URL}/summary/fees/${protocolSlug}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue`,
    `DeFiLlama Protocol Revenue API error for ${protocolSlug}`
  );
}

export interface FeeRevenueData {
  change_1d?: number;
  total24h?: number;
  totalDataChart?: Array<[number, number]>;
}

export async function fetchSingleTVL(protocol: string): Promise<DeFiLlamaProtocol> {
  return fetchFromDeFiLlama<DeFiLlamaProtocol>(`${DEFILLAMA_API_URL}/protocol/${protocol}`, "DeFiLlama Single Protocols API error");
}
export async function fetchHistoricalChainTVL(): Promise<HistoricalTVL[]> {
  return fetchFromDeFiLlama<HistoricalTVL[]>(
    `${DEFILLAMA_API_URL}/v2/historicalChainTvl/solana`,
    "DeFiLlama Solana Historical TVL API error"
  );
}

/**
 * Fetch historical TVL data for a specific protocol
 *
 * @param protocolSlug - Protocol slug identifier
 * @returns Historical TVL data points for the protocol
 */
export async function fetchProtocolHistoricalTVL(protocolSlug: string): Promise<Array<{ date: number; totalLiquidityUSD: number }>> {
  const response = await fetchFromDeFiLlama<Array<{ date: number; totalLiquidityUSD: number }>>(
    `${DEFILLAMA_API_URL}/v2/historicalProtocolTvl/${protocolSlug}`,
    `DeFiLlama Protocol Historical TVL API error for ${protocolSlug}`
  );

  return response;
}

export async function fetchProtocolDailyFees(protocolSlug: string): Promise<FeeRevenueData> {
  return fetchFromDeFiLlama<FeeRevenueData>(
    `${DEFILLAMA_API_URL}/summary/fees/${protocolSlug}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyFees`,
    `DeFiLlama Protocol Daily Fees API error for ${protocolSlug}`
  );
}

export async function fetchProtocolDailyRevenue(protocolSlug: string): Promise<FeeRevenueData> {
  return fetchFromDeFiLlama<FeeRevenueData>(
    `${DEFILLAMA_API_URL}/summary/fees/${protocolSlug}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue`,
    `DeFiLlama Protocol Daily Revenue API error for ${protocolSlug}`
  );
}
