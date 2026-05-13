export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  active: boolean;
  notes: string | null;
  createdAt: string;
}

export interface CreateAgentRequest {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface UpdateAgentRequest {
  name?: string;
  phone?: string;
  email?: string;
  active?: boolean;
  notes?: string;
}
