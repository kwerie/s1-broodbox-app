import { decodeToken } from "./token"

export const ROLE_VALUES = ["customer", "customer-service"] as const

export type Role = (typeof ROLE_VALUES)[number]

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"

export function isRole(value: unknown): value is Role {
    return typeof value === "string" && (ROLE_VALUES as readonly string[]).includes(value)
}

export function getRoleFromToken(token: string): Role | null {
    const payload = decodeToken(token)
    if (!payload) {
        return null
    }

    const claim = payload.role ?? payload[ROLE_CLAIM]
    return isRole(claim) ? claim : null
}
