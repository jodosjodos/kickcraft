import apiClient from "@/lib/api/client";
import type { DashboardAnalytics } from "@/types/api/analytics";

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const res = await apiClient.get<DashboardAnalytics>("/analytics/dashboard");
  return res.data;
}
