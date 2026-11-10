import { notFound } from "next/navigation";
import { ApiError, apiClient } from "@/lib/api/client";
import { Order } from "@/lib/api/dtos";

export async function getOrder(id: number) {
    try {
        return await apiClient.get<Order>(`/order/${id}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            notFound();
        }
        throw error;
    }
}
