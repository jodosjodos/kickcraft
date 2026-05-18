"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  UsersListResponse,
  AdminUserDetail,
  UserFilters,
  UserStatus,
} from "@/types/api/users";
import type { ApiError } from "@/types/api/common";

export function useAdminUsers(filters: UserFilters) {
  return useQuery<UsersListResponse, ApiError>({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => usersService.getUsers(filters),
    staleTime: 30_000,
  });
}

export function useAdminUser(id: string, enabled = true) {
  return useQuery<AdminUserDetail, ApiError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled,
    staleTime: 60_000,
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: string; status: UserStatus }>({
    mutationFn: ({ id, status }) => usersService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all });
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useUpdateUserNotes() {
  const qc = useQueryClient();
  return useMutation<void, ApiError, { id: string; notes: string }>({
    mutationFn: ({ id, notes }) => usersService.updateNotes(id, notes),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}
