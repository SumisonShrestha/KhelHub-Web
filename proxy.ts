import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];
const AUTH_ONLY_ROUTES = ["/login", "/register"];
const TOKEN_COOKIE = "auth_token";

function matchesRoute(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
}

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(TOKEN_COOKIE)?.value;

    const isProtected = matchesRoute(pathname, PROTECTED_ROUTES);
    const isAuthOnly = matchesRoute(pathname, AUTH_ONLY_ROUTES);

    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthOnly && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}