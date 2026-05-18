import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export type NotificationEventType =
  | 'new_order'
  | 'low_stock'
  | 'new_review'
  | 'new_customer'
  | 'failed_payment'
  | 'return_request';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Index()
  @Column()
  adminId!: string;

  @Column()
  type!: NotificationEventType;

  @Column()
  message!: string;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;

  @Column({ default: false })
  isRead!: boolean;
}
