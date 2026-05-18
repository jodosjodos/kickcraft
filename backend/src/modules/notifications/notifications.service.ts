import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationEventType } from './notification.entity';
import { User, UserRole } from '../users/user.entity';
import { SettingsService } from '../settings/settings.service';
import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createForAllAdmins(
    type: NotificationEventType,
    message: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const admins = await this.userRepo.find({
      where: { role: UserRole.Admin },
    });

    await Promise.all(
      admins.map(async (admin) => {
        const prefsRecord = await this.settingsService.getNotificationPrefs(
          admin.id,
        );
        const pref = prefsRecord.prefs[type];

        if (pref?.inApp) {
          const notif = await this.notifRepo.save(
            this.notifRepo.create({
              adminId: admin.id,
              type,
              message,
              metadata,
            }),
          );
          this.gateway.emitToAdmin(admin.id, notif);
        }

        if (pref?.email) {
          void this.mailService.sendAdminNotification(
            admin.email,
            type,
            message,
            metadata,
          );
        }
      }),
    );
  }

  async getForAdmin(adminId: string): Promise<Notification[]> {
    return this.notifRepo.find({
      where: { adminId },
      order: { createdAt: 'DESC' },
      take: 30,
    });
  }

  async getUnreadCount(adminId: string): Promise<number> {
    return this.notifRepo.count({ where: { adminId, isRead: false } });
  }

  async markRead(adminId: string, notifId: string): Promise<void> {
    await this.notifRepo.update({ id: notifId, adminId }, { isRead: true });
  }

  async markAllRead(adminId: string): Promise<void> {
    await this.notifRepo.update({ adminId }, { isRead: true });
  }
}
