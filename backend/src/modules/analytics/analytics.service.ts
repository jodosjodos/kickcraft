import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Product, ProductStatus } from '../products/product.entity';
import type {
  DashboardAnalyticsResponse,
  DashboardSummary,
  RevenueByDay,
  CategoryBreakdown,
  TopProduct,
  RecentActivity,
} from './types/dashboard-analytics.types';

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
}
