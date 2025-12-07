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

  // No other routes to handle
  return NextResponse.next();
}

// Configure middleware to run on /qr route only
export const config = {
  matcher: ["/qr"],
};
