import { redirect } from "next/navigation"
import { clearToken, getToken } from "@/lib/auth/session"
import { getApiUrl } from "./config"

export class ApiError extends Error {
    constructor(readonly status: number) {
        super(`API request failed with status ${status}`)
        this.name = "ApiError"
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken()
    const response = await fetch(`${getApiUrl()}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init?.headers,
        },
    })

    if (response.status === 401) {
        await clearToken()
        redirect("/login")
    }
    if (!response.ok) {
        throw new ApiError(response.status)
    }

    return (await response.json()) as T
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path, { method: "GET" }),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body) }),
}
