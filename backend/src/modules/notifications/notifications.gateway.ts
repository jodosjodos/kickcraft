import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Notification } from './notification.entity';

interface JwtPayload {
  sub: string;
  role: string;
}

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    try {
      const cookieHeader = client.handshake.headers.cookie ?? '';
      const token = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('access_token='))
        ?.split('=')
        .slice(1)
        .join('=');

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      if (payload.role !== 'admin') {
        client.disconnect();
        return;
      }

      void client.join(`admin:${payload.sub}`);
      this.logger.log(`Admin ${payload.sub} connected`);
    } catch {
      client.disconnect();
    }
  }

  emitToAdmin(adminId: string, notification: Notification): void {
    this.server.to(`admin:${adminId}`).emit('notification', notification);
  }
}
