import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/account", "/shop"];
const guestOnlyPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const blockedPaths = ["/armory"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to get the raw path
  const pathWithoutLocale = pathname.replace(/^\/(fr|en|es|de|it)(\/|$)/, "/");

  const localeMatch = pathname.match(/^\/(fr|en|es|de|it)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "en";
  const session = request.cookies.get("lordaeron_session");

  const isBlocked = blockedPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"),
  );

  if (isBlocked) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const isProtected = protectedPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"),
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  const isGuestOnly = guestOnlyPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"),
  );

  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(fr|en|es|de|it)/:path*"],
};
