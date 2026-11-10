import type { Role } from "@/lib/auth/role";

export type NavItem = {
    label: string;
    href: string;
    visibleTo: Role[];
};

export const NAV_ITEMS: NavItem[] = [
    {
        label: "Home",
        href: "/",
        visibleTo: ["customer", "customer-service"],
    },
    { label: "Mijn bestellingen", href: "/orders", visibleTo: ["customer"] },
    {
        label: "Bestellingen",
        href: "/orders",
        visibleTo: ["customer-service"],
    },
    {
        label: "Allergieën",
        href: "/allergies",
        visibleTo: ["customer-service"],
    },
    { label: "Klanten", href: "/customers", visibleTo: ["customer-service"] },
    {
        label: "Gerechten",
        href: "/dishes",
        visibleTo: ["customer-service"],
    },
];

export function navItemsForRole(role: Role): NavItem[] {
    return NAV_ITEMS.filter((item) => item.visibleTo.includes(role));
}
