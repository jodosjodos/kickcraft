"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import * as authService from "@/services/auth.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
} from "@/types/api/auth";
import type { ApiError } from "@/types/api/common";

export function useMe() {
  return useQuery<User, ApiError>({
    queryKey: queryKeys.auth.me(),
    queryFn: authService.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const { setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation<User, ApiError, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (user) => {
      setUser(user);
      const redirect = searchParams.get("redirect");
      if (user.role === "admin") {
        router.push(redirect ?? "/admin/dashboard");
      } else {
        router.push(redirect ?? "/");
      }
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation<User, ApiError, RegisterRequest>({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push("/auth/verify-email");
    },
  });
}

export function useForgotPassword() {
  return useMutation<void, ApiError, ForgotPasswordRequest>({
    mutationFn: authService.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation<void, ApiError, ResetPasswordRequest>({
    mutationFn: authService.resetPassword,
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<User, ApiError, UpdateProfileRequest>({
    mutationFn: authService.updateProfile,
    onSuccess: (user) => {
      setUser(user);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
}

export function useChangePassword() {
  return useMutation<{ message: string }, ApiError, ChangePasswordRequest>({
    mutationFn: authService.changePassword,
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      logout();
      localStorage.removeItem("kickcraft_cart");
      router.push("/");
    },
  });
}
