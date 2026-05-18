"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as settingsService from "@/services/settings.service";
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
import type { ApiError } from "@/types/api/common";

const KEYS = {
  store: ["settings", "store"] as const,
  notifPrefs: ["settings", "notifications"] as const,
  team: ["settings", "team"] as const,
  sessions: ["auth", "sessions"] as const,
};

export function useStoreSettings() {
  return useQuery<StoreSettings, ApiError>({
    queryKey: KEYS.store,
    queryFn: settingsService.getStoreSettings,
    staleTime: 60_000,
  });
}

export function useUpdateStoreSettings() {
  const qc = useQueryClient();
  return useMutation<StoreSettings, ApiError, UpdateStoreSettingsPayload>({
    mutationFn: settingsService.updateStoreSettings,
    onSuccess: (data) => {
      qc.setQueryData(KEYS.store, data);
    },
  });
}

export function useNotificationPrefs() {
  return useQuery<NotificationPrefs, ApiError>({
    queryKey: KEYS.notifPrefs,
    queryFn: settingsService.getNotificationPrefs,
    staleTime: 60_000,
  });
}

export function useUpdateNotificationPrefs() {
  const qc = useQueryClient();
  return useMutation<NotificationPrefs, ApiError, NotificationPrefsMap>({
    mutationFn: settingsService.updateNotificationPrefs,
    onSuccess: (data) => {
      qc.setQueryData(KEYS.notifPrefs, data);
    },
  });
}

export function useTeam() {
  return useQuery<AdminMember[], ApiError>({
    queryKey: KEYS.team,
    queryFn: settingsService.listAdmins,
    staleTime: 30_000,
  });
}

export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation<AdminMember, ApiError, CreateAdminPayload>({
    mutationFn: settingsService.createAdmin,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.team });
    },
  });
}

export function useRemoveAdmin() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: settingsService.removeAdmin,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.team });
    },
  });
}

export function useSessions() {
  return useQuery<Session[], ApiError>({
    queryKey: KEYS.sessions,
    queryFn: settingsService.getSessions,
    staleTime: 30_000,
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: settingsService.revokeSession,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.sessions });
    },
  });
}

export function useSetup2FA() {
  return useMutation<TwoFASetup, ApiError, void>({
    mutationFn: () => settingsService.setup2FA(),
  });
}

export function useEnable2FA() {
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: settingsService.enable2FA,
  });
}

export function useDisable2FA() {
  return useMutation<{ message: string }, ApiError, string>({
    mutationFn: settingsService.disable2FA,
  });
}

export function useChangePasswordDirect() {
  return useMutation<
    { message: string },
    ApiError,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: ({ currentPassword, newPassword }) =>
      settingsService.changePasswordDirect(currentPassword, newPassword),
  });
}
