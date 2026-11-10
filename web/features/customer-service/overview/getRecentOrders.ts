import { apiClient } from "@/lib/api/client";
import { Order } from "@/lib/api/dtos";

// TODO: limit this to 10
export function getRecentOrders() {
    return apiClient.get<Order[]>("/order");
}
