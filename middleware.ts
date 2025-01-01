
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get("authToken");

  // If the token is missing, redirect to root "/"
  if (!authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the token exists, allow the request to continue
  return NextResponse.next();
}

// Define routes where the middleware should apply
export const config = {
  matcher: ["/example/:path*"], // Adjust paths to protect
};

