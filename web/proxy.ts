import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth/cookie"
import { isTokenExpired } from "@/lib/auth/token"

const PUBLIC_PATHS = ["/login"]

function isPublic(pathname: string): boolean {
    return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(SESSION_COOKIE)?.value
    const hasSession = token !== undefined && !isTokenExpired(token)

    if (!isPublic(pathname) && !hasSession) {
        const url = request.nextUrl.clone()
        url.pathname = "/login"
        return NextResponse.redirect(url)
    }

    if (isPublic(pathname) && hasSession) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
