"use client";

import { usePathname } from "next/navigation";

function titleFromPathname(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Home";
    const formatted = lastSegment.replace(/-/g, " ");
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function ActivePageTitle() {
    const pathname = usePathname();

    return (
        <span className="font-semibold text-xl leading-[1em]">{titleFromPathname(pathname)}</span>
    );
}
