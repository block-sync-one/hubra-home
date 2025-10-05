import { NextResponse } from 'next/server';

/**
 * Fallback data structure for when CoinGecko API fails
 * Provides safe default values to prevent application crashes
 */
const FALLBACK_GLOBAL_DATA = {
  data: {
    active_cryptocurrencies: 0,
    total_market_cap: { usd: 0 },
    total_volume: { usd: 0 },
    market_cap_change_percentage_24h_usd: 0,
    markets: 0,
    updated_at: Date.now()
  }
};

/**
 * Global cryptocurrency market data endpoint
 * 
 * Fetches comprehensive global cryptocurrency statistics including:
 * - Total market capitalization across all cryptocurrencies
 * - Total 24-hour trading volume
 * - Number of active cryptocurrencies
 * - Market cap change percentage over 24 hours
 * - Number of active markets
 * 
 * @description This endpoint provides real-time global cryptocurrency market data
 * from CoinGecko API with 5-minute caching and fallback data support.
 * 
 * @returns {Promise<NextResponse>} JSON response containing global market data
 * 
 * @example
 * ```typescript
 * // Fetch global market data
 * const response = await fetch('/api/crypto/global');
 * const data = await response.json();
 * 
 * console.log(data.data.total_market_cap.usd); // Total market cap in USD
 * console.log(data.data.active_cryptocurrencies); // Number of active cryptos
 * ```
 * 
 * @throws {Error} When CoinGecko API is unavailable, returns fallback data with 200 status
 * 
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @see {@link https://docs.coingecko.com/reference/crypto-global} CoinGecko Global API Documentation
 */
export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const baseUrl = apiKey ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3';
    const url = `${baseUrl}/global${apiKey ? `?x_cg_pro_api_key=${apiKey}` : ''}`;

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
      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Shorter cache for fallback
          'X-Fallback-Data': 'true',
        }
      });
    }

    const data = await response.json();
    
    // Validate data structure
    if (!data?.data || !data.data.total_market_cap) {
      console.warn('Invalid data structure from CoinGecko API - Serving fallback data');
      return NextResponse.json(FALLBACK_GLOBAL_DATA, {
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
    console.error('Error fetching global data:', error);
    return NextResponse.json(FALLBACK_GLOBAL_DATA, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Fallback-Data': 'true',
        'X-Error': error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}
