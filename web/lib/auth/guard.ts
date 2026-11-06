import { redirect } from "next/navigation"
import { connection } from "next/server"
import { getToken } from "./session"
import { getRoleFromToken, type Role } from "./role"
import { isTokenExpired } from "./token"

export async function isLoggedIn(): Promise<boolean> {
    await connection()
    const token = await getToken()
    return token !== undefined && !isTokenExpired(token)
}

export async function requireAuth(): Promise<void> {
    if (!(await isLoggedIn())) {
        redirect("/login")
    }
}

export async function getRole(): Promise<Role | null> {
    await connection()
    const token = await getToken()
    if (token === undefined || isTokenExpired(token)) {
        return null
    }
    return getRoleFromToken(token)
}

export async function hasRole(role: Role): Promise<boolean> {
    return (await getRole()) === role
}

export async function requireRole(...roles: Role[]): Promise<void> {
    const role = await getRole()
    if (role === null) {
        redirect("/login")
    }
    if (!roles.includes(role)) {
        redirect("/")
    }
}
