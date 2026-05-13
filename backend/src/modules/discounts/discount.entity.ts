import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum DiscountType {
  Percentage = 'percentage',
  Fixed = 'fixed',
  FreeShipping = 'free_shipping',
}

@Entity('discounts')
export class Discount extends BaseEntity {
  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: DiscountType })
  type!: DiscountType;

  @Column({ type: 'int', default: 0 })
  value!: number;

  @Column({ default: 'all' })
  appliesTo!: string;

  @Column({ type: 'int', default: 0 })
  minOrder!: number;

  @Column({ type: 'int', default: 0 })
  maxUses!: number;

  @Column({ type: 'int', default: 0 })
  usageCount!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  validFrom!: Date | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  validTo!: Date | null;
}
