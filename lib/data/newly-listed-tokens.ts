import "server-only";

import { fetchMarketData, MarketDataResult } from "./market-data";

import { cacheKeys } from "@/lib/cache";
import { buildNewlyListedQuery, TOKEN_LIMITS } from "@/lib/constants/market";
import { loggers } from "@/lib/utils/logger";

/**
 * Fetch newly listed tokens (last 24 hours by default)
 * This is a convenience wrapper around fetchMarketData with preset params
 *
 * @param limit - Number of tokens to fetch (default: 400)
 * @param offset - Pagination offset (default: 0)
 * @param hoursAgo - How many hours back to look for new listings (default: 24)
 * @returns MarketDataResult containing newly listed tokens sorted by volume
 */
export async function fetchNewlyListedTokens(
  limit: number = TOKEN_LIMITS.TOKENS_PAGE,
  offset: number = 0,
  hoursAgo: number = 24
): Promise<MarketDataResult> {
  try {
    loggers.data.debug(`Fetching newly listed tokens (last ${hoursAgo}h, limit: ${limit})`);

    const queryParams = buildNewlyListedQuery(hoursAgo);
    const result = await fetchMarketData(limit, offset, queryParams, cacheKeys.newlyListed(limit, offset));

    loggers.data.debug(`✓ Found ${result.data.length} newly listed tokens`);

    return result;
  } catch (error) {
    loggers.data.error("Error fetching newly listed tokens:", error);

    return {
      data: [],
      stats: {
        totalMarketCap: 0,
        totalVolume: 0,
        totalFDV: 0,
        marketCapChange: 0,
      },
    };
  }
}
