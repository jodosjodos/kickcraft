import { IsObject } from 'class-validator';
import type { NotificationPrefsMap } from '../notification-prefs.entity';

export class UpdateNotificationPrefsDto {
  @IsObject()
  prefs!: NotificationPrefsMap;
}
