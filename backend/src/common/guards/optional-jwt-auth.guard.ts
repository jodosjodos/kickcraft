import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Never throw — just set req.user to undefined when token is absent/invalid
  handleRequest<T>(_err: unknown, user: T): T {
    return user;
  }
}
