import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('sessions')
export class Session extends BaseEntity {
  @Index()
  @Column()
  userId!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  userAgent!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  ip!: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastSeenAt!: Date | null;

  @Column({ default: true })
  isActive!: boolean;
}
