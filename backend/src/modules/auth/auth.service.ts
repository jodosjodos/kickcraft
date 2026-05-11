import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from './mail.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmPasswordChangeDto } from './dto/confirm-password-change.dto';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException('Email already in use');

    const existingPhone = await this.usersService.findByPhone(dto.phone);
    if (existingPhone) throw new ConflictException('Phone number already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = randomUUID();

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      verificationToken,
    });

    void this.mailService.sendVerificationEmail(user.email, verificationToken);
    void this.mailService.sendWelcomeEmail(user.email, user.name);

    return user;
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { verificationToken: dto.token },
    });

    if (!user) throw new BadRequestException('Invalid or expired token');
    if (user.isVerified) throw new BadRequestException('Email already verified');

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepo.save(user);

    return { message: 'Email verified' };
  }

  async login(dto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified)
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );

    const expiresIn = this.config.getOrThrow<number>('JWT_EXPIRES_IN');
    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        ...(user.phone && { phone: user.phone }),
      },
      { expiresIn },
    );

    return { user, token };
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    const safeResponse = {
      message: 'If that email is registered, a reset link was sent',
    };

    if (!user) return safeResponse;

    const resetToken = randomUUID();
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiresAt = resetTokenExpiresAt;
    await this.userRepo.save(user);

    void this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return safeResponse;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { resetToken: dto.token },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.passwordHash = await bcrypt.hash(dto.password, 12);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await this.userRepo.save(user);

    return { message: 'Password reset successful' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    if (dto.phone && dto.phone !== user.phone) {
      const existing = await this.usersService.findByPhone(dto.phone);
      if (existing) throw new ConflictException('Phone number already in use');
    }

    if (dto.name) user.name = dto.name;
    if (dto.phone) user.phone = dto.phone;

    return this.userRepo.save(user);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!match) throw new UnauthorizedException('Current password is incorrect');

    const pendingPasswordHash = await bcrypt.hash(dto.newPassword, 12);
    const passwordChangeToken = randomUUID();
    const passwordChangeTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.pendingPasswordHash = pendingPasswordHash;
    user.passwordChangeToken = passwordChangeToken;
    user.passwordChangeTokenExpiresAt = passwordChangeTokenExpiresAt;
    await this.userRepo.save(user);

    void this.mailService.sendPasswordChangeConfirmation(
      user.email,
      passwordChangeToken,
      user.name,
    );

    return {
      message:
        'Check your email — click the confirmation link to apply the new password',
    };
  }

  async confirmPasswordChange(
    dto: ConfirmPasswordChangeDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: { passwordChangeToken: dto.token },
    });

    if (!user) throw new BadRequestException('Invalid or expired token');

    if (
      !user.passwordChangeTokenExpiresAt ||
      user.passwordChangeTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (!user.pendingPasswordHash) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.passwordHash = user.pendingPasswordHash;
    user.pendingPasswordHash = null;
    user.passwordChangeToken = null;
    user.passwordChangeTokenExpiresAt = null;
    await this.userRepo.save(user);

    void this.mailService.sendPasswordChangedNotification(user.email, user.name);

    return { message: 'Password updated successfully' };
  }
}
