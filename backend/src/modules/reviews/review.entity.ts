import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ReviewStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Flagged = 'flagged',
}

@Entity('reviews')
export class Review extends BaseEntity {
  @Column()
  productId!: string;

  @Column()
  productSlug!: string;

  @Column()
  productName!: string;

  @Column()
  productBrand!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  userId!: string | null;

  @Column()
  customerName!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  customerEmail!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  orderId!: string | null;

  @Column({ type: 'int' })
  rating!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.Pending })
  status!: ReviewStatus;
}
