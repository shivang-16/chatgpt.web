import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = getTokenFromStorage(request);

  // 1. If logged in and trying to visit /login or /signup, redirect to /
  if (token && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If NOT logged in and trying to access /chat/*, redirect to /login
  if (!token && path.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Allow all other requests
  return NextResponse.next();
}

function getTokenFromStorage(request: NextRequest) {
  const token = request.cookies.get("token");
  return token?.value; // Get cookie value correctly
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/chat/:path*",
  ],
};
