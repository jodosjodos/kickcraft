"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Notification, UnreadCountResponse } from "@/types/api/notifications";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const socket = io(`${apiUrl}/notifications`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("notification", (notif: Notification) => {
      queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.all(),
        (prev) => (prev ? [notif, ...prev] : [notif]),
      );
      queryClient.setQueryData<UnreadCountResponse>(
        queryKeys.notifications.unreadCount(),
        (prev) => ({ count: (prev?.count ?? 0) + 1 }),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
}
