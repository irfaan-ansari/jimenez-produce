import { auth } from "./lib/auth";
import { getSession } from "./server/auth";
import { differenceInSeconds } from "date-fns";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const email = url.searchParams.get("email");
  const response = NextResponse.redirect(url);

  if (email) {
    url.searchParams.delete("email");

    response.cookies.set("customer-email", email, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  const protectedRoutes = ["/admin", "/customer"];
  const isProtectedPath = protectedRoutes.some((route) =>
    url.pathname.startsWith(route),
  );

  if (isProtectedPath) {
    const session = await getSession();

    if (!session) {
      const response = NextResponse.redirect(
        new URL("/otp-login", request.url),
      );
      return response;
    }

    const expiresAt = new Date(session.session.expiresAt);
    const now = new Date();
    const secondsRemaining = differenceInSeconds(expiresAt, now);

    if (secondsRemaining < 3600) {
      await auth.api.signOut({
        headers: request.headers,
        asResponse: true,
      });

      response.cookies.set("better-auth.session_token", "", {
        maxAge: 0,
        path: "/",
      });
      response.cookies.set("__Secure-better-auth.session_token", "", {
        maxAge: 0,
        path: "/",
      });
      return response;
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/products/:path*", "/customer/:path*", "/admin/:path*"],
};
