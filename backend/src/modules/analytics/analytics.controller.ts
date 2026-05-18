import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { QueryAnalyticsDto } from './dto/query-analytics.dto';
import type { DashboardAnalyticsResponse } from './types/dashboard-analytics.types';
import type {
  RevenueAnalyticsResponse,
  OrdersAnalyticsResponse,
  CustomersAnalyticsResponse,
} from './types/analytics-page.types';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(): Promise<DashboardAnalyticsResponse> {
    return this.analyticsService.getDashboard();
  }

  @Get('revenue')
  getRevenue(
    @Query() dto: QueryAnalyticsDto,
  ): Promise<RevenueAnalyticsResponse> {
    return this.analyticsService.getRevenue(dto.period);
  }

  @Get('orders')
  getOrders(@Query() dto: QueryAnalyticsDto): Promise<OrdersAnalyticsResponse> {
    return this.analyticsService.getOrders(dto.period);
  }

  @Get('customers')
  getCustomers(): Promise<CustomersAnalyticsResponse> {
    return this.analyticsService.getCustomers();
  }
}
