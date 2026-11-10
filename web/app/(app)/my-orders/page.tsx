import { requireRole } from "@/lib/auth/guard";
import { getOrders } from "@/features/orders/getOrders";
import { OrdersTable } from "@/features/orders/OrdersTable";
import { Card, CardContent } from "@/components/ui/card";

export const instant = false;

export default async function MyOrdersPage() {
    await requireRole("customer");
    const orders = await getOrders();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Mijn bestellingen</h1>
                <p className="text-muted-foreground">Een overzicht van al je bestellingen.</p>
            </div>
            <Card>
                <CardContent className="px-0">
                    <OrdersTable orders={orders} />
                </CardContent>
            </Card>
        </div>
    );
}
