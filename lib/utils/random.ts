/**
 * Deterministic random number generation utilities
 * Used for SSR-compatible chart generation
 */

/**
 * Generate deterministic random number based on seed
 * Ensures server and client render identical values (no hydration mismatch)
 *
 * @param seed - String seed (e.g., token ID)
 * @param index - Index for variation
 * @returns Number between 0 and 1
 *
 * @example
 * ```typescript
 * const noise = seededRandom("So111...112", 0); // Always returns same value
 * const noise2 = seededRandom("So111...112", 1); // Different value, but deterministic
 * ```
 */
export function seededRandom(seed: string, index: number): number {
  const combined = seed + index.toString();
  let hash = 0;

  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to 0-1 range using sine function
  return (Math.abs(Math.sin(hash)) * 10000) % 1;
}
