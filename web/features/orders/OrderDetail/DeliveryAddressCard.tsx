import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/lib/api/dtos";

export function DeliveryAddressCard({ order }: { order: Order }) {
    const address = order.deliveryAddress;
    const houseNumber = address.addition
        ? `${address.houseNumber} ${address.addition}`
        : `${address.houseNumber}`;

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Bezorgadres
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                <p className="font-medium">{order.companyName}</p>
                <p className="text-muted-foreground">
                    {address.street} {houseNumber}
                </p>
                <p className="text-muted-foreground">
                    {address.postalCode} {address.city}
                </p>
                <p className="text-muted-foreground">Nederland</p>
            </CardContent>
        </Card>
    );
}
