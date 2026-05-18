import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export enum UserStatus {
  Active = 'active',
  Banned = 'banned',
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

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status!: UserStatus;

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

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  pendingPasswordHash!: string | null;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  passwordChangeToken!: string | null;

  @Exclude()
  @Column({ type: 'timestamptz', nullable: true, default: null })
  passwordChangeTokenExpiresAt!: Date | null;

  @Column({ type: 'text', nullable: true, default: null })
  adminNotes!: string | null;

  @Exclude()
  @Column({ type: 'varchar', nullable: true, default: null })
  twoFactorSecret!: string | null;

  @Column({ default: false })
  twoFactorEnabled!: boolean;
}
