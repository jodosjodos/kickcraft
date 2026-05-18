import apiClient from "@/lib/api/client";
import type { Notification, UnreadCountResponse } from "@/types/api/notifications";

export async function getNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<Notification[]>("/notifications");
  return res.data;
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const res = await apiClient.get<UnreadCountResponse>("/notifications/unread-count");
  return res.data;
}

export async function markRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}
