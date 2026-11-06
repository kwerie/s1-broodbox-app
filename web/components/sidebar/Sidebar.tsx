import {
    Sidebar as SidebarRoot,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getRole } from "@/lib/auth/guard"
import { logoutAction } from "@/features/auth/actions"
import { navItemsForRole } from "@/config/navigation"
import { SidebarMenuItems } from "./SidebarMenuItems"

export async function Sidebar() {
    const role = await getRole()
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <form action={logoutAction}>
                            <SidebarMenuButton type="submit" className="w-full">
                                Uitloggen
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </SidebarRoot>
    )
}
