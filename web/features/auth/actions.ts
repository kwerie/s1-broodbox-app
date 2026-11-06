"use server"

import { redirect } from "next/navigation"
import { getApiUrl } from "@/lib/api/config"
import { clearToken, getToken } from "@/lib/auth/session"

export async function logoutAction(): Promise<void> {
    const token = await getToken()
    if (token) {
        try {
            await fetch(`${getApiUrl()}/logout`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            })
        } catch {
            // best-effort; the local session is cleared regardless
        }
    }

    await clearToken()
    redirect("/login")
}
