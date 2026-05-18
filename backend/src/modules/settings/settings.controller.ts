import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { SettingsService } from './settings.service';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { UpdateNotificationPrefsDto } from './dto/update-notification-prefs.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getStoreSettings() {
    return this.settingsService.getStoreSettings();
  }

  @Patch()
  updateStoreSettings(@Body() dto: UpdateStoreSettingsDto) {
    return this.settingsService.updateStoreSettings(dto);
  }

  @Get('notifications')
  getNotificationPrefs(@Req() req: Request & { user: RequestUser }) {
    return this.settingsService.getNotificationPrefs(req.user.id);
  }

  @Patch('notifications')
  updateNotificationPrefs(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: UpdateNotificationPrefsDto,
  ) {
    return this.settingsService.updateNotificationPrefs(req.user.id, dto);
  }

  @Get('team')
  listAdmins() {
    return this.settingsService.listAdmins();
  }

  @Post('team')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.settingsService.createAdmin(dto);
  }

  @Delete('team/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAdmin(
    @Param('id') id: string,
    @Req() req: Request & { user: RequestUser },
  ) {
    return this.settingsService.removeAdmin(id, req.user.id);
  }
}
