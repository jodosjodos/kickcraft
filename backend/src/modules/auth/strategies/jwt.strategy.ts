import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { Session } from '../session.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  name: string;
  jti: string;
  phone?: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  name: string;
  jti: string;
  phone?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null =>
          (req.cookies as Record<string, string>)?.access_token ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    if (!payload.jti) throw new UnauthorizedException('Invalid session');

    const session = await this.sessionRepo.findOne({
      where: { id: payload.jti, isActive: true },
    });
    if (!session) throw new UnauthorizedException('Session expired or revoked');

    await this.sessionRepo.update({ id: payload.jti }, { lastSeenAt: new Date() });

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      jti: payload.jti,
      phone: payload.phone,
    };
  }
}
