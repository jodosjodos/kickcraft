import apiClient from "@/lib/api/client";
import type { Sku, CreateSkuPayload, UpdateSkuPayload } from "@/types/api/inventory";

export async function getSkus(): Promise<Sku[]> {
  const res = await apiClient.get<Sku[]>("/inventory");
  return res.data;
}

export async function getSku(id: string): Promise<Sku> {
  const res = await apiClient.get<Sku>(`/inventory/${id}`);
  return res.data;
}

export async function createSku(payload: CreateSkuPayload): Promise<Sku> {
  const res = await apiClient.post<Sku>("/inventory", payload);
  return res.data;
}

export async function updateSku(id: string, payload: UpdateSkuPayload): Promise<Sku> {
  const res = await apiClient.patch<Sku>(`/inventory/${id}`, payload);
  return res.data;
}

export async function deleteSku(id: string): Promise<void> {
  await apiClient.delete(`/inventory/${id}`);
}
