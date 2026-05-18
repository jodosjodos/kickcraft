import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreSettings } from './store-settings.entity';
import { NotificationPrefs } from './notification-prefs.entity';
import { User } from '../users/user.entity';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([StoreSettings, NotificationPrefs, User])],
  providers: [SettingsService, RolesGuard],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
