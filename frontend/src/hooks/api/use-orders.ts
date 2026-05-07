import { useQuery } from "@tanstack/react-query";
import * as ordersService from "@/services/orders.service";
import { queryKeys } from "@/lib/query-keys";
import type { Order } from "@/types/api/orders";
import type { ApiError } from "@/types/api/common";

export function useMyOrders() {
  return useQuery<Order[], ApiError>({
    queryKey: queryKeys.orders.mine(),
    queryFn: ordersService.getMyOrders,
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery<Order, ApiError>({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
