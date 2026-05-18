"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as inventoryService from "@/services/inventory.service";
import { queryKeys } from "@/lib/query-keys";
import type { Sku, CreateSkuPayload, UpdateSkuPayload } from "@/types/api/inventory";
import type { ApiError } from "@/types/api/common";

export function useSkus() {
  return useQuery<Sku[], ApiError>({
    queryKey: queryKeys.inventory.all,
    queryFn: inventoryService.getSkus,
    staleTime: 30_000,
  });
}

export function useCreateSku() {
  const queryClient = useQueryClient();
  return useMutation<Sku, ApiError, CreateSkuPayload>({
    mutationFn: inventoryService.createSku,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useUpdateSku() {
  const queryClient = useQueryClient();
  return useMutation<Sku, ApiError, { id: string; payload: UpdateSkuPayload }>({
    mutationFn: ({ id, payload }) => inventoryService.updateSku(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useDeleteSku() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: inventoryService.deleteSku,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}
