"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as discountsService from "@/services/discounts.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  Discount,
  CreateDiscountRequest,
  UpdateDiscountRequest,
  ApplyDiscountResponse,
} from "@/types/api/discounts";
import type { ApiError } from "@/types/api/common";

export function useDiscounts() {
  return useQuery<Discount[], ApiError>({
    queryKey: queryKeys.discounts.all,
    queryFn: discountsService.getDiscounts,
  });
}

export function useCreateDiscount() {
  const queryClient = useQueryClient();
  return useMutation<Discount, ApiError, CreateDiscountRequest>({
    mutationFn: discountsService.createDiscount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();
  return useMutation<Discount, ApiError, { id: string; data: UpdateDiscountRequest }>({
    mutationFn: ({ id, data }) => discountsService.updateDiscount(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.discounts.all });
    },
  });
}

export function useApplyDiscount() {
  return useMutation<
    ApplyDiscountResponse,
    ApiError,
    { code: string; orderTotal: number }
  >({
    mutationFn: ({ code, orderTotal }) =>
      discountsService.applyDiscount(code, orderTotal),
  });
}
