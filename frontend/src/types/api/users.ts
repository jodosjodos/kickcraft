import type { UserRole } from "./auth";

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

export interface AdminUser extends UserProfile {
  orderCount: number;
}
