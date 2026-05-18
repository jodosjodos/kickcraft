import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StoreSettings } from './store-settings.entity';
import { NotificationPrefs, DEFAULT_PREFS } from './notification-prefs.entity';
import { User, UserRole, UserStatus } from '../users/user.entity';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { UpdateNotificationPrefsDto } from './dto/update-notification-prefs.dto';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(StoreSettings)
    private readonly storeRepo: Repository<StoreSettings>,
    @InjectRepository(NotificationPrefs)
    private readonly prefsRepo: Repository<NotificationPrefs>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getStoreSettings(): Promise<StoreSettings> {
    let settings = await this.storeRepo.findOne({ where: { key: 'store' } });
    if (!settings) {
      settings = await this.storeRepo.save(
        this.storeRepo.create({ key: 'store' }),
      );
    }
    return settings;
  }

  async updateStoreSettings(
    dto: UpdateStoreSettingsDto,
  ): Promise<StoreSettings> {
    const settings = await this.getStoreSettings();
    if (dto.storeName !== undefined) settings.storeName = dto.storeName;
    if (dto.storeEmail !== undefined) settings.storeEmail = dto.storeEmail;
    if (dto.phone !== undefined) settings.phone = dto.phone;
    if (dto.timezone !== undefined) settings.timezone = dto.timezone;
    if (dto.currency !== undefined) settings.currency = dto.currency;
    if (dto.language !== undefined) settings.language = dto.language;
    return this.storeRepo.save(settings);
  }

  async getNotificationPrefs(adminId: string): Promise<NotificationPrefs> {
    let prefs = await this.prefsRepo.findOne({ where: { adminId } });
    if (!prefs) {
      prefs = await this.prefsRepo.save(
        this.prefsRepo.create({ adminId, prefs: DEFAULT_PREFS }),
      );
    }
    return prefs;
  }

  async updateNotificationPrefs(
    adminId: string,
    dto: UpdateNotificationPrefsDto,
  ): Promise<NotificationPrefs> {
    const record = await this.getNotificationPrefs(adminId);
    record.prefs = dto.prefs;
    return this.prefsRepo.save(record);
  }

  async listAdmins(): Promise<User[]> {
    return this.userRepo.find({
      where: { role: UserRole.Admin },
      order: { createdAt: 'ASC' },
    });
  }

  async createAdmin(dto: CreateAdminDto): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    const existingPhone = await this.userRepo.findOne({
      where: { phone: dto.phone },
    });
    if (existingPhone) throw new ConflictException('Phone already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const admin = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role: UserRole.Admin,
      status: UserStatus.Active,
      isVerified: true,
    });
    return this.userRepo.save(admin);
  }

  async removeAdmin(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new ConflictException('Cannot remove yourself');
    }
    const admin = await this.userRepo.findOne({
      where: { id, role: UserRole.Admin },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    await this.userRepo.remove(admin);
  }
}
