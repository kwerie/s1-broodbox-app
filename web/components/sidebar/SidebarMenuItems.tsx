"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavItem } from "@/config/navigation";

export function SidebarMenuItems({ items }: { items: NavItem[] }) {
    const pathname = usePathname();

    const menuItems = useMemo(() => {
        return items.map((item) => {
            const isActive = pathname === item.href;
            return (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton render={<a href={item.href} className={isActive ? 'font-bold' : undefined}>{item.label}</a>} />
                </SidebarMenuItem>
            );
        }
        );
    }, [items, pathname]);

    return menuItems;
}
