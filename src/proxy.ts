import { NextRequest, NextResponse } from "next/server";

export default function Proxy(request: NextRequest) {
  const cookie = request.cookies.get("token");

  if (request.nextUrl.pathname.startsWith("/auth") && cookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard") && !cookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
