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

export const DeFiStrategy = {
  PERPETUAL: "perpetual",
  LIQUIDITY_POOL: "liquidity pool",
  STAKING: "staking",
  FARM: "farm",
  VAULT: "vault",
  SPOT: "spot",
  LENDING: "lending",
  BORROWING: "borrowing",
} as const;
export type DeFiStrategyType = (typeof DeFiStrategy)[keyof typeof DeFiStrategy];

export type Portfolio = {
  wallet: string;
  positions: {
    token: {
      spot: SpotAsset[];
      yield: Array<{
        asset: {
          title: string;
          symbol: string;
          logoURI: string;
          mint: string;
          underlyings: Array<{
            title: string;
            symbol: string;
            mint: string;
            balance: number;
            balanceString: string;
            logoURI: string;
          }>;
        };
        balance: number;
        balanceString: string;
        decimals: number;
        programId: string;
        apr: number;
        priceInUSD?: number;
        priceChange24hPct?: number;
        valueInUSD?: number;
      }>;
    };
    domain: Array<any>;
    dex: Dex;
    liquidity: Liquidity;
    staking: Staking[];
    farm: Farm[];
    vault: Vault[];
    underlyings: Array<{
      title: string;
      symbol: string;
      mint: string;
      logoURI: string;
      balance: number;
      balanceString: string;
    }>;
    margin: Margin[];
    lending: Lending;
    validator: Validator[];
    nftmarket: {
      singleOrder: Array<any>;
      poolOrder: Array<any>;
      escrowAccount: Array<any>;
    };
    nft: NFT[];
  };
  summary: {
    positions: {
      token: {
        spot: {
          totalValue: number;
        };
        yield: {
          totalValue: number;
          estimated24hReward: number;
        };
      };
      domain: {
        totalValue: number;
      };
      dex: {
        order: {
          totalValue: number;
        };
        unsettledBalance: {
          totalValue: number;
        };
      };
      liquidity: {
        amm: {
          totalValue: number;
          estimated24hReward: number;
        };
        clmm: {
          totalValue: number;
          totalPendingReward: number;
          estimated24hReward: number;
        };
      };
      staking: {
        totalValue: number;
        totalPendingReward: number;
        estimated24hReward: number;
      };
      farm: {
        totalValue: number;
        totalPendingReward: number;
        estimated24hReward: number;
      };
      vault: {
        totalValue: number;
        estimated24hReward: number;
      };
      margin: {
        totalValue: number;
        estimated24hReward: number;
      };
      lending: {
        tokenPosition: {
          totalValue: number;
          estimated24hReward: number;
        };
        leverageFarmPosition: {
          totalValue: number;
        };
        nftPosition: {
          totalValue: number;
        };
      };
      validator: {
        totalValue: number;
        estimated24hReward: number;
      };
      nftmarket: {
        singleOrder: {
          totalValue: number;
        };
        poolOrder: {
          totalValue: number;
          totalPendingReward: number;
          estimated24hReward: number;
        };
        escrowAccount: {
          totalValue: number;
        };
      };
      nft: {
        totalValue: number;
      };
    };
    aggregated: {
      netWorth: number;
      tokenValue: number;
      tokensValue: number;
      defiValue: number;
      stakingValue: number;
      nftDefiValue: number;
      nftValue: number;
      totalPendingReward: number;
      estimated24hReward: number;
      earnValue?: number; // clone of defiValue
    };
    statuses: {
      token: {
        balances: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      domain: {
        alldomains: {
          error: any;
          duration: number;
          asOf: number;
        };
        bonfida: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      dex: {
        "jupiter": {
          error: any;
          duration: number;
          asOf: number;
        };
        "openbook": {
          error: any;
          duration: number;
          asOf: number;
        };
        "openbook-v2": {
          error: any;
          duration: number;
          asOf: number;
        };
        "staratlas": {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      amm: {
        solana: {
          error: any;
          duration: number;
          asOf: number;
        };
        universal: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      clmm: {
        raydium: {
          error: any;
          duration: number;
          asOf: number;
        };
        orca: {
          error: any;
          duration: number;
          asOf: number;
        };
        meteora: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      staking: {
        raydium: {
          error: any;
          duration: number;
          asOf: number;
        };
        goose: {
          error: any;
          duration: number;
          asOf: number;
        };
        staratlas: {
          error: any;
          duration: number;
          asOf: number;
        };
        bonfida: {
          error: any;
          duration: number;
          asOf: number;
        };
        bonk: {
          error: any;
          duration: number;
          asOf: number;
        };
        hubble: {
          error: any;
          duration: number;
          asOf: number;
        };
        drift: {
          error: any;
          duration: number;
          asOf: number;
        };
        uxd: {
          error: any;
          duration: number;
          asOf: number;
        };
        jupiter: {
          error: any;
          duration: number;
          asOf: number;
        };
        kamino: {
          error: any;
          duration: number;
          asOf: number;
        };
        hxro: {
          error: any;
          duration: number;
          asOf: number;
        };
        realms: {
          error: any;
          duration: number;
          asOf: number;
        };
        pyth: {
          error: any;
          duration: number;
          asOf: number;
        };
        m3m3: {
          error: any;
          duration: number;
          asOf: number;
        };
        flash: {
          error: any;
          duration: number;
          asOf: number;
        };
        nx: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      farm: {
        raydium: {
          error: any;
          duration: number;
          asOf: number;
        };
        atrix: {
          error: any;
          duration: number;
          asOf: number;
        };
        quarry: {
          error: any;
          duration: number;
          asOf: number;
        };
        meteora: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      vault: {
        elemental: {
          error: any;
          duration: number;
          asOf: number;
        };
        hawkfi: {
          error: any;
          duration: number;
          asOf: number;
        };
        kamino: {
          error: any;
          duration: number;
          asOf: number;
        };
        drift: {
          error: any;
          duration: number;
          asOf: number;
        };
        allbridge: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      margin: {
        jupiter: {
          error: any;
          duration: number;
          asOf: number;
        };
        drift: {
          error: any;
          duration: number;
          asOf: number;
        };
        zeta: {
          error: any;
          duration: number;
          asOf: number;
        };
        parcl: {
          error: any;
          duration: number;
          asOf: number;
        };
        flash: {
          error: any;
          duration: number;
          asOf: number;
        };
        adrena: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      lending: {
        hubble: {
          error: any;
          duration: number;
          asOf: number;
        };
        kamino: {
          error: any;
          duration: number;
          asOf: number;
        };
        marginfi: {
          error: any;
          duration: number;
          asOf: number;
        };
        sharky: {
          error: any;
          duration: number;
          asOf: number;
        };
        francium: {
          error: any;
          duration: number;
          asOf: number;
        };
        save: {
          error: any;
          duration: number;
          asOf: number;
        };
        lulo: {
          error: any;
          duration: number;
          asOf: number;
        };
        nx: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      validator: {
        solana: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      nftmarket: {
        hadeswap: {
          error: any;
          duration: number;
          asOf: number;
        };
        tensor: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
      nft: {
        standard: {
          error: any;
          duration: number;
          asOf: number;
        };
      };
    };
    staleJobs: Array<string>;
  };
  status: string;
};
export type Portfolio_history_value = {
  date: string;
  value: string;
};
export type PortfolioV2 = Portfolio & {
  portfolio_history_value: Portfolio_history_value[];

  aggregated: {
    tokens: Token[];
    earn: AggregatedDefi[];
    validator: Validator[];
    nfts: NFT[];
  };
};
export type DeFi = Dex | Liquidity | Staking | Farm | Vault | Margin | Lending | Validator | NFT;
export type Dex = {
  order: Array<{
    title: string;
    valueInUSD: number;
    platform: {
      title: string;
    };
    assets: Asset[];
    isBid: boolean;
    size: number;
    sizeString: string;
    offerPriceInUSD: number;
    marketAddress?: string;
    orderAddress?: string;
    orderId?: string;
  }>;
  unsettledBalance: Array<{
    title: string;
    platform: {
      title: string;
    };
    assets: Array<{
      title: string;
      symbol: string;
      mint: string;
      logoURI: string;
      balance: number;
      balanceString: string;
    }>;
    marketAddress: string;
    valueInUSD: number;
  }>;
};
export type Liquidity = {
  amm: AMM[];
  clmm: Clmm[];
};
export type AMM = {
  title: string;
  platform: {
    title: string;
  };
  mint: string;
  asset: {
    title: string;
    symbol: string;
    mint: string;
    underlyings: Array<{
      title: string;
      symbol: string;
      logoURI: string;
      mint: string;
      balance: number;
      balanceString: string;
      valueInUSD?: number;
    }>;
    logoURI?: string;
  };
  curveType: number;
  apr: number;
  balance: number;
  balanceString: string;
  valueInUSD: number;
  apr7d?: number;
};

export type Clmm = {
  title: string;
  platform: {
    title: string;
  };
  poolInfoPda: string;
  positionMintAddress: string;
  underlyings: Array<{
    title: string;
    symbol: string;
    logoURI: string;
    mint: string;
    balance: number;
    balanceString: string;
  }>;
  curveType: number;
  apr?: number;
  isInRange: boolean;
  upperLimit: number;
  lowerLimit: number;
  currentPrice: number;
  rewardAssets: Array<{
    title: string;
    symbol: string;
    logoURI: string;
    mint: string;
    balance: number;
    balanceString: string;
  }>;
  pendingRewardInUSD: number;
  valueInUSD: number;
};
export type Staking = {
  platform: {
    title: string;
  };
  asset: {
    title: string;
    symbol: string;
    mint: string;
    logoURI: string;
  };
  apr?: number;
  balance: number;
  balanceString: string;
  rewardAssets: Array<{
    title: string;
    symbol: string;
    logoURI: string;
    mint: string;
    balance: number;
    balanceString: string;
  }>;
  pendingRewardInUSD?: number;
  valueInUSD?: number;
};
export type Farm = {
  title: string;
  farmAddress: string;
  platform: {
    title: string;
  };
  asset: {
    title: string;
    symbol: string;
    mint: string;
    underlyings: Array<{
      title: string;
      symbol: string;
      logoURI: string;
      mint: string;
      balance: number;
      balanceString: string;
    }>;
  };
  rewardAssets: Array<any>;
  pendingRewardInUSD: any;
  apr: number;
  balance: number;
  balanceString: string;
  valueInUSD: number;
};
export type Vault = {
  title: string;
  platform: {
    title: string;
  };
  apr: number;
  valueInUSD: number;
  vaultAddress: string;
  underlyings: Array<{
    title: string;
    symbol: string;
    mint: string;
    logoURI: string;
    balance: number;
    balanceString: string;
  }>;
};
export type Perpetual = {
  title: string;
  notionalValue: number;
  logoURI: string;
  isLong: boolean;
  size: number;
  sizeString: string;
  avgEntryPrice?: number;
  valueInUSD: number;
};
export type Margin = {
  title: string;
  platform: {
    title: string;
  };
  perpetuals: Array<Perpetual>;
  orders: Array<{
    title: string;
    isBid: boolean;
    size: number;
    sizeString: string;
    offerPrice: number;
    logoURI?: string;
  }>;
  balances: Array<{
    asset: {
      title: string;
      symbol: string;
      logoURI: string;
      mint: string;
    };
    balance: number;
    balanceString: string;
    apr: number;
    valueInUSD: number;
  }>;
  valueInUSD: number;
};
export type Lending = {
  tokenPosition: Array<{
    platform: {
      title: string;
    };
    asset: {
      title: string;
      symbol: string;
      mint: string;
      logoURI: string;
    };
    poolAddress: any;
    poolName?: string;
    balance: number;
    balanceString: string;
    apr?: number;
    valueInUSD: number;
  }>;
  leverageFarmPosition: Array<any>;
  nftPosition: Array<{
    mint: any;
    nftName: any;
    platform: {
      title: string;
    };
    collectionName: string;
    loanAmount: number;
    loanAmountString: string;
    loanEndTs: any;
    interestAmountInSol: number;
    interestAmountInSolString: string;
    status: string;
    valueInUSD: number;
  }>;
};

export type Validator = {
  title: string;
  // TODO: remove this after backend is updated
  name?: string;
  logoURI: string;
  balance: number;
  balanceString: string;
  activeStakeBalance: number;
  activeStakeBalanceString: string;
  inactiveBalance: number;
  inactiveBalanceString: string;
  validatorAddress: string;
  stakeAccountAddress: string;
  authorizedStakerAddress: string;
  avg24hRewardInUSD: number;
  valueInUSD: number;
  status: string;
  apy?: number;
};

export type NFT = {
  asset: {
    title: string;
    symbol: string;
    mint: string;
  };
  isCompressed: boolean;
  collectionName: string;
  metadataUrl: string;
  balance: number;
  balanceString: string;
  floorPriceInSOL?: number;
  valueInUSD?: number;
};
// step finance spot type
export type SpotAsset = {
  asset: Asset;
  balance: number;
  balanceString: string;
  decimals: number;
  priceChange24hPct: number;
  priceInUSD: number;
  programId: string;
  valueInUSD: number;
};

//step finance asset type
export type Asset = {
  mint: string;
  symbol: string;
  title: string;
  logoURI: string;
};

export type AggregatedDefi = {
  assets: Array<Asset>;
  platformName: string;
  platformImgURL?: string;
  strategy: string;
  valueInUSD?: number;
  extraData: any; // original full defi object
};
