import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Index()
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order!: Order;

  @Column()
  productId!: string;

  @Column()
  productSlug!: string;

  @Column()
  productName!: string;

  @Column()
  productBrand!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  imageUrl!: string | null;

  @Column()
  size!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;
}
