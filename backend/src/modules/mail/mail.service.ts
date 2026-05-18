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
  orderOutForDeliveryTemplate,
  agentAssignmentTemplate,
} from './email.templates';
import type { Order } from '../orders/order.entity';

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
    await this.send(
      to,
      'Verify your Kickcraft email',
      verificationTemplate(link),
    );
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.send(
      to,
      `Welcome to Kickcraft, ${name.split(' ')[0]}!`,
      welcomeTemplate(name),
    );
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    await this.send(
      to,
      'Reset your Kickcraft password',
      passwordResetTemplate(link),
    );
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

  async sendPasswordChangedNotification(
    to: string,
    name: string,
  ): Promise<void> {
    await this.send(
      to,
      'Your password was changed',
      passwordChangedTemplate(name),
    );
  }

  async sendOrderOutForDelivery(
    order: Order,
    agentName: string,
    agentPhone: string,
  ): Promise<void> {
    if (!order.email) return;
    await this.send(
      order.email,
      `Your order ${order.orderToken} is on its way!`,
      orderOutForDeliveryTemplate(order.orderToken, agentName, agentPhone),
    );
  }

  async sendAgentAssignment(agentEmail: string, order: Order): Promise<void> {
    await this.send(
      agentEmail,
      `New delivery assigned — ${order.orderToken}`,
      agentAssignmentTemplate(order),
    );
  }

  async sendAdminNotification(
    to: string,
    type: string,
    message: string,
    metadata: Record<string, unknown>,
  ): Promise<void> {
    const subjectMap: Record<string, string> = {
      new_order: 'New order received',
      low_stock: 'Low stock alert',
      new_review: 'New review submitted',
      new_customer: 'New customer registered',
      failed_payment: 'Payment failed',
      return_request: 'Return request received',
    };
    const subject = subjectMap[type] ?? 'Kickcraft Admin Notification';
    const metaLines = Object.entries(metadata)
      .map(
        ([k, v]) =>
          `<tr><td style="color:#888;padding:2px 8px 2px 0">${k}</td><td>${String(v)}</td></tr>`,
      )
      .join('');
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <p style="font-size:16px;font-weight:600;margin-bottom:8px">${message}</p>
        ${metaLines ? `<table style="font-size:13px;border-collapse:collapse">${metaLines}</table>` : ''}
        <p style="margin-top:24px;font-size:12px;color:#888">Kickcraft Admin · kickcraft.com</p>
      </div>`;
    await this.send(to, subject, html);
  }
}
