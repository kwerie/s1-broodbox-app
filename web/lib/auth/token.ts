export type JwtPayload = {
    exp?: number
    [claim: string]: unknown
}

export function decodeToken(token: string): JwtPayload | null {
    const parts = token.split(".")
    if (parts.length !== 3) {
        return null
    }

    try {
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
        return JSON.parse(atob(padded)) as JwtPayload
    } catch {
        return null
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token)
    if (typeof payload?.exp !== "number") {
        return true
    }
    return payload.exp * 1000 <= Date.now()
}
