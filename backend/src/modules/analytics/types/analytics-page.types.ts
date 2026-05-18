export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface RevenueChartPoint {
  day: string;
  date: string;
  revenue: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  dailyAvg: number;
  bestDay: string;
  bestDayRevenue: number;
}

export interface RevenueCategoryItem {
  name: string;
  subCategory: string;
  revenue: number;
  units: number;
  value: number;
  color: string;
}

export interface RevenueTopProduct {
  rank: number;
  productId: string;
  name: string;
  brand: string;
  units: number;
  revenue: number;
}

export interface RevenueAnalyticsResponse {
  chart: RevenueChartPoint[];
  summary: RevenueSummary;
  topProducts: RevenueTopProduct[];
  categoryBreakdown: RevenueCategoryItem[];
}

export interface OrdersChartPoint {
  day: string;
  date: string;
  orders: number;
}

export interface OrderStatusItem {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface OrdersAnalyticsResponse {
  chart: OrdersChartPoint[];
  statusBreakdown: OrderStatusItem[];
}

export interface CustomerTierItem {
  tier: string;
  count: number;
  color: string;
}

export interface TopCustomerItem {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  tier: string;
}

export interface CustomersAnalyticsResponse {
  tierDistribution: CustomerTierItem[];
  topCustomers: TopCustomerItem[];
}
