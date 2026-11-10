import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/guard";
import { OpenOrders } from "@/features/orders/OpenOrders/OpenOrders";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function CustomerHome() {
    const user = await getCurrentUser();
    const firstName = user?.name?.split(" ")[0] || "";
    const greeting = firstName ? `Welkom, ${firstName}!` : "Welkom!";

    return (
        <div className="flex flex-col flex-1 gap-6">
            <div>
                <h1 className="text-2xl font-bold">{greeting}</h1>
                <p className="text-muted-foreground">Plaats een nieuwe bestelling of bekijk je recente bestellingen.</p>
            </div>
            <Card>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            Nieuwe bestelling plaatsen
                        </CardTitle>
                        <p className="text-muted-foreground">Stel je bestelling samen en kies je gerechten.</p>
                    </div>
                    <Link href="/order/new">
                        <Button size="xl">+ Bestelling plaatsen</Button>
                    </Link>
                </CardContent>
            </Card>
            <OpenOrders />
        </div>
    );
}
