import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmPasswordChangeDto } from './dto/confirm-password-change.dto';
import { ChangePasswordDirectDto } from './dto/change-password-direct.dto';
import { VerifyTotpDto } from './dto/verify-totp.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { RequestUser } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.login(
      dto,
      req.headers['user-agent'],
      req.ip,
    );
    const maxAge = this.config.getOrThrow<number>('JWT_EXPIRES_IN');
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAge * 1000,
    });
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user: RequestUser },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.user.jti);
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { message: 'Logged out' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request & { user: RequestUser }) {
    return this.authService.getMe(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('confirm-password-change')
  @HttpCode(HttpStatus.OK)
  confirmPasswordChange(@Body() dto: ConfirmPasswordChangeDto) {
    return this.authService.confirmPasswordChange(dto);
  }

  @Post('change-password-direct')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  changePasswordDirect(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: ChangePasswordDirectDto,
  ) {
    return this.authService.changePasswordDirect(req.user.id, dto);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  getSessions(@Req() req: Request & { user: RequestUser }) {
    return this.authService.getSessions(req.user.id);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  revokeSession(
    @Req() req: Request & { user: RequestUser },
    @Param('sessionId') sessionId: string,
  ) {
    return this.authService.revokeSession(req.user.id, sessionId);
  }

  @Get('2fa/setup')
  @UseGuards(JwtAuthGuard)
  setup2FA(@Req() req: Request & { user: RequestUser }) {
    return this.authService.setup2FA(req.user.id);
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: VerifyTotpDto,
  ) {
    return this.authService.enable2FA(req.user.id, dto);
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  disable2FA(
    @Req() req: Request & { user: RequestUser },
    @Body() dto: VerifyTotpDto,
  ) {
    return this.authService.disable2FA(req.user.id, dto);
  }
}
