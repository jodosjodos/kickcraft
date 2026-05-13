"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as deliveriesService from "@/services/deliveries.service";
import { queryKeys } from "@/lib/query-keys";
import type {
  DeliveryAgent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@/types/api/deliveries";
import type { ApiError } from "@/types/api/common";

export function useDeliveryAgents() {
  return useQuery<DeliveryAgent[], ApiError>({
    queryKey: queryKeys.agents.all,
    queryFn: deliveriesService.getAgents,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation<DeliveryAgent, ApiError, CreateAgentRequest>({
    mutationFn: deliveriesService.createAgent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation<DeliveryAgent, ApiError, { id: string; data: UpdateAgentRequest }>({
    mutationFn: ({ id, data }) => deliveriesService.updateAgent(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
    },
  });
}

export function useAssignAgent() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, { orderId: string; agentId: string }>({
    mutationFn: ({ orderId, agentId }) =>
      deliveriesService.assignAgent(orderId, agentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agents.all });
    },
  });
}
