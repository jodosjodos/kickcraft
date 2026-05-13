import apiClient from "@/lib/api/client";
import type {
  DeliveryAgent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@/types/api/deliveries";

export async function getAgents(): Promise<DeliveryAgent[]> {
  const res = await apiClient.get<DeliveryAgent[]>("/delivery-agents");
  return res.data;
}

export async function createAgent(data: CreateAgentRequest): Promise<DeliveryAgent> {
  const res = await apiClient.post<DeliveryAgent>("/delivery-agents", data);
  return res.data;
}

export async function updateAgent(
  id: string,
  data: UpdateAgentRequest,
): Promise<DeliveryAgent> {
  const res = await apiClient.patch<DeliveryAgent>(`/delivery-agents/${id}`, data);
  return res.data;
}

export async function assignAgent(
  orderId: string,
  agentId: string,
): Promise<void> {
  await apiClient.patch(`/orders/${orderId}/agent`, { agentId });
}
