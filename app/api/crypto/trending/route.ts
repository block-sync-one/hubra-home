import { NextResponse } from 'next/server';

/**
 * Fallback trending cryptocurrency data for when CoinGecko API fails
 * Provides a single Bitcoin entry to maintain data structure consistency
 */
const FALLBACK_TRENDING_DATA = {
  coins: [
    {
      item: {
        id: 'bitcoin',
        coin_id: 1,
        name: 'Bitcoin',
        symbol: 'btc',
        market_cap_rank: 1,
        thumb: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        slug: 'bitcoin',
        price_btc: 1,
        score: 0
      }
    }
  ]
};

/**
 * Trending cryptocurrencies endpoint
 * 
 * Fetches currently trending cryptocurrencies based on:
 * - Search volume and social media mentions
 * - Market activity and trading volume
 * - Community interest and engagement
 * - Recent price movements and news
 * 
 * @description This endpoint provides real-time trending cryptocurrency data
 * from CoinGecko API with 5-minute caching and fallback data support.
 * Useful for identifying popular and emerging cryptocurrencies.
 * 
 * @returns {Promise<NextResponse>} JSON response containing trending cryptocurrencies data
 * 
 * @example
 * ```typescript
 * // Fetch trending cryptocurrencies
 * const response = await fetch('/api/crypto/trending');
 * const data = await response.json();
 * 
 * console.log(data.coins[0].item.name); // Trending coin name
 * console.log(data.coins[0].item.market_cap_rank); // Market cap rank
 * console.log(data.coins[0].item.score); // Trending score
 * ```
 * 
 * @example
 * ```typescript
 * // Display trending coins with their images
 * data.coins.forEach(coin => {
 *   console.log(`${coin.item.name} (${coin.item.symbol})`);
 *   console.log(`Rank: ${coin.item.market_cap_rank}`);
 *   console.log(`Image: ${coin.item.thumb}`);
 * });
 * ```
 * 
 * @throws {Error} When CoinGecko API is unavailable, returns fallback data with 200 status
 * 
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @see {@link https://docs.coingecko.com/reference/search-trending} CoinGecko Trending API Documentation
 */
export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3';
    const url = `${baseUrl}/search/trending${apiKey ? `?x_cg_pro_api_key=${apiKey}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      next: { 
        revalidate: 300 // Cache for 5 minutes (300 seconds)
      }
    });

    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status} - Serving fallback data`);
      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Fallback-Data': 'true',
        }
      });
    }

    const data = await response.json();
    
    // Validate data structure
    if (!data?.coins || !Array.isArray(data.coins) || data.coins.length === 0) {
      console.warn('Invalid or empty trending data from CoinGecko API - Serving fallback data');
      return NextResponse.json(FALLBACK_TRENDING_DATA, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'X-Fallback-Data': 'true',
        }
      });
    }
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300',
      }
    });
  } catch (error) {
    console.error('Error fetching trending data:', error);
    return NextResponse.json(FALLBACK_TRENDING_DATA, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Fallback-Data': 'true',
        'X-Error': error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}
