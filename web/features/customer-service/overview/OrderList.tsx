import Link from "next/link";
import { BellIcon } from "lucide-react";
import { Order } from "@/lib/api/dtos";
import { Button } from "@/components/ui/button";
import {
    OrderStatusLabel,
    calculateOrderTotal,
    currency,
    formatOrderContents,
} from "@/features/orders/orderPresentation";

function OrderListItem({ order }: { order: Order }) {
    const total = calculateOrderTotal(order);
    const meta = formatOrderContents(order);

    return (
        <li className="flex items-center gap-4 py-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <OrderStatusLabel status={order.status} />
                </div>
                <p className="text-[13px] text-muted-foreground">{meta}</p>
                {order.note && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">
                        <BellIcon className="h-3 w-3" />
                        {order.note}
                    </span>
                )}
            </div>
            <span className="text-sm font-medium tabular-nums">{currency.format(total)}</span>
            <Link href={`/order/${order.id}`}>
                <Button variant="outline">
                    Bekijken
                </Button>
            </Link>
        </li>
    );
}

export function OrderList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return <p className="py-3.5 text-sm text-muted-foreground">Geen bestellingen.</p>;
    }

    return (
        <ul className="divide-y">
            {orders.map((order) => (
                <OrderListItem key={order.id} order={order} />
            ))}
        </ul>
    );
}
