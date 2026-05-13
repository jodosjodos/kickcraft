import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './review.entity';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';

export interface ReviewWithVerified extends Omit<Review, 'orderId'> {
  verified: boolean;
  orderId: string | null;
}

function toResponse(review: Review): ReviewWithVerified {
  return { ...review, verified: review.orderId !== null };
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(
    dto: CreateReviewDto,
    userId?: string,
  ): Promise<ReviewWithVerified> {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    let orderId: string | null = null;

    if (dto.orderId) {
      const order = await this.orderRepo.findOne({
        where: { id: dto.orderId },
        relations: ['items'],
      });
      if (!order) throw new BadRequestException('Order not found');
      const hasProduct = order.items.some((i) => i.productId === dto.productId);
      if (!hasProduct) {
        throw new BadRequestException(
          'This order does not contain the reviewed product',
        );
      }
      if (userId && order.userId !== userId) {
        throw new BadRequestException('Order does not belong to this user');
      }
      orderId = dto.orderId;
    }

    const review = this.reviewRepo.create({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productBrand: product.brand,
      userId: userId ?? null,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail ?? null,
      orderId,
      rating: dto.rating,
      title: dto.title,
      body: dto.body,
      status: ReviewStatus.Pending,
    });

    const saved = await this.reviewRepo.save(review);
    return toResponse(saved);
  }

  async findByProduct(productId: string): Promise<ReviewWithVerified[]> {
    const reviews = await this.reviewRepo.find({
      where: { productId, status: ReviewStatus.Approved },
      order: { createdAt: 'DESC' },
    });
    return reviews.map(toResponse);
  }

  async findAll(status?: ReviewStatus): Promise<ReviewWithVerified[]> {
    const where = status ? { status } : {};
    const reviews = await this.reviewRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return reviews.map(toResponse);
  }

  async updateStatus(
    id: string,
    dto: UpdateReviewStatusDto,
  ): Promise<ReviewWithVerified> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const wasApproved = review.status === ReviewStatus.Approved;
    review.status = dto.status;
    const saved = await this.reviewRepo.save(review);

    const affectsRating = dto.status === ReviewStatus.Approved || wasApproved;

    if (affectsRating) {
      await this.recomputeProductRating(review.productId);
    }

    return toResponse(saved);
  }

  private async recomputeProductRating(productId: string): Promise<void> {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.productId = :productId', { productId })
      .andWhere('r.status = :status', { status: ReviewStatus.Approved })
      .getRawOne<{ avg: string | null; count: string }>();

    const rating = result?.avg
      ? parseFloat(parseFloat(result.avg).toFixed(2))
      : null;
    const reviewCount = result?.count ? parseInt(result.count, 10) : 0;

    await this.productRepo.update(productId, { rating, reviewCount });
  }
}
