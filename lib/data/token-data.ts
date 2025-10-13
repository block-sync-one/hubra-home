import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { BirdEyeTokenOverview } from "@/lib/types/birdeye";
import { redis, cacheKeys, CACHE_TTL } from "@/lib/cache";
import { loggers } from "@/lib/utils/logger";

type TokenData = BirdEyeTokenOverview["data"];

export async function fetchTokenData(tokenAddress: string): Promise<TokenData | null> {
  try {
    const cacheKey = cacheKeys.tokenDetail(tokenAddress);

    // Try Redis cache first
    const cachedData = await redis.get<TokenData>(cacheKey);

    if (cachedData) {
      loggers.cache.debug(`HIT: ${tokenAddress}`);

      return cachedData;
    }

    loggers.cache.debug(`MISS: ${tokenAddress} - Fetching from Birdeye`);

    // Fetch token overview from Birdeye (Solana network)
    const overviewResponse = await fetchBirdeyeData<BirdEyeTokenOverview>("/defi/token_overview", {
      address: tokenAddress,
      ui_amount_mode: "scaled",
    });

    if (!overviewResponse.success || !overviewResponse.data) {
      loggers.data.warn(`Token not found: ${tokenAddress}`);

      return null;
    }

    const tokenData = overviewResponse.data;

    // Replace "Wrapped SOL" with "Solana" for better UX
    if (tokenData.name === "Wrapped SOL") {
      tokenData.name = "Solana";
    }

    // Store in Redis cache asynchronously (don't block response)
    redis.set(cacheKey, tokenData, CACHE_TTL.TOKEN_DETAIL).catch((err) => {
      loggers.cache.error(`SET failed: ${err.message}`);
    });

    loggers.cache.debug(`Caching: ${tokenData.symbol}`);

    return tokenData;
  } catch (error) {
    loggers.data.error("Error fetching token data:", error);

    return null;
  }
}
