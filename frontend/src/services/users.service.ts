import apiClient from "@/lib/api/client";
import type {
  UsersListResponse,
  AdminUserDetail,
  UserFilters,
  UserStatus,
} from "@/types/api/users";

export const usersService = {
  getUsers: async (filters: UserFilters): Promise<UsersListResponse> => {
    const res = await apiClient.get<UsersListResponse>("/users", {
      params: filters,
    });
    return res.data;
  },

  getUserById: async (id: string): Promise<AdminUserDetail> => {
    const res = await apiClient.get<AdminUserDetail>(`/users/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, status: UserStatus): Promise<void> => {
    await apiClient.patch(`/users/${id}/status`, { status });
  },

  updateNotes: async (id: string, notes: string): Promise<void> => {
    await apiClient.patch(`/users/${id}/notes`, { notes });
  },
};
