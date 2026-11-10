"use server";

import { apiClient } from "@/lib/api/client";
import { Order } from "@/lib/api/dtos";

export async function acceptOrder(id: number) {
    return apiClient.post<Order>(`/order/${id}/accept`, {});
}
