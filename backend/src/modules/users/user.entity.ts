import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Index()
  @Column({ unique: true })
  phone!: string;

  @Exclude()
  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role!: UserRole;

  @Column({ default: false })
  isVerified!: boolean;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  verificationToken!: string | null;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  resetToken!: string | null;

  @Exclude()
  @Column({ type: 'timestamptz', nullable: true, default: null })
  resetTokenExpiresAt!: Date | null;
}
