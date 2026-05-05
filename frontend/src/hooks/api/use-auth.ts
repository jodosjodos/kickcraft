"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import * as authService from "@/services/auth.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
} from "@/types/api/auth";
import type { User } from "@/types/api/auth";
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
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation<User, ApiError, RegisterRequest>({
    mutationFn: authService.register,
    onSuccess: (user) => {
      setUser(user);
      router.push("/");
    },
  });
}

export function useForgotPassword() {
  return useMutation<void, ApiError, ForgotPasswordRequest>({
    mutationFn: authService.forgotPassword,
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  return useMutation<void, ApiError, void>({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      router.push("/");
    },
  });
}
