import { User } from "lucide-react"
import type { AuthUser } from "@/lib/auth/user"

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
}

export function SidebarUser({ user }: { user: AuthUser }) {
    return (
        <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {user.name ? initials(user.name) : <User className="h-5 w-5" />}
            </div>
            <div>
                {user.name && <p className="text-sm font-medium">{user.name}</p>}
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
        </div>
    )
}
