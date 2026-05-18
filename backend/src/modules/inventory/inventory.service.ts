import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { Sku } from './sku.entity';
import { Product } from '../products/product.entity';
import { OrderStatus } from '../orders/order.entity';
import { CreateSkuDto } from './dto/create-sku.dto';
import { UpdateSkuDto } from './dto/update-sku.dto';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface SkuResponse {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  size: string;
  color: string | null;
  stock: number;
  reserved: number;
  available: number;
  threshold: number;
  lastRestocked: string | null;
  status: StockStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Sku)
    private readonly skuRepo: Repository<Sku>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async list(): Promise<SkuResponse[]> {
    const skus = await this.skuRepo.find({ order: { createdAt: 'ASC' } });
    if (skus.length === 0) return [];

    const productIds = [...new Set(skus.map((s) => s.productId))];
    const products = await this.productRepo.find({
      where: { id: In(productIds) },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const reservedMap = await this.computeReservedMap(skus);

    return skus.map((sku) => this.toResponse(sku, productMap, reservedMap));
  }

  async findOne(id: string): Promise<SkuResponse> {
    const sku = await this.skuRepo.findOne({ where: { id } });
    if (!sku) throw new NotFoundException('SKU not found');

    const product = await this.productRepo.findOne({
      where: { id: sku.productId },
    });
    const productMap = new Map(product ? [[product.id, product]] : []);
    const reservedMap = await this.computeReservedMap([sku]);

    return this.toResponse(sku, productMap, reservedMap);
  }

  async create(dto: CreateSkuDto): Promise<SkuResponse> {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.skuRepo.findOne({
      where: {
        productId: dto.productId,
        size: dto.size,
        color: dto.color !== undefined ? dto.color : IsNull(),
      },
    });
    if (existing) {
      throw new ConflictException(
        'SKU already exists for this product/size/color combination',
      );
    }

    const sku = this.skuRepo.create({
      productId: dto.productId,
      size: dto.size,
      color: dto.color ?? null,
      stock: dto.stock ?? 0,
      threshold: dto.threshold ?? 5,
    });
    const saved = await this.skuRepo.save(sku);

    const productMap = new Map([[product.id, product]]);
    const reservedMap = await this.computeReservedMap([saved]);
    return this.toResponse(saved, productMap, reservedMap);
  }

  async update(id: string, dto: UpdateSkuDto): Promise<SkuResponse> {
    const sku = await this.skuRepo.findOne({ where: { id } });
    if (!sku) throw new NotFoundException('SKU not found');

    if (dto.stock !== undefined) sku.stock = dto.stock;
    if (dto.threshold !== undefined) sku.threshold = dto.threshold;
    if (dto.color !== undefined) sku.color = dto.color;
    if (dto.lastRestocked !== undefined)
      sku.lastRestocked = new Date(dto.lastRestocked);

    const saved = await this.skuRepo.save(sku);

    const product = await this.productRepo.findOne({
      where: { id: saved.productId },
    });
    const productMap = new Map(product ? [[product.id, product]] : []);
    const reservedMap = await this.computeReservedMap([saved]);
    return this.toResponse(saved, productMap, reservedMap);
  }

  async remove(id: string): Promise<void> {
    const sku = await this.skuRepo.findOne({ where: { id } });
    if (!sku) throw new NotFoundException('SKU not found');
    await this.skuRepo.remove(sku);
  }

  private async computeReservedMap(skus: Sku[]): Promise<Map<string, number>> {
    if (skus.length === 0) return new Map();

    const activeStatuses = [
      OrderStatus.Pending,
      OrderStatus.Confirmed,
      OrderStatus.OutForDelivery,
    ];

    const rows = await this.dataSource.query<
      Array<{ productId: string; size: string; reserved: string }>
    >(
      `SELECT oi."productId", oi.size, SUM(oi.quantity)::int AS reserved
       FROM order_items oi
       INNER JOIN orders o ON o.id = oi."orderId"
       WHERE o.status = ANY($1)
       AND (oi."productId", oi.size) = ANY($2::text[][])
       GROUP BY oi."productId", oi.size`,
      [activeStatuses, skus.map((s) => `{${s.productId},${s.size}}`)],
    );

    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(`${row.productId}:${row.size}`, Number(row.reserved));
    }
    return map;
  }

  private toResponse(
    sku: Sku,
    productMap: Map<string, Product>,
    reservedMap: Map<string, number>,
  ): SkuResponse {
    const product = productMap.get(sku.productId);
    const reserved = reservedMap.get(`${sku.productId}:${sku.size}`) ?? 0;
    const available = Math.max(0, sku.stock - reserved);

    let status: StockStatus = 'in_stock';
    if (sku.stock === 0) status = 'out_of_stock';
    else if (sku.stock <= sku.threshold) status = 'low_stock';

    return {
      id: sku.id,
      productId: sku.productId,
      productName: product?.name ?? 'Unknown Product',
      productBrand: product?.brand ?? '',
      size: sku.size,
      color: sku.color,
      stock: sku.stock,
      reserved,
      available,
      threshold: sku.threshold,
      lastRestocked: sku.lastRestocked?.toISOString() ?? null,
      status,
      createdAt: sku.createdAt,
      updatedAt: sku.updatedAt,
    };
  }
}
