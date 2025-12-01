import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only process /link and /BP-2025/link routes
  if (pathname !== "/link" && pathname !== "/BP-2025/link") {
    return NextResponse.next();
  }

  // Get User-Agent from request headers
  const userAgent = request.headers.get("user-agent") || "";

  // Normalize User-Agent to lowercase for case-insensitive matching
  const normalizedUA = userAgent.toLowerCase();

  // Check for Solana Mobile devices/browsers
  // Solana Mobile, SolanaMobile DApp, and Saga should identify Solana Mobile
  const isSolanaMobile =
    normalizedUA.includes("solanamobile") ||
    normalizedUA.includes("solana mobile") ||
    normalizedUA.includes("solana dapp") ||
    normalizedUA.includes("saga");

  // Check for Android devices
  const isAndroid = normalizedUA.includes("android");

  // Redirect URLs - Hubra app links
  const SOLANA_APP_STORE_URL = "https://mobile.solanamobile.com/apps/hubra";
  const GOOGLE_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=app.hubra";
  const FALLBACK_URL = "https://hubra.app";

  // Priority order: Solana Mobile → Android → iOS → Fallback
  if (isSolanaMobile) {
    return NextResponse.redirect(SOLANA_APP_STORE_URL);
  }

  if (isAndroid) {
    return NextResponse.redirect(GOOGLE_PLAY_STORE_URL);
  }

  // Fallback for all other devices/browsers (web app)
  return NextResponse.redirect(FALLBACK_URL);
}

// Configure middleware to run on /link and /BP-2025/link routes
export const config = {
  matcher: ["/link", "/BP-2025/link"],
};
