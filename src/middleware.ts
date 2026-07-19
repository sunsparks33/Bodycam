import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rule 2 & 3: If an unauthorized user tries to access '/archive' (not HIGH_COMMAND),
    // redirect them to '/dashboard'.
    if (path.startsWith("/archive") && token?.role !== "HIGH_COMMAND") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/", // Rule 4: Unauthenticated users are redirected to '/' when trying to access any protected route.
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/archive/:path*", "/officers/:path*"],
};
