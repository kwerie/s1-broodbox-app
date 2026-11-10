import { notFound } from "next/navigation";
import { getRole, requireAuth } from "@/lib/auth/guard";
import { getOrder } from "@/features/orders/getOrder";
import { OrderDetail } from "@/features/orders/OrderDetail/OrderDetail";
import { OrderStatus } from "@/lib/api/dtos";

export const instant = false;

export default async function OrderDetailPage({ params }: PageProps<"/order/[id]">) {
    await requireAuth();

    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
        notFound();
    }

    const [order, role] = await Promise.all([getOrder(orderId), getRole()]);

    const canAccept = role === "customer-service" && order.status === OrderStatus.Received;

    return <OrderDetail order={order} canAccept={canAccept} />;
}
