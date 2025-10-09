import { NextRequest, NextResponse } from "next/server";

import { fetchBirdeyeData } from "@/lib/services/birdeye";

/**
 * API route to fetch detailed token information by address or symbol
 *
 * @description Fetches comprehensive token data from Birdeye API including
 * current price, market data, volume, and token metadata.
 *
 * @param request - The incoming request object
 * @param params - Route parameters containing the token identifier (address or symbol)
 * @returns JSON response with token data or error
 *
 * @example
 * GET /api/crypto/token/solana
 * GET /api/crypto/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v (USDC address)
 *
 * @throws {Error} When API request fails or token not found
 * @since 1.0.0
 * @version 2.0.0
 * @see {@link https://docs.birdeye.so/reference/get-defi-token_overview} Birdeye Token Overview API Documentation
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await params;

    if (!name) {
      return NextResponse.json({ error: "Token name or address is required" }, { status: 400 });
    }

    console.log(`Fetching token data for: ${name}`);

    // Common Solana token addresses mapping
    const tokenAddressMap: Record<string, string> = {
      solana: "So11111111111111111111111111111111111111112",
      sol: "So11111111111111111111111111111111111111112",
      usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      usdt: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      bonk: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      jup: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      pyth: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
      wif: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      render: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof",
      jito: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    };

    // Get token address (use mapping or treat as address)
    const tokenAddress = tokenAddressMap[name.toLowerCase()] || name;

    // Fetch token overview from Birdeye (Solana network)
    const overviewResponse = await fetchBirdeyeData<{
      data: {
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
        extensions?: {
          description?: string;
          coingeckoId?: string;
          website?: string;
          twitter?: string;
          telegram?: string;
          discord?: string;
          medium?: string;
        };
      };
      success: boolean;
    }>(
      "/defi/token_overview",
      {
        address: tokenAddress,
        // chain parameter will be auto-added by buildBirdeyeUrl
      },
      {
        cache: "no-store", // Disable cache for fresh data
      }
    );

    if (!overviewResponse.success || !overviewResponse.data) {
      console.warn(`Token not found: ${name}`);

      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const token = overviewResponse.data;

    // Try to fetch enhanced description from CoinGecko if coingeckoId is available
    let enhancedDescription = token.extensions?.description || "";

    console.log(`Description check for ${token.name}:`, {
      hasBirdeyeDesc: !!token.extensions?.description,
      birdeyeDescLength: token.extensions?.description?.length || 0,
      hasCoinGeckoId: !!token.extensions?.coingeckoId,
      coinGeckoId: token.extensions?.coingeckoId,
      willFetchCoinGecko: token.extensions?.coingeckoId && (!enhancedDescription || enhancedDescription.length < 50),
    });

    if (token.extensions?.coingeckoId && (!enhancedDescription || enhancedDescription.length < 50)) {
      try {
        console.log(`Fetching enhanced description from CoinGecko for ${token.extensions.coingeckoId}...`);

        const cgResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${token.extensions.coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`,
          {
            next: { revalidate: 3600 }, // Cache for 1 hour
          }
        );

        console.log(`CoinGecko response status: ${cgResponse.status}`);

        if (cgResponse.ok) {
          const cgData = await cgResponse.json();

          if (cgData.description?.en) {
            enhancedDescription = cgData.description.en;
            console.log(`✅ Enhanced description from CoinGecko for ${token.name} (${enhancedDescription.length} chars)`);
          } else {
            console.log(`CoinGecko response has no description.en field`);
          }
        } else {
          console.log(`CoinGecko API failed with status: ${cgResponse.status}`);
        }
      } catch (cgError) {
        console.error("Could not fetch CoinGecko description:", cgError);
      }
    } else {
      console.log(`Skipping CoinGecko fetch: ${!token.extensions?.coingeckoId ? "No coingeckoId" : "Description long enough"}`);
    }

    // Fetch market data from the market-data endpoint
    let marketData: any = null;

    try {
      const marketDataResponse = await fetchBirdeyeData<{
        data: {
          price?: number;
          price_change_24h?: number;
          price_change_24h_percent?: number;
          volume_24h?: number;
          volume_24h_change_percent?: number;
          market_cap?: number;
          market_cap_rank?: number;
          liquidity?: number;
          liquidity_change_24h_percent?: number;
          real_volume_24h?: number;
          real_volume_24h_change_percent?: number;
          volume_24h_buy?: number;
          volume_24h_sell?: number;
          trade_24h?: number;
          holder?: number;
          unique_wallet_24h?: number;
          unique_wallet_24h_change_percent?: number;
        };
        success: boolean;
      }>(
        "/defi/v3/token/market-data",
        {
          address: tokenAddress,
        },
        {
          cache: "no-store",
        }
      );

      if (marketDataResponse.success && marketDataResponse.data) {
        marketData = marketDataResponse.data;
        console.log(`Market data fetched for ${token.symbol}:`, marketData);
      }
    } catch (error) {
      console.warn("Failed to fetch market data:", error);
    }

    // Merge data from both endpoints (market-data takes priority)
    const currentPrice = marketData?.price || token.price || 0;
    const marketCap = marketData?.market_cap || token.market_cap || 0;
    const volume24h = marketData?.volume_24h || token.volume_24h_usd || 0;
    const priceChangePercent = marketData?.price_change_24h_percent || token.price_change_24h_percent || 0;
    const priceChange24h = marketData?.price_change_24h || (currentPrice * priceChangePercent) / 100;
    const liquidity = marketData?.liquidity || token.liquidity || 0;

    // Buy/sell volume from API (if available)
    // Note: Birdeye market-data often returns null for buy/sell breakdown
    const buyVolume24h = marketData?.volume_24h_buy ?? null;
    const sellVolume24h = marketData?.volume_24h_sell ?? null;

    // Calculate percentages only if we have actual buy/sell data
    let buyVolumePercent = null;
    let sellVolumePercent = null;

    if (buyVolume24h !== null && sellVolume24h !== null) {
      const totalVolume = buyVolume24h + sellVolume24h;

      if (totalVolume > 0) {
        buyVolumePercent = (buyVolume24h / totalVolume) * 100;
        sellVolumePercent = (sellVolume24h / totalVolume) * 100;
      }
    }

    const tradeCount = marketData?.trade_24h || 0;
    const holderCount = marketData?.holder || token.holder || 0;

    // Fetch additional trade data for high/low
    let tradeData: any = null;

    try {
      const tradeResponse = await fetchBirdeyeData<{
        data: {
          items: Array<{
            blockUnixTime: number;
            price: number;
            volume: number;
          }>;
        };
        success: boolean;
      }>(
        "/defi/trades_token",
        {
          address: tokenAddress,
          limit: "10",
        },
        {
          cache: "no-store", // Disable cache for fresh data
        }
      );

      if (tradeResponse.success && tradeResponse.data?.items) {
        tradeData = tradeResponse.data.items;
      }
    } catch (error) {
      console.warn("Failed to fetch trade data:", error);
    }

    // Calculate high/low 24h from trade data or use approximations
    let high24h = currentPrice * 1.05;
    let low24h = currentPrice * 0.95;

    if (tradeData && tradeData.length > 0) {
      const prices = tradeData.map((trade: any) => trade.price);

      high24h = Math.max(...prices);
      low24h = Math.min(...prices);
    }

    // Estimate total supply from market cap and price
    const estimatedSupply = currentPrice > 0 ? marketCap / currentPrice : 0;

    // Birdeye-native response structure (no CoinGecko attributes)
    const transformedData = {
      // Core token info
      id: token.address,
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      logo_uri: token.logo_uri || "",

      // Price data
      price: currentPrice,
      price_change_24h: priceChange24h,
      price_change_24h_percent: priceChangePercent,

      // Market data
      market_cap: marketCap,
      volume_24h: volume24h,
      liquidity: liquidity,
      holder: holderCount,

      // 24h high/low
      high_24h: high24h,
      low_24h: low24h,

      // Supply
      circulating_supply: estimatedSupply,
      total_supply: estimatedSupply,

      // Metadata
      decimals: token.decimals || 9,
      extensions: {
        ...token.extensions,
        description: enhancedDescription, // Use enhanced description
      },

      // Trading info
      buy_volume_24h: buyVolume24h,
      sell_volume_24h: sellVolume24h,
      buy_volume_percent: buyVolumePercent,
      sell_volume_percent: sellVolumePercent,
      trade_count_24h: tradeCount,

      // Network
      chain: "solana",

      // Timestamp
      last_updated: new Date().toISOString(),
    };

    console.log(`Successfully fetched token data for: ${token.name} (${token.symbol})`);

    return NextResponse.json(transformedData, {
      headers: {
        // Cache on CDN/server for 2 minutes, allow stale data while revalidating
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
        "X-Fallback-Data": "false",
      },
    });
  } catch (error) {
    console.error("Error fetching token data from Birdeye:", error);

    // Return fallback data instead of error
    const fallbackData = {
      id: "So11111111111111111111111111111111111111112",
      address: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      name: "Solana",
      logo_uri:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      price: 0,
      price_change_24h: 0,
      price_change_24h_percent: 0,
      market_cap: 0,
      volume_24h: 0,
      liquidity: 0,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: 0,
      total_supply: 0,
      decimals: 9,
      extensions: {},
      buy_volume_24h: 0,
      sell_volume_24h: 0,
      trade_count_24h: 0,
      chain: "solana",
      last_updated: new Date().toISOString(),
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Fallback-Data": "true",
      },
    });
  }
}
