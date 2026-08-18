import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from './auth.types';
import { SessionService } from './session.service';

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.sessionService.getToken(request);

    if (!token) {
      throw new UnauthorizedException('Faça login para continuar.');
    }

    const user = await this.sessionService.findUser(token);

    if (!user) {
      throw new UnauthorizedException('Sua sessão expirou. Entre novamente.');
    }

    (request as AuthenticatedRequest).user = user;
    return true;
  }
}
