import type { UserRole } from "./auth";

export type UserStatus = "active" | "banned";

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  adminNotes: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface AdminUserOrder {
  id: string;
  orderToken: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  orders: AdminUserOrder[];
}

export interface AdminUserSummary {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  avgLTV: number;
}

export interface UsersListResponse {
  data: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  summary: AdminUserSummary;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | UserStatus;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}
