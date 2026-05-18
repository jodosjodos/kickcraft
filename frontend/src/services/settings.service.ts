import apiClient from "@/lib/api/client";
import type {
  StoreSettings,
  UpdateStoreSettingsPayload,
  NotificationPrefs,
  NotificationPrefsMap,
  AdminMember,
  CreateAdminPayload,
  Session,
  TwoFASetup,
} from "@/types/api/settings";

export async function getStoreSettings(): Promise<StoreSettings> {
  const res = await apiClient.get<StoreSettings>("/settings");
  return res.data;
}

export async function updateStoreSettings(
  payload: UpdateStoreSettingsPayload,
): Promise<StoreSettings> {
  const res = await apiClient.patch<StoreSettings>("/settings", payload);
  return res.data;
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const res = await apiClient.get<NotificationPrefs>("/settings/notifications");
  return res.data;
}

export async function updateNotificationPrefs(
  prefs: NotificationPrefsMap,
): Promise<NotificationPrefs> {
  const res = await apiClient.patch<NotificationPrefs>("/settings/notifications", { prefs });
  return res.data;
}

export async function listAdmins(): Promise<AdminMember[]> {
  const res = await apiClient.get<AdminMember[]>("/settings/team");
  return res.data;
}

export async function createAdmin(payload: CreateAdminPayload): Promise<AdminMember> {
  const res = await apiClient.post<AdminMember>("/settings/team", payload);
  return res.data;
}

export async function removeAdmin(id: string): Promise<void> {
  await apiClient.delete(`/settings/team/${id}`);
}

export async function getSessions(): Promise<Session[]> {
  const res = await apiClient.get<Session[]>("/auth/sessions");
  return res.data;
}

export async function revokeSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/auth/sessions/${sessionId}`);
}

export async function setup2FA(): Promise<TwoFASetup> {
  const res = await apiClient.get<TwoFASetup>("/auth/2fa/setup");
  return res.data;
}

export async function enable2FA(token: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>("/auth/2fa/enable", { token });
  return res.data;
}

export async function disable2FA(token: string): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>("/auth/2fa/disable", { token });
  return res.data;
}

export async function changePasswordDirect(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>("/auth/change-password-direct", {
    currentPassword,
    newPassword,
  });
  return res.data;
}
