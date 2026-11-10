import { apiClient } from "@/lib/api/client";
import { Address, Allergy, Dish, Order } from "@/lib/api/dtos";

export const getDishes = () => apiClient.get<Dish[]>("/dishes");
export const getAllergies = () => apiClient.get<Allergy[]>("/allergies");
export const getAddresses = () => apiClient.get<Address[]>("/addresses");
export const getOrCreateDraft = () => apiClient.post<Order>("/order", {});
