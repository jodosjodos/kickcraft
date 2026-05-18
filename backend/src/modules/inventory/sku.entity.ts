import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('skus')
@Index(['productId', 'size', 'color'], { unique: true })
export class Sku extends BaseEntity {
  @Index()
  @Column()
  productId!: string;

  @Column()
  size!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  color!: string | null;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'int', default: 5 })
  threshold!: number;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastRestocked!: Date | null;
}
