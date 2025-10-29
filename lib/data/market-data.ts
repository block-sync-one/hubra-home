import "server-only";

import { setUnifiedToken, toUnifiedTokenData } from "./unified-token-cache";

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { Token } from "@/lib/types/token";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

interface BirdeyeToken {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo_uri?: string;
  liquidity?: number;
  volume_24h_usd?: number;
  volume_24h_change_percent?: number;
  price?: number;
  price_change_24h_percent?: number;
  market_cap?: number;
  holder?: number;
}

interface BirdeyeTokenListResponse {
  data: {
    items: BirdeyeToken[];
  };
  success: boolean;
}

function transformBirdeyeToken(token: BirdeyeToken): Token {
  const rawVolume = token.volume_24h_usd || 0;

  return {
    id: token.address,
    name: token.name === "Wrapped SOL" ? "Solana" : token.name,
    symbol: token.symbol.toUpperCase(),
    imgUrl: token.logo_uri || "/logo.svg",
    price: "", // Will be formatted by caller
    change: token.price_change_24h_percent || 0,
    volume: "", // Will be formatted by caller
    rawVolume,
    marketCap: token.market_cap || 0,
    rawPrice: token.price || 0, // Store raw price for formatting
  };
}

/**
 * This ONLY caches basic list data (price, volume, market cap)
 * Full token overview data is fetched ON-DEMAND when user visits token detail page
 *
 * This prevents 200+ unnecessary API calls to /defi/token_overview
 *
 */
function cacheIndividualTokensAsync(tokens: BirdeyeToken[]): void {
  // Fire and forget - don't block the response
  (async () => {
    try {
      const CHUNK_SIZE = 50;

      for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
        const chunk = tokens.slice(i, i + CHUNK_SIZE);

        await Promise.all(chunk.map((token) => setUnifiedToken(token.address, toUnifiedTokenData(token, "list"), CACHE_TTL.TOKEN_DETAIL)));
      }

      loggers.cache.debug(`✓ Cached ${tokens.length} individual tokens (async)`);
    } catch (error) {
      loggers.cache.error("Failed to cache individual tokens:", error);
    }
  })();
}

/**
 * Fetch market data from Birdeye API with Redis caching
 * This function can be called from both server components and API routes
 * The API key is protected as this only runs on the server
 *
 * Caching strategy:
 * - Cache key includes limit and offset for pagination support
 * - TTL: 2 minutes (market data changes frequently)
 * - Shared cache between server components and API routes
 *
 */
export async function fetchMarketData(limit: number = 100, offset: number = 0): Promise<Token[]> {
  const cacheKey = cacheKeys.marketData(limit, offset);

  try {
    // Try Redis cache first
    const cachedData = await redis.get<Token[]>(cacheKey);

    if (cachedData) {
      loggers.cache.debug(`HIT: ${limit} tokens (offset: ${offset})`);

      return cachedData;
    }

    loggers.cache.debug(`MISS: Fetching ${limit} tokens from Birdeye (offset: ${offset})`);

    const queryParam = {
      sort_by: "holder",
      sort_type: "desc",
      min_holder: "10",
      min_volume_24h_usd: "10",
      min_trade_24h_count: "10",
    };

    // Birdeye API has a max limit of 100 per request
    const BIRDEYE_MAX_LIMIT = 100;
    let allItems: BirdeyeToken[] = [];

    if (limit <= BIRDEYE_MAX_LIMIT) {
      // Single request for 100 or fewer tokens
      const response = await fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
        offset: offset.toString(),
        limit: limit.toString(),
        ...queryParam,
      });

      if (!response.success || !response.data?.items) {
        loggers.data.warn("Invalid response from Birdeye API");

        return [];
      }

      allItems = response.data.items;
    } else {
      // Multiple parallel requests for more than 100 tokens
      const numRequests = Math.ceil(limit / BIRDEYE_MAX_LIMIT);
      const requests = [];

      for (let i = 0; i < numRequests; i++) {
        const batchOffset = offset + i * BIRDEYE_MAX_LIMIT;
        const batchLimit = Math.min(BIRDEYE_MAX_LIMIT, limit - i * BIRDEYE_MAX_LIMIT);

        requests.push(
          fetchBirdeyeData<BirdeyeTokenListResponse>("/defi/v3/token/list", {
            offset: batchOffset.toString(),
            limit: batchLimit.toString(),
            ...queryParam,
          })
        );
      }

      const responses = await Promise.all(requests);

      // Combine all results
      for (const response of responses) {
        if (response.success && response.data?.items) {
          allItems.push(...response.data.items);
        }
      }
    }

    if (allItems.length === 0) {
      loggers.data.warn("No tokens returned from Birdeye API");

      return [];
    }

    // Transform Birdeye data to our Token type
    const transformedTokens = allItems.map(transformBirdeyeToken)?.filter((item) => item.marketCap && item.marketCap > 100000);

    // Cache the list (blocks response - quick operation)
    redis.set(cacheKey, transformedTokens, CACHE_TTL.MARKET_DATA).catch((err) => {
      loggers.cache.error(`List cache failed: ${err.message}`);
    });

    // Cache individual tokens asynchronously (doesn't block response)
    cacheIndividualTokensAsync(allItems);

    loggers.cache.debug(`✓ Returning ${transformedTokens.length} tokens (caching in background)`);

    return transformedTokens;
  } catch (error) {
    loggers.data.error("Error fetching market data:", error);

    return [];
  }
}
