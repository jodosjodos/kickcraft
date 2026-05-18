import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  getAll(@Req() req: Request) {
    const user = req.user as RequestUser;
    return this.notifService.getForAdmin(user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as RequestUser;
    const count = await this.notifService.getUnreadCount(user.id);
    return { count };
  }

  @Patch('read-all')
  markAllRead(@Req() req: Request) {
    const user = req.user as RequestUser;
    return this.notifService.markAllRead(user.id);
  }

  @Patch(':id/read')
  markRead(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as RequestUser;
    return this.notifService.markRead(user.id, id);
  }
}
