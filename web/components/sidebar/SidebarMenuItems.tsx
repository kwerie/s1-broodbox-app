"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavItem } from "@/config/navigation";

import {
    HomeIcon,
    UserIcon,
    ShoppingCartIcon,
    ForkKnifeIcon,
    NutIcon,
} from "lucide-react";


const iconMap: Record<string, ReactNode> = {
    "/": <HomeIcon className="h-4 w-4" />,
    "/customers": <UserIcon className="h-4 w-4" />,
    "/order": <ShoppingCartIcon className="h-4 w-4" />,
    "/orders": <ShoppingCartIcon className="h-4 w-4" />,
    "/my-orders": <ShoppingCartIcon className="h-4 w-4" />,
    "/dishes": <ForkKnifeIcon className="h-4 w-4" />,
    "/allergies": <NutIcon className="h-4 w-4" />,
};

function MenuItemWithIcon({ isActive, item }: { isActive: boolean, item: NavItem }) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton render={<a href={item.href} className={
                `flex items-center gap-2 ${isActive ? "font-bold text-primary" : "text-foreground"}`
            }>{iconMap[item.href]} {item.label}</a>} />
        </SidebarMenuItem>
    );
}

export function SidebarMenuItems({ items }: { items: NavItem[] }) {
    const pathname = usePathname();

    return items.map((item) => (
        <MenuItemWithIcon
            key={item.href}
            isActive={pathname === item.href}
            item={item}
        />
    ));
}
