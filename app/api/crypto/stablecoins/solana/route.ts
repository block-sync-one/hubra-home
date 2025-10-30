/**
 * GET /api/crypto/stablecoins/solana
 *
 * Alias endpoint for /api/crypto/stablecoins
 * Re-exports the main stablecoins route for backward compatibility
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/crypto/stablecoins/solana');
 * const { data } = await response.json();
 * console.log(`Total: $${data.totalCirculating}`);
 * ```
 */
export { GET } from "../route";
