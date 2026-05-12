import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, DeliveryMethod, OrderStatus, PaymentPhase } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentPhaseDto } from './dto/update-payment-phase.dto';

const DELIVERY_FEE = 2000;

function generateToken(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `KC-${num}`;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto, userId?: string): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      let subtotal = 0;
      const itemSnapshots: Partial<OrderItem>[] = [];

      for (const input of dto.items) {
        const product = await manager.findOne(Product, {
          where: { id: input.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(`Product ${input.productId} not found`);
        }
        if (product.stock < input.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}"`,
          );
        }

        // Atomic stock decrement
        await manager.decrement(
          Product,
          { id: product.id },
          'stock',
          input.quantity,
        );

        const linePrice = product.price * input.quantity;
        subtotal += linePrice;

        itemSnapshots.push({
          productId: product.id,
          productSlug: product.slug,
          productName: product.name,
          productBrand: product.brand,
          price: product.price,
          imageUrl: (product.images[0]?.url) ?? null,
          size: input.size,
          quantity: input.quantity,
        });
      }

      const deliveryFee =
        dto.deliveryMethod === DeliveryMethod.Delivery ? DELIVERY_FEE : 0;
      const total = subtotal + deliveryFee;

      let token = generateToken();
      // Retry until unique (collision extremely unlikely)
      while (await manager.findOne(Order, { where: { orderToken: token } })) {
        token = generateToken();
      }

      const order = manager.create(Order, {
        orderToken: token,
        status: OrderStatus.Pending,
        paymentPhase: PaymentPhase.Pending,
        deliveryMethod: dto.deliveryMethod,
        deliveryAddress: dto.deliveryAddress ?? null,
        phone: dto.phone,
        email: dto.email ?? null,
        userId: userId ?? null,
        subtotal,
        deliveryFee,
        total,
        cancelReason: null,
      });

      const savedOrder = await manager.save(Order, order);

      const items = itemSnapshots.map((snap) =>
        manager.create(OrderItem, { ...snap, order: savedOrder }),
      );
      await manager.save(OrderItem, items);

      return manager.findOneOrFail(Order, { where: { id: savedOrder.id } });
    });
  }

  async findAll(query: OrderQueryDto): Promise<PaginatedOrders> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'items')
      .orderBy('o.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('o.status = :status', { status: query.status });
    }
    if (query.paymentPhase) {
      qb.andWhere('o.paymentPhase = :phase', { phase: query.paymentPhase });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByToken(token: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { orderToken: token },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findOneForUser(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = dto.status;
    if (dto.status === OrderStatus.Cancelled && dto.cancelReason) {
      order.cancelReason = dto.cancelReason;
    }
    return this.orderRepo.save(order);
  }

  async updatePaymentPhase(
    id: string,
    dto: UpdatePaymentPhaseDto,
  ): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentPhase = dto.paymentPhase;
    return this.orderRepo.save(order);
  }
}
