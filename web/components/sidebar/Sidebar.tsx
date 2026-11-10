import {
    Sidebar as SidebarRoot,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getCurrentUser, getRole } from "@/lib/auth/guard"
import { logoutAction } from "@/features/auth/actions"
import { navItemsForRole } from "@/config/navigation"
import { SidebarMenuItems } from "./SidebarMenuItems"
import { SidebarUser } from "./SidebarUser"

import { LogOutIcon } from "lucide-react"

export async function Sidebar() {
    const role = await getRole()
    const user = await getCurrentUser()
    const items = role ? navItemsForRole(role) : []

    return (
        <SidebarRoot>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItems items={items} />
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {user && <SidebarUser user={user} />}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <form action={logoutAction}>
                            <SidebarMenuButton type="submit" className="w-full flex items-center gap-2">
                                <LogOutIcon className="h-4 w-4" />
                                Uitloggen
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </SidebarRoot >
    )
}
