import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount, DiscountType } from './discount.entity';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

export type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'draft';

export interface DiscountWithStatus extends Discount {
  status: DiscountStatus;
}

export interface ApplyDiscountResult {
  discountAmount: number;
  discountId: string;
  code: string;
}

const DELIVERY_FEE = 2000;

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepo: Repository<Discount>,
  ) {}

  computeStatus(d: Discount): DiscountStatus {
    const now = new Date();
    if (d.validTo && d.validTo < now) return 'expired';
    if (!d.isActive) return 'draft';
    if (d.validFrom && d.validFrom > now) return 'scheduled';
    return 'active';
  }

  async findAll(): Promise<DiscountWithStatus[]> {
    const discounts = await this.discountRepo.find({
      order: { createdAt: 'DESC' },
    });
    return discounts.map((d) => ({ ...d, status: this.computeStatus(d) }));
  }

  async create(dto: CreateDiscountDto): Promise<DiscountWithStatus> {
    const discount = this.discountRepo.create({
      code: dto.code.toUpperCase(),
      name: dto.name,
      type: dto.type,
      value: dto.value,
      appliesTo: dto.appliesTo ?? 'all',
      minOrder: dto.minOrder ?? 0,
      maxUses: dto.maxUses ?? 0,
      isActive: dto.isActive ?? true,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
      validTo: dto.validTo ? new Date(dto.validTo) : null,
    });
    const saved = await this.discountRepo.save(discount);
    return { ...saved, status: this.computeStatus(saved) };
  }

  async update(
    id: string,
    dto: UpdateDiscountDto,
  ): Promise<DiscountWithStatus> {
    const discount = await this.discountRepo.findOne({ where: { id } });
    if (!discount) throw new NotFoundException('Discount not found');

    if (dto.validFrom !== undefined) {
      discount.validFrom = dto.validFrom ? new Date(dto.validFrom) : null;
    }
    if (dto.validTo !== undefined) {
      discount.validTo = dto.validTo ? new Date(dto.validTo) : null;
    }

    const { validFrom: _vf, validTo: _vt, ...rest } = dto;
    Object.assign(discount, rest);

    const saved = await this.discountRepo.save(discount);
    return { ...saved, status: this.computeStatus(saved) };
  }

  async applyDiscount(dto: ApplyDiscountDto): Promise<ApplyDiscountResult> {
    const discount = await this.discountRepo.findOne({
      where: { code: dto.code.toUpperCase() },
    });

    if (!discount) throw new BadRequestException('Invalid discount code');

    const status = this.computeStatus(discount);
    if (status !== 'active') {
      const msg =
        status === 'expired'
          ? 'This discount code has expired'
          : status === 'scheduled'
            ? 'This discount code is not yet active'
            : 'This discount code is inactive';
      throw new BadRequestException(msg);
    }

    if (discount.minOrder > 0 && dto.orderTotal < discount.minOrder) {
      throw new BadRequestException(
        `Minimum order of RWF ${discount.minOrder.toLocaleString()} required`,
      );
    }

    if (discount.maxUses > 0 && discount.usageCount >= discount.maxUses) {
      throw new BadRequestException(
        'This discount code has reached its usage limit',
      );
    }

    let discountAmount: number;
    switch (discount.type) {
      case DiscountType.Percentage:
        discountAmount = Math.floor((dto.orderTotal * discount.value) / 100);
        break;
      case DiscountType.Fixed:
        discountAmount = Math.min(discount.value, dto.orderTotal);
        break;
      case DiscountType.FreeShipping:
        discountAmount = DELIVERY_FEE;
        break;
    }

    return { discountAmount, discountId: discount.id, code: discount.code };
  }

  async incrementUsage(id: string): Promise<void> {
    await this.discountRepo.increment({ id }, 'usageCount', 1);
  }
}
