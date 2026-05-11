import apiClient from "@/lib/api/client";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
  VerifyEmailRequest,
} from "@/types/api/auth";

export async function login(data: LoginRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterRequest): Promise<User> {
  const res = await apiClient.post<User>("/auth/register", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<void> {
  await apiClient.post("/auth/forgot-password", data);
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<void> {
  await apiClient.post("/auth/reset-password", data);
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<void> {
  await apiClient.post("/auth/verify-email", data);
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>("/auth/me");
  return res.data;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  const res = await apiClient.patch<User>("/auth/profile", data);
  return res.data;
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    "/auth/change-password",
    data
  );
  return res.data;
}

export async function confirmPasswordChange(data: {
  token: string;
}): Promise<{ message: string }> {
  const res = await apiClient.post<{ message: string }>(
    "/auth/confirm-password-change",
    data
  );
  return res.data;
}
