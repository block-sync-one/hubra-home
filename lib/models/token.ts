export interface Token {
  address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  mint?: string;
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  price: number;
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags?: string[]; // [ 'stablecoin' ]
  extraData?: any;
  balance?: number;
  value?: number;
  priceChange24hPct?: number;
  frozen?: boolean;
  earnOpportunity?: {
    apy: number;
    platform: string;
    platformImage: string;
    strategy: string;
  };
}
export interface TrendingToken extends Token {
  priceChange24hPct: number;
  volume24hUSD: number;
  price: number;
  marketcap: number;
}
