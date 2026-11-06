import { cookies } from "next/headers"
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./cookie"

export async function getToken(): Promise<string | undefined> {
    const store = await cookies()
    return store.get(SESSION_COOKIE)?.value
}

export async function setToken(token: string): Promise<void> {
    const store = await cookies()
    store.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    })
}

export async function clearToken(): Promise<void> {
    const store = await cookies()
    store.delete(SESSION_COOKIE)
}
