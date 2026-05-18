export interface RevenueByDay {
  day: string;
  date: string;
  revenue: number;
}

export interface CategoryBreakdown {
  name: string;
  subCategory: string;
  value: number;
  revenue: number;
  color: string;
}

export interface TopProduct {
  rank: number;
  productId: string;
  name: string;
  brand: string;
  units: number;
  revenue: number;
}

export interface RecentActivity {
  orderToken: string;
  status: string;
  phone: string;
  total: number;
  createdAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalProducts: number;
}

export interface DashboardAnalyticsResponse {
  summary: DashboardSummary;
  revenueByDay: RevenueByDay[];
  categoryBreakdown: CategoryBreakdown[];
  topProducts: TopProduct[];
  recentActivity: RecentActivity[];
}
