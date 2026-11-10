import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderNotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <PackageX className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">Bestelling niet gevonden</h1>
                <p className="text-muted-foreground">
                    Deze bestelling bestaat niet of je hebt er geen toegang toe.
                </p>
            </div>
            <Link href="/">
                <Button variant="outline">Terug naar home</Button>
            </Link>
        </div>
    );
}
