import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export interface NotifPref {
  email: boolean;
  inApp: boolean;
}

export type NotificationPrefsMap = Record<string, NotifPref>;

const DEFAULT_PREFS: NotificationPrefsMap = {
  new_order: { email: true, inApp: true },
  low_stock: { email: true, inApp: true },
  new_review: { email: false, inApp: true },
  new_customer: { email: false, inApp: true },
  failed_payment: { email: true, inApp: true },
  return_request: { email: true, inApp: true },
};

export { DEFAULT_PREFS };

@Entity('notification_prefs')
export class NotificationPrefs extends BaseEntity {
  @Index({ unique: true })
  @Column()
  adminId!: string;

  @Column({ type: 'jsonb', default: () => `'${JSON.stringify(DEFAULT_PREFS)}'` })
  prefs!: NotificationPrefsMap;
}
