import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Order } from "@/lib/api/dtos";
import { OrderStatusLabel, formatOrdeDate } from "../orderPresentation";
import { OrderDishesCard } from "./OrderDishesCard";
import { OrderRecipientsCard } from "./OrderRecipientsCard";
import { DeliveryAddressCard } from "./DeliveryAddressCard";

export function OrderDetail({ order }: { order: Order }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Terug
                </Link>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Bestelling #{order.orderNumber}</h1>
                        <OrderStatusLabel status={order.status} />
                    </div>
                    <p className="text-muted-foreground">
                        Geplaatst op {formatOrdeDate(order.orderedAt)} door {order.customerName}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <OrderDishesCard order={order} />
                </div>
                <div className="flex flex-col gap-6">
                    <OrderRecipientsCard order={order} />
                    <DeliveryAddressCard order={order} />
                </div>
            </div>
        </div>
    );
}
