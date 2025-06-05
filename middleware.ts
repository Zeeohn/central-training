import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require authentication
const protectedPaths = [
  "/trainee",
  "/training-executive",
  "/supreme",
  "/select-training",
  "/settings",
];

// Define paths that should be accessible only to non-authenticated users
const authPaths = ["/signin"];

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value;
  const path = request.nextUrl.pathname;

  // If the path is protected and the user is not authenticated, redirect to signin
  if (protectedPaths.some((pp) => path.startsWith(pp)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If the path is for non-authenticated users and the user is authenticated, redirect to appropriate dashboard
  // We're defaulting to trainee dashboard for now
  if (authPaths.includes(path) && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/trainee";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/trainee/:path*",
    "/training-executive/:path*",
    "/supreme/:path*",
    "/select-training/:path*",
    "/settings/:path*",
    "/signin",
  ],
};
