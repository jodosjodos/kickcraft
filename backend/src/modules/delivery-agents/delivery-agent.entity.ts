import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('delivery_agents')
export class DeliveryAgent extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  email!: string | null;
}
