/**
 * Shared token data fetching logic
 * Can be used by both API routes and server components
 */

import { fetchBirdeyeData } from "@/lib/services/birdeye";
import { BirdEyeTokenOverview } from "@/lib/types/birdeye";

/**
 * Fetch token data from Birdeye API
 * This function can be called from both server components and API routes
 * The API key is protected as this only runs on the server
 */
export async function fetchTokenData(tokenAddress: string, options?: { revalidate?: number }) {
  try {
    console.log("Fetching token data for:", tokenAddress);

    // Fetch token overview from Birdeye (Solana network)
    const overviewResponse = await fetchBirdeyeData<BirdEyeTokenOverview>(
      "/defi/token_overview",
      {
        address: tokenAddress,
        ui_amount_mode: "scaled",
      },
      {
        next: { revalidate: options?.revalidate || 120 },
      }
    );

    if (!overviewResponse.success || !overviewResponse.data) {
      console.warn(`Token not found: ${tokenAddress}`);

      return null;
    }

    const tokenData = overviewResponse.data;

    // Replace "Wrapped SOL" with "Solana" for better UX
    if (tokenData.name === "Wrapped SOL") {
      tokenData.name = "Solana";
    }

    console.log("Token data fetched successfully:", tokenData.symbol, tokenData);

    return tokenData;
  } catch (error) {
    console.error("Error fetching token data:", error);

    return null;
  }
}
