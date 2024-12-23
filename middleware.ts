// // middleware.ts
// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Define the protected routes
//   const protectedRoutes = ['/example'];

//   // Get the user authentication token (e.g., from cookies)
//   const authToken = request.cookies.get('JSESSIONID')?.value;

//   console.log("auth-token", authToken);

//   // If the route is protected and the user is not authenticated, redirect to login
//   if (protectedRoutes.includes(pathname) && !authToken) {
//     const loginUrl = new URL('/login', request.nextUrl.origin);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Allow access if authenticated
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/example'], // Apply middleware only to the /example page
// };


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

