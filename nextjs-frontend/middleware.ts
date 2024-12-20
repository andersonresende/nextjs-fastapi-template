import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { usersCurrentUser } from "@/app/clientService";

// Global configuration to use Edge runtime for all routes
export const config = {
  // runtime: 'experimental-edge',  // Set Edge runtime globally for all routes
  matcher: ['/dashboard/:path*'],  // Apply middleware only to /dashboard and its subpaths
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  };

  const { error } = await usersCurrentUser(options);

  if (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}