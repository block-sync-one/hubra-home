import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;

  // Handle QR code redirect: /qr?code=bp25 -> /BP-2025
  if (pathname === "/qr") {
    const code = request.nextUrl.searchParams.get("code");

    if (code?.toLowerCase() === "bp25") {
      return NextResponse.redirect(`${origin}/BP-2025`);
    }

    // If code doesn't match, continue to next middleware/route
    return NextResponse.next();
  }

  // Handle smart link redirect: /BP-2025/link
  if (pathname !== "/BP-2025/link") {
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
  const GOOGLE_PLAY_STORE_URL = "https://play.google.com/store/search?q=hubra&c=apps";
  const FALLBACK_URL = "https://hubra.app";

  // Priority order: Solana Mobile → Android → Fallback
  if (isSolanaMobile) {
    return NextResponse.redirect(SOLANA_APP_STORE_URL);
  }

  if (isAndroid) {
    return NextResponse.redirect(GOOGLE_PLAY_STORE_URL);
  }

  // Fallback for all other devices/browsers (web app)
  return NextResponse.redirect(FALLBACK_URL);
}

// Configure middleware to run on /qr and /BP-2025/link routes
export const config = {
  matcher: ["/qr", "/BP-2025/link"],
};
