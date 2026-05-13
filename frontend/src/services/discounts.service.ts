import apiClient from "@/lib/api/client";
import type {
  Discount,
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ApplyDiscountResponse,
} from "@/types/api/discounts";

export async function getDiscounts(): Promise<Discount[]> {
  const res = await apiClient.get<Discount[]>("/discounts");
  return res.data;
}

export async function createDiscount(data: CreateDiscountRequest): Promise<Discount> {
  const res = await apiClient.post<Discount>("/discounts", data);
  return res.data;
}

export async function updateDiscount(
  id: string,
  data: UpdateDiscountRequest,
): Promise<Discount> {
  const res = await apiClient.patch<Discount>(`/discounts/${id}`, data);
  return res.data;
}

export async function applyDiscount(
  code: string,
  orderTotal: number,
): Promise<ApplyDiscountResponse> {
  const res = await apiClient.post<ApplyDiscountResponse>("/discounts/apply", {
    code,
    orderTotal,
  });
  return res.data;
}
