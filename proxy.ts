import { NextResponse, NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.next();
  }

  url.searchParams.delete("email");

  const response = NextResponse.redirect(url);

  response.cookies.set("customer-email", email, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export const config = {
  matcher: "/catalog/:path*",
};
