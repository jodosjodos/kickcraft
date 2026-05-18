"use client";

import { useQuery } from "@tanstack/react-query";
import * as analyticsService from "@/services/analytics.service";
import { queryKeys } from "@/lib/query-keys";
import type { DashboardAnalytics } from "@/types/api/analytics";
import type { ApiError } from "@/types/api/common";

export function useDashboardAnalytics() {
  return useQuery<DashboardAnalytics, ApiError>({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: analyticsService.getDashboardAnalytics,
    staleTime: 60_000,
  });
}
