"use server";

import { getApiUrl } from "@/lib/api/config";
import { setToken } from "@/lib/auth/session";
import { loginSchema, type LoginInput } from "./schema";

export type LoginResult =
    | { ok: true }
    | { ok: false; reason: "invalid_credentials" | "validation" | "network" };

export async function loginAction(input: LoginInput): Promise<LoginResult> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, reason: "validation" };
    }

    let response: Response;
    try {
        response = await fetch(`${getApiUrl()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
        });
    } catch {
        return { ok: false, reason: "network" };
    }

    if (response.status === 401) {
        return { ok: false, reason: "invalid_credentials" };
    }
    if (!response.ok) {
        return { ok: false, reason: "network" };
    }

    const data = (await response.json()) as { token: string };
    await setToken(data.token);
    return { ok: true };
}
