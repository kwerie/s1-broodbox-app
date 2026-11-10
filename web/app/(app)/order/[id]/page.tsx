import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/guard";
import { getOrder } from "@/features/orders/getOrder";
import { OrderDetail } from "@/features/orders/OrderDetail/OrderDetail";

export const instant = false;

export default async function OrderDetailPage({ params }: PageProps<"/order/[id]">) {
    await requireAuth();

    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
        notFound();
    }

    const order = await getOrder(orderId);

    return <OrderDetail order={order} />;
}
