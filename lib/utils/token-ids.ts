/**
 * Maps common token names to their CoinGecko IDs
 *
 * @description Provides a mapping between display names and CoinGecko token IDs
 * to ensure proper API calls for popular cryptocurrencies.
 *
 * @since 1.0.0
 * @version 1.0.0
 */

export const TOKEN_ID_MAP: Record<string, string> = {
  // Major cryptocurrencies
  "bitcoin": "bitcoin",
  "ethereum": "ethereum",
  "binancecoin": "binancecoin",
  "cardano": "cardano",
  "solana": "solana",
  "polkadot": "polkadot",
  "chainlink": "chainlink",
  "litecoin": "litecoin",
  "bitcoin-cash": "bitcoin-cash",
  "stellar": "stellar",

  // DeFi tokens
  "uniswap": "uniswap",
  "aave": "aave",
  "compound": "compound-governance-token",
  "maker": "maker",
  "sushi": "sushiswap",
  "curve": "curve-dao-token",
  "yearn": "yearn-finance",
  "synthetix": "havven",
  "balancer": "balancer",
  "1inch": "1inch",

  // Layer 2
  "polygon": "matic-network",
  "arbitrum": "arbitrum",
  "optimism": "optimism",
  "avalanche": "avalanche-2",

  // Meme coins
  "dogecoin": "dogecoin",
  "shiba-inu": "shiba-inu",
  "pepe": "pepe",
  "floki": "floki",

  // Stablecoins
  "tether": "tether",
  "usd-coin": "usd-coin",
  "dai": "dai",
  "binance-usd": "binance-usd",

  // Other popular tokens
  "lido": "lido-dao",
  "the-sandbox": "sandbox",
  "decentraland": "decentraland",
  "axie-infinity": "axie-infinity",
  "chiliz": "chiliz",
  "enjin-coin": "enjincoin",
  "gala": "gala",
  "immutable-x": "immutable-x",
  "flow": "flow",
  "near": "near",
  "algorand": "algorand",
  "vechain": "vechain",
  "filecoin": "filecoin",
  "tezos": "tezos",
  "monero": "monero",
  "zcash": "zcash",
  "dash": "dash",
  "ripple": "ripple",
  "tron": "tron",
  "eos": "eos",
  "neo": "neo",
  "qtum": "qtum",
  "icon": "icon",
  "ontology": "ontology",
  "zilliqa": "zilliqa",
  "waves": "waves",
  "nano": "nano",
  "decred": "decred",
  "verge": "verge",
  "siacoin": "siacoin",
  "steem": "steem",
  "bitshares": "bitshares",
  "bytecoin": "bytecoin-bcn",
  "pivx": "pivx",
  "reddcoin": "reddcoin",
  "nxt": "nxt",
  "burst": "burst",
  "factom": "factom",
  "maidsafecoin": "maidsafecoin",
  "counterparty": "counterparty",
  "omni": "omni",
  "bitshares": "bitshares",
  "steem-dollars": "steem-dollars",
  "steem": "steem",
  "bitshares": "bitshares",
  "bytecoin": "bytecoin-bcn",
  "pivx": "pivx",
  "reddcoin": "reddcoin",
  "nxt": "nxt",
  "burst": "burst",
  "factom": "factom",
  "maidsafecoin": "maidsafecoin",
  "counterparty": "counterparty",
  "omni": "omni",
};

/**
 * Gets the CoinGecko token ID for a given token name
 *
 * @param tokenName - The token name to look up
 * @returns The CoinGecko token ID or the original name if not found
 *
 * @example
 * getTokenId('ethereum') // returns 'ethereum'
 * getTokenId('lido') // returns 'lido-dao'
 * getTokenId('unknown-token') // returns 'unknown-token'
 */
export function getTokenId(tokenName: string): string {
  const normalizedName = tokenName.toLowerCase().replace(/\s+/g, "-");

  return TOKEN_ID_MAP[normalizedName] || normalizedName;
}
