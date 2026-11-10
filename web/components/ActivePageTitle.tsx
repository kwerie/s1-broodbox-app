"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ActivePageTitle() {
    const pathname = usePathname();
    const [title, setTitle] = useState("");

    useEffect(() => {
        const pathSegments = pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1] || "Home";
        const formattedTitle = lastSegment.replace(/-/g, " ");
        setTitle(formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1));
    }, [pathname]);

    return (
        <span className="font-semibold text-xl leading-[1em]">{title}</span>
    );
}
