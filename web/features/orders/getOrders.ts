import { apiClient } from "@/lib/api/client";
import { Order } from "@/lib/api/dtos";

export async function getOrders() {
    return await apiClient.get<Order[]>("/order?limit=0");
}
