"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ordersService from "@/services/orders.service";
import { queryKeys } from "@/lib/query-keys";
import type { CreateOrderRequest, Order, OrderFilters } from "@/types/api/orders";
import type { PaginatedResponse } from "@/types/api/common";
import type { ApiError } from "@/types/api/common";

export function useMyOrders() {
  return useQuery<Order[], ApiError>({
    queryKey: queryKeys.orders.mine(),
    queryFn: ordersService.getMyOrders,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyOrder(id: string) {
  return useQuery<Order, ApiError>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getMyOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrderByToken(token: string) {
  return useQuery<Order, ApiError>({
    queryKey: queryKeys.orders.byToken(token),
    queryFn: () => ordersService.getOrderByToken(token),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

export function useAllOrders(filters: OrderFilters = {}) {
  return useQuery<PaginatedResponse<Order>, ApiError>({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => ordersService.getAllOrders(filters),
    staleTime: 30 * 1000,
  });
}

export function useAdminOrder(id: string) {
  return useQuery<Order, ApiError>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateOrder() {
  return useMutation<Order, ApiError, CreateOrderRequest>({
    mutationFn: ordersService.createOrder,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<
    Order,
    ApiError,
    { id: string; status: string; cancelReason?: string }
  >({
    mutationFn: ({ id, status, cancelReason }) =>
      ordersService.updateOrderStatus(id, status, cancelReason),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.orders.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useUpdatePaymentPhase() {
  const qc = useQueryClient();
  return useMutation<Order, ApiError, { id: string; paymentPhase: string }>({
    mutationFn: ({ id, paymentPhase }) =>
      ordersService.updatePaymentPhase(id, paymentPhase),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.orders.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
