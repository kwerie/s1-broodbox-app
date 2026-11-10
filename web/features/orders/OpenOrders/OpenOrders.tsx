import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOpenOrders } from "../getOpenOrders";
import { OrdersTable } from "../OrdersTable";

export async function OpenOrders() {
    const orders = await getOpenOrders(5);

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Recente bestellingen</CardTitle>
                <p className="text-gray-500">Je laatste 5 bestellingen</p>
            </CardHeader>
            <CardContent>
                <OrdersTable orders={orders} />
            </CardContent>
        </Card>
    );
}
