import apiClient from "@/lib/api/client";
import type {
  DashboardAnalytics,
  AnalyticsPeriod,
  RevenueAnalytics,
  OrdersAnalytics,
  CustomersAnalytics,
} from "@/types/api/analytics";

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const res = await apiClient.get<DashboardAnalytics>("/analytics/dashboard");
  return res.data;
}

export async function getRevenueAnalytics(period: AnalyticsPeriod): Promise<RevenueAnalytics> {
  const res = await apiClient.get<RevenueAnalytics>("/analytics/revenue", { params: { period } });
  return res.data;
}

export async function getOrdersAnalytics(period: AnalyticsPeriod): Promise<OrdersAnalytics> {
  const res = await apiClient.get<OrdersAnalytics>("/analytics/orders", { params: { period } });
  return res.data;
}

export async function getCustomersAnalytics(): Promise<CustomersAnalytics> {
  const res = await apiClient.get<CustomersAnalytics>("/analytics/customers");
  return res.data;
}
