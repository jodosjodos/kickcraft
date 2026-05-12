import apiClient from "@/lib/api/client";
import type {
  CreateOrderRequest,
  Order,
  OrderFilters,
} from "@/types/api/orders";
import type { PaginatedResponse } from "@/types/api/common";

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  const res = await apiClient.post<Order>("/orders", data);
  return res.data;
}

export async function getMyOrders(): Promise<Order[]> {
  const res = await apiClient.get<Order[]>("/orders/mine");
  return res.data;
}

export async function getMyOrderById(id: string): Promise<Order> {
  const res = await apiClient.get<Order>(`/orders/mine/${id}`);
  return res.data;
}

export async function getOrderByToken(token: string): Promise<Order> {
  const res = await apiClient.get<Order>(`/orders/token/${token}`);
  return res.data;
}

export async function getAllOrders(
  filters: OrderFilters = {}
): Promise<PaginatedResponse<Order>> {
  const res = await apiClient.get<PaginatedResponse<Order>>("/orders", {
    params: filters,
  });
  return res.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const res = await apiClient.get<Order>(`/orders/${id}`);
  return res.data;
}

export async function updateOrderStatus(
  id: string,
  status: string,
  cancelReason?: string
): Promise<Order> {
  const res = await apiClient.patch<Order>(`/orders/${id}/status`, {
    status,
    cancelReason,
  });
  return res.data;
}

export async function updatePaymentPhase(
  id: string,
  paymentPhase: string
): Promise<Order> {
  const res = await apiClient.patch<Order>(`/orders/${id}/payment`, {
    paymentPhase,
  });
  return res.data;
}
