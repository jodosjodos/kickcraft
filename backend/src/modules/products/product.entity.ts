import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ProductStatus {
  Active = 'active',
  Draft = 'draft',
  Archived = 'archived',
}

export enum ProductCategory {
  Men = 'men',
  Women = 'women',
  Kids = 'kids',
  Sports = 'sports',
}

export enum ProductSubCategory {
  Sneakers = 'sneakers',
  Loafers = 'loafers',
  Boots = 'boots',
  Slides = 'slides',
}

export interface ProductImageData {
  url: string;
  alt: string;
  order: number;
}

@Entity('products')
export class Product extends BaseEntity {
  @Index()
  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @Column()
  brand!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int', nullable: true, default: null })
  originalPrice!: number | null;

  @Column({ type: 'enum', enum: ProductCategory })
  category!: ProductCategory;

  @Column({ type: 'enum', enum: ProductSubCategory })
  subCategory!: ProductSubCategory;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.Draft })
  status!: ProductStatus;

  @Column({ default: false })
  isNew!: boolean;

  @Column({ type: 'jsonb', default: [] })
  images!: ProductImageData[];

  @Column('simple-array', { default: '' })
  sizes!: string[];

  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
    default: null,
  })
  rating!: number | null;

  @Column({ type: 'int', default: 0 })
  reviewCount!: number;
}
