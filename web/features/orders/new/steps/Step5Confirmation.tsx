"use client";

import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateOrderTotal, currency } from "@/features/orders/orderPresentation";
import { useWizard } from "../WizardContext";
import { AddressLines } from "../AddressLines";

export function Step5Confirmation() {
    const { state } = useWizard();
    const order = state.confirmedOrder;

    if (!order) {
        return null;
    }

    const dishCount = order.dishes.reduce((total, dish) => total + dish.quantity, 0);
    const total = calculateOrderTotal(order);

    return (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <CircleCheck className="h-6 w-6 text-green-600" />
            </div>

            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Bedankt!</h1>
                <p className="text-muted-foreground">
                    We hebben je bestelling in goede orde ontvangen, we gaan er zo snel mogelijk mee aan de slag.
                </p>
            </div>

            <p className="text-sm font-medium">Bestelnummer #{order.orderNumber}</p>

            <Card className="w-full text-left">
                <CardContent className="flex flex-col gap-3">
                    <p className="text-sm font-medium">Je bestelling in het kort</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aantal gerechten</span>
                        <span className="tabular-nums">{dishCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Aantal ontvangers</span>
                        <span className="tabular-nums">{order.recipients.length}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-medium">
                        <span>Totaal</span>
                        <span className="tabular-nums">{currency.format(total)}</span>
                    </div>
                </CardContent>
            </Card>

            {order.deliveryAddress && (
                <Card className="w-full text-left">
                    <CardContent className="flex flex-col gap-2">
                        <p className="text-sm font-medium">We bezorgen het hier</p>
                        <AddressLines address={order.deliveryAddress} companyName={order.companyName} />
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-3">
                <Link href="/">
                    <Button variant="outline">Naar home</Button>
                </Link>
                <Link href={`/order/${order.id}`}>
                    <Button>Besteloverzicht bekijken</Button>
                </Link>
            </div>
        </div>
    );
}
