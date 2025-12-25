"use server";

import { fetchCryptoPanicNews } from "@/lib/services/cryptopanic";

/**
 * Server Action to fetch all CryptoPanic SOL news
 */
export async function getCryptoPanicNews() {
  return await fetchCryptoPanicNews();
}
