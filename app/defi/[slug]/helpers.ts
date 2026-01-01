/**
 * Helper functions for DeFi protocol pages
 */

export const DEFILLAMA_BASE_URL = "https://defillama.com/protocol";

/**
 * Formats a token address for display (truncates if too long)
 */
export function formatTokenAddress(address: string): string {
  return address.length > 8 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;
}

/**
 * Gets the token symbol from protocol data
 * Prefers protocol.symbol, falls back to assetToken if it's short (likely a symbol)
 */
export function getTokenSymbol(protocol: { symbol?: string; assetToken?: string }): string {
  const protocolSymbol = protocol.symbol || "";
  const assetToken = protocol.assetToken || "";

  return protocolSymbol || (assetToken && assetToken.length < 32 ? assetToken : "") || "";
}

/**
 * Builds a DeFiLlama protocol URL
 */
export function buildDefillamaUrl(slug: string, id: string): string {
  return `${DEFILLAMA_BASE_URL}/${slug || id}`;
}

/**
 * Gets the display value for a token (uppercase symbol or "Token" fallback)
 */
export function getTokenDisplayValue(tokenSymbol: string): string {
  return tokenSymbol.toUpperCase() || "Token";
}
