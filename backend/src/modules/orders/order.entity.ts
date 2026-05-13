import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  OutForDelivery = 'out_for_delivery',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentPhase {
  Pending = 'pending',
  UpfrontPaid = 'upfront_paid',
  FullyPaid = 'fully_paid',
}

export enum DeliveryMethod {
  Delivery = 'delivery',
  Pickup = 'pickup',
}

@Entity('orders')
export class Order extends BaseEntity {
  @Index({ unique: true })
  @Column()
  orderToken!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status!: OrderStatus;

  @Column({ type: 'enum', enum: PaymentPhase, default: PaymentPhase.Pending })
  paymentPhase!: PaymentPhase;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
    default: DeliveryMethod.Delivery,
  })
  deliveryMethod!: DeliveryMethod;

  @Column({ type: 'varchar', nullable: true, default: null })
  deliveryAddress!: string | null;

  @Column()
  phone!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  userId!: string | null;

  @Column({ type: 'int' })
  subtotal!: number;

  @Column({ type: 'int', default: 0 })
  deliveryFee!: number;

  @Column({ type: 'int' })
  total!: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  cancelReason!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  agentId!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  discountId!: string | null;

  @Column({ type: 'int', default: 0 })
  discountAmount!: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderItem[];
}
