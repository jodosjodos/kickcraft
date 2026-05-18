import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './user.entity';
import { Order } from '../orders/order.entity';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserNotesDto } from './dto/update-user-notes.dto';

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  verificationToken: string;
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  adminNotes: string | null;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface AdminUserOrder {
  id: string;
  orderToken: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserListItem {
  orders: AdminUserOrder[];
}

export interface AdminUserSummary {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  avgLTV: number;
}

export interface UsersListResult {
  data: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  summary: AdminUserSummary;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone } });
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateUserData): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(dto: QueryUsersDto): Promise<UsersListResult> {
    const { page, limit, search, status } = dto;
    const offset = (page - 1) * limit;

    const listQb = this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select('u.id', 'id')
      .addSelect('u.name', 'name')
      .addSelect('u.email', 'email')
      .addSelect('u.phone', 'phone')
      .addSelect('u.role', 'role')
      .addSelect('u.status', 'status')
      .addSelect('u.isVerified', 'isVerified')
      .addSelect('u.adminNotes', 'adminNotes')
      .addSelect('u.createdAt', 'createdAt')
      .addSelect('COALESCE(COUNT(DISTINCT o.id), 0)::int', 'orderCount')
      .addSelect(
        "COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0)::int",
        'totalSpent',
      )
      .leftJoin(Order, 'o', 'o."userId" = CAST(u.id AS varchar)')
      .where('u.role = :role', { role: UserRole.User })
      .groupBy('u.id')
      .orderBy('u.createdAt', 'DESC')
      .limit(limit)
      .offset(offset);

    const countQb = this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select('COUNT(*)::int', 'total')
      .where('u.role = :role', { role: UserRole.User });

    if (status && status !== 'all') {
      listQb.andWhere('u.status = :status', { status });
      countQb.andWhere('u.status = :status', { status });
    }

    if (search) {
      const pattern = `%${search}%`;
      listQb.andWhere(
        '(u.name ILIKE :pattern OR u.email ILIKE :pattern OR u.phone LIKE :pattern)',
        { pattern },
      );
      countQb.andWhere(
        '(u.name ILIKE :pattern OR u.email ILIKE :pattern OR u.phone LIKE :pattern)',
        { pattern },
      );
    }

    const [rawRows, countRow, summary] = await Promise.all([
      listQb.getRawMany<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: UserRole;
        status: UserStatus;
        isVerified: boolean;
        adminNotes: string | null;
        createdAt: Date;
        orderCount: string;
        totalSpent: string;
      }>(),
      countQb.getRawOne<{ total: string }>(),
      this.getSummary(),
    ]);

    const data: AdminUserListItem[] = rawRows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      status: r.status,
      isVerified: Boolean(r.isVerified),
      adminNotes: r.adminNotes,
      createdAt: new Date(r.createdAt).toISOString(),
      orderCount: Number(r.orderCount),
      totalSpent: Number(r.totalSpent),
    }));

    return {
      data,
      total: Number(countRow?.total ?? 0),
      page,
      limit,
      summary,
    };
  }

  private async getSummary(): Promise<AdminUserSummary> {
    const row = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select('COUNT(*)::int', 'totalCustomers')
      .addSelect(
        "SUM(CASE WHEN u.status = 'active' THEN 1 ELSE 0 END)::int",
        'activeCustomers',
      )
      .addSelect(
        "SUM(CASE WHEN DATE_TRUNC('month', u.\"createdAt\") = DATE_TRUNC('month', NOW()) THEN 1 ELSE 0 END)::int",
        'newThisMonth',
      )
      .where('u.role = :role', { role: UserRole.User })
      .getRawOne<{
        totalCustomers: string;
        activeCustomers: string;
        newThisMonth: string;
      }>();

    const avgRow = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('u')
      .select('COALESCE(AVG(spent.total_spent), 0)::int', 'avgLTV')
      .leftJoin(
        (qb) =>
          qb
            .select('o."userId"', 'userId')
            .addSelect(
              "SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END)",
              'total_spent',
            )
            .from(Order, 'o')
            .groupBy('o."userId"'),
        'spent',
        'spent."userId" = CAST(u.id AS varchar)',
      )
      .where('u.role = :role', { role: UserRole.User })
      .andWhere('spent.total_spent > 0')
      .getRawOne<{ avgLTV: string }>();

    return {
      totalCustomers: Number(row?.totalCustomers ?? 0),
      activeCustomers: Number(row?.activeCustomers ?? 0),
      newThisMonth: Number(row?.newThisMonth ?? 0),
      avgLTV: Number(avgRow?.avgLTV ?? 0),
    };
  }

  async findByIdForAdmin(id: string): Promise<AdminUserDetail> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const orders = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('o.id', 'id')
      .addSelect('o.orderToken', 'orderToken')
      .addSelect('o.status', 'status')
      .addSelect('o.total', 'total')
      .addSelect('o.createdAt', 'createdAt')
      .where('o."userId" = :userId', { userId: id })
      .orderBy('o.createdAt', 'DESC')
      .limit(10)
      .getRawMany<{
        id: string;
        orderToken: string;
        status: string;
        total: number;
        createdAt: Date;
      }>();

    const orderCountRow = await this.dataSource
      .getRepository(Order)
      .createQueryBuilder('o')
      .select('COUNT(*)::int', 'count')
      .addSelect(
        "COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0)::int",
        'totalSpent',
      )
      .where('o."userId" = :userId', { userId: id })
      .getRawOne<{ count: string; totalSpent: string }>();

    const itemCountRows = await this.dataSource.query<
      Array<{ orderId: string; itemCount: string }>
    >(
      `SELECT oi."orderId", COUNT(*)::int AS "itemCount"
       FROM order_items oi
       WHERE oi."orderId" = ANY($1)
       GROUP BY oi."orderId"`,
      [orders.map((o) => o.id)],
    );

    const itemCountMap = new Map(
      itemCountRows.map((r) => [r.orderId, Number(r.itemCount)]),
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      adminNotes: user.adminNotes,
      createdAt: user.createdAt.toISOString(),
      orderCount: Number(orderCountRow?.count ?? 0),
      totalSpent: Number(orderCountRow?.totalSpent ?? 0),
      orders: orders.map((o) => ({
        id: o.id,
        orderToken: o.orderToken,
        status: o.status,
        total: Number(o.total),
        itemCount: itemCountMap.get(o.id) ?? 0,
        createdAt: new Date(o.createdAt).toISOString(),
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto): Promise<void> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.save({ ...user, status: dto.status });
  }

  async updateNotes(id: string, dto: UpdateUserNotesDto): Promise<void> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    await this.repo.save({ ...user, adminNotes: dto.notes || null });
  }
}
