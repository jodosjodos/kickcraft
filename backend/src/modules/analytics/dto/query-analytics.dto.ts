import { IsOptional, IsIn } from 'class-validator';
import type { AnalyticsPeriod } from '../types/analytics-page.types';

export class QueryAnalyticsDto {
  @IsOptional()
  @IsIn(['7d', '30d', '90d'])
  period: AnalyticsPeriod = '7d';
}
