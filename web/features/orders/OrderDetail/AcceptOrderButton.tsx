"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptOrder } from "../orderActions";

export function AcceptOrderButton({ orderId }: { orderId: number }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    function accept() {
        startTransition(async () => {
            await acceptOrder(orderId);
            router.refresh();
        });
    }

    return (
        <Button onClick={accept} disabled={pending}>
            <Check /> Accepteren
        </Button>
    );
}
