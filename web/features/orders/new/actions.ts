"use server";

import { apiClient } from "@/lib/api/client";
import { Address, Order } from "@/lib/api/dtos";

export type RecipientInput = {
    name: string;
    lockerNumber: string;
    allergyIds: number[];
    preferences: string[];
};

export type AddressInput = {
    street: string;
    houseNumber: number;
    addition: string | null;
    postalCode: string;
    city: string;
};

export function saveDishes(draftId: number, dishes: { dishId: number; quantity: number }[]) {
    return apiClient.patch<Order>(`/order/${draftId}`, { dishes });
}

export function saveRecipients(draftId: number, recipients: RecipientInput[]) {
    return apiClient.patch<Order>(`/order/${draftId}`, { recipients });
}

export function saveAddresses(
    draftId: number,
    addresses: { invoiceAddressId: number | null; deliveryAddressId: number | null },
) {
    return apiClient.patch<Order>(`/order/${draftId}`, addresses);
}

export function confirmOrder(draftId: number) {
    return apiClient.patch<Order>(`/order/${draftId}`, { status: "Received" });
}

export async function createAddress(input: AddressInput): Promise<Address[]> {
    await apiClient.post<Address>("/addresses", input);
    return apiClient.get<Address[]>("/addresses");
}

export async function updateAddress(id: number, input: AddressInput): Promise<Address[]> {
    await apiClient.put<Address>(`/addresses/${id}`, input);
    return apiClient.get<Address[]>("/addresses");
}

export async function deleteAddress(id: number): Promise<Address[]> {
    await apiClient.del(`/addresses/${id}`);
    return apiClient.get<Address[]>("/addresses");
}

export async function setDefaultAddress(
    id: number,
    kind: { invoice?: boolean; shipping?: boolean },
): Promise<Address[]> {
    await apiClient.patch<Address>(`/addresses/${id}/default`, kind);
    return apiClient.get<Address[]>("/addresses");
}
