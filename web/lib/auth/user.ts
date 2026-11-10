import { decodeToken } from "./token"

export type AuthUser = {
    email: string
    name: string | null
}

export function getUserFromToken(token: string): AuthUser | null {
    const payload = decodeToken(token)
    if (typeof payload?.email !== "string") {
        return null
    }

    return {
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : null,
    }
}
