import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import {
  verificationTemplate,
  welcomeTemplate,
  passwordResetTemplate,
  passwordChangeConfirmTemplate,
  passwordChangedTemplate,
} from './templates/email.templates';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly frontendUrl: string;
  private readonly logger = new Logger(MailService.name);

  constructor(config: ConfigService) {
    this.from = config.getOrThrow<string>('SMTP_FROM');
    this.frontendUrl = config.getOrThrow<string>('FRONTEND_URL');

    this.transporter = nodemailer.createTransport({
      host: config.getOrThrow<string>('SMTP_HOST'),
      port: config.getOrThrow<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: config.getOrThrow<string>('SMTP_USER'),
        pass: config.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${subject}`, err);
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const link = `${this.frontendUrl}/auth/verify-email?token=${token}`;
    await this.send(to, 'Verify your Kickcraft email', verificationTemplate(link));
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.send(to, `Welcome to Kickcraft, ${name.split(' ')[0]}!`, welcomeTemplate(name));
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    await this.send(to, 'Reset your Kickcraft password', passwordResetTemplate(link));
  }

  async sendPasswordChangeConfirmation(
    to: string,
    token: string,
    name: string,
  ): Promise<void> {
    const link = `${this.frontendUrl}/auth/confirm-password-change?token=${token}`;
    await this.send(
      to,
      'Confirm your password change',
      passwordChangeConfirmTemplate(link, name),
    );
  }

  async sendPasswordChangedNotification(to: string, name: string): Promise<void> {
    await this.send(to, 'Your password was changed', passwordChangedTemplate(name));
  }
}
