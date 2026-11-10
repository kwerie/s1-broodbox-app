import { apiClient } from "@/lib/api/client";
import { Order } from "@/lib/api/dtos";

export async function getOpenOrders(limit: number = 5) {
    return await apiClient.get<Order[]>(`/order?limit=${limit}`);
}
