import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromPayload, isTokenExpired, parseJwt } from "@/lib/auth";

const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-email",
];

const openRoutePrefixes = [
  "/",
  "/shop",
  "/products",
  "/cart",
  "/checkout",
  "/about",
  "/contact",
  "/search",
  "/hot-deals",
];

const userRoutePrefixes = ["/account"];
const adminRoutePrefixes = ["/admin"];

function isOpen(pathname: string): boolean {
  return openRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isUserRoute(pathname: string): boolean {
  return userRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const payload = token && !isTokenExpired(token) ? parseJwt(token) : null;
  const user = payload ? getUserFromPayload(payload) : null;

  if (isPublicRoute(pathname)) {
    if (user) {
      const dest = user.role === "admin" ? "/admin/dashboard" : "/";
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute(pathname)) {
    if (!user) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isUserRoute(pathname)) {
    if (!user) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isOpen(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
