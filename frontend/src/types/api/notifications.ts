export type NotificationType =
  | 'new_order'
  | 'low_stock'
  | 'new_review'
  | 'new_customer'
  | 'failed_payment'
  | 'return_request';

export interface Notification {
  id: string;
  adminId: string;
  type: NotificationType;
  message: string;
  metadata: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCountResponse {
  count: number;
}
