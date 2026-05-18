import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Product, ProductStatus } from '../products/product.entity';
import { User, UserRole } from '../users/user.entity';
import type {
  DashboardAnalyticsResponse,
  DashboardSummary,
  RevenueByDay,
  CategoryBreakdown,
  TopProduct,
  RecentActivity,
} from './types/dashboard-analytics.types';
import type {
  AnalyticsPeriod,
  RevenueAnalyticsResponse,
  RevenueChartPoint,
  RevenueCategoryItem,
  RevenueTopProduct,
  OrdersAnalyticsResponse,
  OrdersChartPoint,
  OrderStatusItem,
  CustomersAnalyticsResponse,
  CustomerTierItem,
  TopCustomerItem,
} from './types/analytics-page.types';

const CATEGORY_NAMES: Record<string, string> = {
  sneakers: 'Sneakers',
  loafers: 'Loafers',
  boots: 'Boots',
  slides: 'Slides',
};

const CATEGORY_COLORS: Record<string, string> = {
  sneakers: '#FF4500',
  loafers: '#41e575',
  boots: '#ffb5a0',
  slides: '#c6c6c7',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async getDashboard(): Promise<DashboardAnalyticsResponse> {
    const [
      summary,
      revenueByDay,
      categoryBreakdown,
      topProducts,
      recentActivity,
    ] = await Promise.all([
      this.getSummary(),
      this.getRevenueByDay(),
      this.getCategoryBreakdown(),
      this.getTopProducts(),
      this.getRecentActivity(),
    ]);

    return {
      summary,
      revenueByDay,
      categoryBreakdown,
      topProducts,
      recentActivity,
    };
  }

  private async getSummary(): Promise<DashboardSummary> {
    const row = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('COUNT(*)::int', 'totalOrders')
      .addSelect(
        "SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END)::int",
        'deliveredOrders',
      )
      .addSelect(
        "SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END)::int",
        'pendingOrders',
      )
      .addSelect(
        "SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END)::int",
        'totalRevenue',
      )
      .getRawOne<{
        totalOrders: string;
        deliveredOrders: string;
        pendingOrders: string;
        totalRevenue: string;
      }>();

    const totalProducts = await this.dataSource
      .getRepository(Product)
      .count({ where: { status: ProductStatus.Active } });

    return {
      totalRevenue: Number(row?.totalRevenue ?? 0),
      totalOrders: Number(row?.totalOrders ?? 0),
      deliveredOrders: Number(row?.deliveredOrders ?? 0),
      pendingOrders: Number(row?.pendingOrders ?? 0),
      totalProducts,
    };
  }

  private async getRevenueByDay(): Promise<RevenueByDay[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const rows = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select("TO_CHAR(DATE(o.createdAt), 'YYYY-MM-DD')", 'date')
      .addSelect('COALESCE(SUM(o.total), 0)::int', 'revenue')
      .where("o.status != 'cancelled'")
      .andWhere('o.createdAt >= :from', { from: sevenDaysAgo })
      .groupBy('DATE(o.createdAt)')
      .orderBy('DATE(o.createdAt)', 'ASC')
      .getRawMany<{ date: string; revenue: string }>();

    const result: RevenueByDay[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = rows.find((r) => r.date === dateStr);
      result.push({
        day: DAY_NAMES[d.getDay()],
        date: dateStr,
        revenue: found ? Number(found.revenue) : 0,
      });
    }

    return result;
  }

  private async getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
    const rows = await this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('oi')
      .select('p.subCategory', 'subCategory')
      .addSelect('SUM(oi.price * oi.quantity)::int', 'revenue')
      .addSelect('SUM(oi.quantity)::int', 'units')
      .innerJoin('oi.order', 'o')
      .innerJoin(Product, 'p', 'CAST(p.id AS varchar) = oi.productId')
      .where("o.status != 'cancelled'")
      .groupBy('p.subCategory')
      .orderBy('revenue', 'DESC')
      .getRawMany<{ subCategory: string; revenue: string; units: string }>();

    const totalRevenue = rows.reduce((sum, r) => sum + Number(r.revenue), 0);

    return rows.map((r) => ({
      name: CATEGORY_NAMES[r.subCategory] ?? r.subCategory,
      subCategory: r.subCategory,
      value:
        totalRevenue > 0
          ? Math.round((Number(r.revenue) / totalRevenue) * 100)
          : 0,
      revenue: Number(r.revenue),
      color: CATEGORY_COLORS[r.subCategory] ?? '#333535',
    }));
  }

  private async getTopProducts(): Promise<TopProduct[]> {
    const rows = await this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('oi')
      .select('oi.productId', 'productId')
      .addSelect('oi.productName', 'name')
      .addSelect('oi.productBrand', 'brand')
      .addSelect('SUM(oi.quantity)::int', 'units')
      .addSelect('SUM(oi.price * oi.quantity)::int', 'revenue')
      .innerJoin('oi.order', 'o')
      .where("o.status != 'cancelled'")
      .groupBy('oi.productId')
      .addGroupBy('oi.productName')
      .addGroupBy('oi.productBrand')
      .orderBy('revenue', 'DESC')
      .limit(5)
      .getRawMany<{
        productId: string;
        name: string;
        brand: string;
        units: string;
        revenue: string;
      }>();

    return rows.map((r, i) => ({
      rank: i + 1,
      productId: r.productId,
      name: r.name,
      brand: r.brand,
      units: Number(r.units),
      revenue: Number(r.revenue),
    }));
  }

  private async getRecentActivity(): Promise<RecentActivity[]> {
    const orders = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select([
        'o.id',
        'o.orderToken',
        'o.status',
        'o.phone',
        'o.total',
        'o.createdAt',
      ])
      .orderBy('o.createdAt', 'DESC')
      .limit(5)
      .getMany();

    return orders.map((o) => ({
      orderToken: o.orderToken,
      status: o.status,
      phone: o.phone,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
    }));
  }

  // ─── Analytics page endpoints ─────────────────────────────────────────────

  async getRevenue(period: AnalyticsPeriod): Promise<RevenueAnalyticsResponse> {
    const from = this.getPeriodStart(period);
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    const [chart, topProducts, categoryBreakdown] = await Promise.all([
      this.buildRevenueChart(from, days, period),
      this.getTopProductsForPeriod(from),
      this.getCategoryBreakdownForPeriod(),
    ]);

    const totalRevenue = chart.reduce((s, p) => s + p.revenue, 0);
    const dailyAvg = days > 0 ? Math.round(totalRevenue / days) : 0;
    const best = chart.reduce(
      (a, b) => (b.revenue > a.revenue ? b : a),
      chart[0] ?? { day: '—', date: '', revenue: 0 },
    );

    return {
      chart,
      summary: {
        totalRevenue,
        dailyAvg,
        bestDay: best.day,
        bestDayRevenue: best.revenue,
      },
      topProducts,
      categoryBreakdown,
    };
  }

  async getOrders(period: AnalyticsPeriod): Promise<OrdersAnalyticsResponse> {
    const from = this.getPeriodStart(period);
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

    const [chart, statusBreakdown] = await Promise.all([
      this.buildOrdersChart(from, days, period),
      this.getStatusBreakdown(),
    ]);

    return { chart, statusBreakdown };
  }

  async getCustomers(): Promise<CustomersAnalyticsResponse> {
    const [tierDistribution, topCustomers] = await Promise.all([
      this.getTierDistribution(),
      this.getTopCustomers(),
    ]);
    return { tierDistribution, topCustomers };
  }

  // ─── Private helpers for analytics page ──────────────────────────────────

  private getPeriodStart(period: AnalyticsPeriod): Date {
    const d = new Date();
    const offset = period === '7d' ? 6 : period === '30d' ? 29 : 89;
    d.setDate(d.getDate() - offset);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private buildDayLabel(d: Date, period: AnalyticsPeriod): string {
    if (period === '7d') return DAY_NAMES[d.getDay()];
    return String(d.getDate()).padStart(2, '0');
  }

  private async buildRevenueChart(
    from: Date,
    days: number,
    period: AnalyticsPeriod,
  ): Promise<RevenueChartPoint[]> {
    const rows = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('TO_CHAR(DATE(o."createdAt"), \'YYYY-MM-DD\')', 'date')
      .addSelect('COALESCE(SUM(o.total), 0)::int', 'revenue')
      .where("o.status != 'cancelled'")
      .andWhere('o."createdAt" >= :from', { from })
      .groupBy('DATE(o."createdAt")')
      .orderBy('DATE(o."createdAt")', 'ASC')
      .getRawMany<{ date: string; revenue: string }>();

    const map = new Map(rows.map((r) => [r.date, Number(r.revenue)]));
    const result: RevenueChartPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        day: this.buildDayLabel(d, period),
        date: dateStr,
        revenue: map.get(dateStr) ?? 0,
      });
    }

    return result;
  }

  private async buildOrdersChart(
    from: Date,
    days: number,
    period: AnalyticsPeriod,
  ): Promise<OrdersChartPoint[]> {
    const rows = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('TO_CHAR(DATE(o."createdAt"), \'YYYY-MM-DD\')', 'date')
      .addSelect('COUNT(*)::int', 'orders')
      .where('o."createdAt" >= :from', { from })
      .groupBy('DATE(o."createdAt")')
      .orderBy('DATE(o."createdAt")', 'ASC')
      .getRawMany<{ date: string; orders: string }>();

    const map = new Map(rows.map((r) => [r.date, Number(r.orders)]));
    const result: OrdersChartPoint[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      result.push({
        day: this.buildDayLabel(d, period),
        date: dateStr,
        orders: map.get(dateStr) ?? 0,
      });
    }

    return result;
  }

  private async getTopProductsForPeriod(
    from: Date,
  ): Promise<RevenueTopProduct[]> {
    const rows = await this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('oi')
      .select('oi.productId', 'productId')
      .addSelect('oi.productName', 'name')
      .addSelect('oi.productBrand', 'brand')
      .addSelect('SUM(oi.quantity)::int', 'units')
      .addSelect('SUM(oi.price * oi.quantity)::int', 'revenue')
      .innerJoin('oi.order', 'o')
      .where("o.status != 'cancelled'")
      .andWhere('o."createdAt" >= :from', { from })
      .groupBy('oi.productId')
      .addGroupBy('oi.productName')
      .addGroupBy('oi.productBrand')
      .orderBy('revenue', 'DESC')
      .limit(10)
      .getRawMany<{
        productId: string;
        name: string;
        brand: string;
        units: string;
        revenue: string;
      }>();

    return rows.map((r, i) => ({
      rank: i + 1,
      productId: r.productId,
      name: r.name,
      brand: r.brand,
      units: Number(r.units),
      revenue: Number(r.revenue),
    }));
  }

  private async getCategoryBreakdownForPeriod(): Promise<
    RevenueCategoryItem[]
  > {
    const rows = await this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('oi')
      .select('p.subCategory', 'subCategory')
      .addSelect('SUM(oi.price * oi.quantity)::int', 'revenue')
      .addSelect('SUM(oi.quantity)::int', 'units')
      .innerJoin('oi.order', 'o')
      .innerJoin(Product, 'p', 'CAST(p.id AS varchar) = oi.productId')
      .where("o.status != 'cancelled'")
      .groupBy('p.subCategory')
      .orderBy('revenue', 'DESC')
      .getRawMany<{ subCategory: string; revenue: string; units: string }>();

    const totalRevenue = rows.reduce((s, r) => s + Number(r.revenue), 0);

    return rows.map((r) => ({
      name: CATEGORY_NAMES[r.subCategory] ?? r.subCategory,
      subCategory: r.subCategory,
      revenue: Number(r.revenue),
      units: Number(r.units),
      value:
        totalRevenue > 0
          ? Math.round((Number(r.revenue) / totalRevenue) * 100)
          : 0,
      color: CATEGORY_COLORS[r.subCategory] ?? '#333535',
    }));
  }

  private async getStatusBreakdown(): Promise<OrderStatusItem[]> {
    const STATUS_META: Record<string, { label: string; color: string }> = {
      delivered: { label: 'Delivered', color: '#41e575' },
      out_for_delivery: { label: 'Out for Delivery', color: '#ffb5a0' },
      confirmed: { label: 'Confirmed', color: '#FF4500' },
      pending: { label: 'Pending', color: '#9e9e9e' },
      cancelled: { label: 'Cancelled', color: '#ffb4ab' },
    };

    const rows = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(*)::int', 'count')
      .groupBy('o.status')
      .getRawMany<{ status: string; count: string }>();

    return rows
      .filter((r) => STATUS_META[r.status])
      .map((r) => ({
        status: r.status,
        label: STATUS_META[r.status].label,
        count: Number(r.count),
        color: STATUS_META[r.status].color,
      }))
      .sort(
        (a, b) =>
          Object.keys(STATUS_META).indexOf(a.status) -
          Object.keys(STATUS_META).indexOf(b.status),
      );
  }

  private getTierLabel(spent: number): string {
    if (spent >= 500_000) return 'Platinum';
    if (spent >= 200_000) return 'Gold';
    if (spent >= 80_000) return 'Silver';
    return 'Bronze';
  }

  private async getTopCustomers(): Promise<TopCustomerItem[]> {
    const rows = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('COALESCE(COUNT(DISTINCT o.id), 0)::int', 'orderCount')
      .addSelect(
        "COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0)::int",
        'totalSpent',
      )
      .leftJoin(Order, 'o', 'o."userId" = CAST(u.id AS varchar)')
      .where('u.role = :role', { role: UserRole.User })
      .groupBy('u.id')
      .orderBy('"totalSpent"', 'DESC')
      .limit(10)
      .getRawMany<{
        id: string;
        name: string;
        email: string;
        orderCount: string;
        totalSpent: string;
      }>();

    return rows.map((r) => {
      const spent = Number(r.totalSpent);
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        orderCount: Number(r.orderCount),
        totalSpent: spent,
        tier: this.getTierLabel(spent),
      };
    });
  }

  private async getTierDistribution(): Promise<CustomerTierItem[]> {
    const TIER_CONFIG: Array<{ tier: string; color: string }> = [
      { tier: 'Platinum', color: '#c6c6c7' },
      { tier: 'Gold', color: '#f5a623' },
      { tier: 'Silver', color: '#9e9e9e' },
      { tier: 'Bronze', color: '#ffb5a0' },
    ];

    // Subquery: compute per-user totalSpent first, then bucket into tiers in outer query.
    // GROUP BY on a CASE with aggregates is not allowed in PostgreSQL.
    const rows = await this.dataSource.query<
      Array<{ tier: string; count: string }>
    >(
      `SELECT tier, COUNT(*)::int AS count
       FROM (
         SELECT
           CASE
             WHEN COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) >= 500000 THEN 'Platinum'
             WHEN COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) >= 200000 THEN 'Gold'
             WHEN COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) >= 80000 THEN 'Silver'
             ELSE 'Bronze'
           END AS tier
         FROM users u
         LEFT JOIN orders o ON o."userId" = CAST(u.id AS varchar)
         WHERE u.role = $1
         GROUP BY u.id
       ) sub
       GROUP BY tier`,
      [UserRole.User],
    );

    const countMap = new Map(rows.map((r) => [r.tier, Number(r.count)]));

    return TIER_CONFIG.map(({ tier, color }) => ({
      tier,
      count: countMap.get(tier) ?? 0,
      color,
    }));
  }
}
