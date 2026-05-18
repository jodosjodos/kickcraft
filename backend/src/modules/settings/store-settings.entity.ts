import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('store_settings')
export class StoreSettings extends BaseEntity {
  @Column({ unique: true, default: 'store' })
  key!: string;

  @Column({ default: 'KickCraft' })
  storeName!: string;

  @Column({ default: 'hello@kickcraft.com' })
  storeEmail!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: 'Africa/Kigali' })
  timezone!: string;

  @Column({ default: 'RWF' })
  currency!: string;

  @Column({ default: 'en' })
  language!: string;
}
