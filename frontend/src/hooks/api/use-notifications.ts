"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsService from "@/services/notifications.service";
import { queryKeys } from "@/lib/query-keys";
import type { Notification, UnreadCountResponse } from "@/types/api/notifications";
import type { ApiError } from "@/types/api/common";

export function useNotifications() {
  return useQuery<Notification[], ApiError>({
    queryKey: queryKeys.notifications.all(),
    queryFn: notificationsService.getNotifications,
    staleTime: 0,
  });
}

export function useUnreadCount() {
  return useQuery<UnreadCountResponse, ApiError>({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: notificationsService.getUnreadCount,
    staleTime: 0,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: notificationsService.markRead,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.all(),
        (prev) => prev?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      queryClient.setQueryData<UnreadCountResponse>(
        queryKeys.notifications.unreadCount(),
        (prev) => ({ count: Math.max(0, (prev?.count ?? 1) - 1) }),
      );
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: notificationsService.markAllRead,
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.all(),
        (prev) => prev?.map((n) => ({ ...n, isRead: true })),
      );
      queryClient.setQueryData<UnreadCountResponse>(
        queryKeys.notifications.unreadCount(),
        { count: 0 },
      );
    },
  });
}
