"use server";

import { fetchCryptoPanicNews } from "@/lib/services/cryptopanic";

/**
 * Server Action to fetch CryptoPanic news
 * Can be called directly from client components
 * @param key - Token symbol (e.g., "SOL", "BTC")
 */
export async function getCryptoPanicNews(key: string) {
  return await fetchCryptoPanicNews(key);
}
