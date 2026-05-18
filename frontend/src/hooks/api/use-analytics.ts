"use client";

import { useQuery } from "@tanstack/react-query";
import * as analyticsService from "@/services/analytics.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  DashboardAnalytics,
  AnalyticsPeriod,
  RevenueAnalytics,
  OrdersAnalytics,
  CustomersAnalytics,
} from "@/types/api/analytics";
import type { ApiError } from "@/types/api/common";

export function useDashboardAnalytics() {
  return useQuery<DashboardAnalytics, ApiError>({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: analyticsService.getDashboardAnalytics,
    staleTime: 60_000,
  });
}

export function useAnalyticsRevenue(period: AnalyticsPeriod) {
  return useQuery<RevenueAnalytics, ApiError>({
    queryKey: queryKeys.analytics.revenue(period),
    queryFn: () => analyticsService.getRevenueAnalytics(period),
    staleTime: 5 * 60_000,
  });
}

export function useAnalyticsOrders(period: AnalyticsPeriod) {
  return useQuery<OrdersAnalytics, ApiError>({
    queryKey: queryKeys.analytics.orders(period),
    queryFn: () => analyticsService.getOrdersAnalytics(period),
    staleTime: 5 * 60_000,
  });
}

export function useAnalyticsCustomers() {
  return useQuery<CustomersAnalytics, ApiError>({
    queryKey: queryKeys.analytics.customers(),
    queryFn: analyticsService.getCustomersAnalytics,
    staleTime: 5 * 60_000,
  });
}
