import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentPhaseDto } from './dto/update-payment-phase.dto';
import type { RequestUser } from '../auth/strategies/jwt.strategy';

interface AuthRequest extends Request {
  user?: RequestUser;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Create (guest + auth) ─────────────────────────────────────────────────

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: AuthRequest) {
    return this.ordersService.create(dto, req.user?.id);
  }

  // ── User: own orders ──────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  getMyOrders(@Req() req: AuthRequest) {
    return this.ordersService.findByUser(req.user!.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine/:id')
  getMyOrder(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.ordersService.findOneForUser(id, req.user!.id);
  }

  // ── Guest: track by token (public) ───────────────────────────────────────

  @Get('token/:token')
  getByToken(@Param('token') token: string) {
    return this.ordersService.findByToken(token);
  }

  // ── Admin: full CRUD ──────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/payment')
  updatePaymentPhase(@Param('id') id: string, @Body() dto: UpdatePaymentPhaseDto) {
    return this.ordersService.updatePaymentPhase(id, dto);
  }
}
