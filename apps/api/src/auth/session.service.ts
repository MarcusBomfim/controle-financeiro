import { createHash, randomBytes } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import type { Environment } from '../config/environment';
import { PrismaService } from '../database/prisma.service';
import type { AuthUser } from './auth.types';

export const SESSION_COOKIE_NAME = 'finance_session';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class SessionService {
  private readonly durationInMilliseconds: number;
  private readonly cookieSecure: boolean;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService<Environment, true>,
  ) {
    const durationInHours = configService.get('SESSION_TTL_HOURS', {
      infer: true,
    });

    this.durationInMilliseconds = durationInHours * 60 * 60 * 1000;
    this.cookieSecure = configService.get('COOKIE_SECURE', { infer: true });
  }

  async create(userId: string) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.durationInMilliseconds);

    await this.prisma.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });

    await this.prisma.session.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expiresAt,
      },
    });

    return token;
  }

  async delete(token: string) {
    await this.prisma.session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }

  async findUser(token: string): Promise<AuthUser | null> {
    const session = await this.prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    });

    if (!session || session.expiresAt <= new Date() || !session.user.active) {
      if (session) {
        await this.prisma.session.delete({ where: { id: session.id } });
      }

      return null;
    }

    return {
      id: session.user.id,
      fullName: session.user.fullName,
      email: session.user.email,
    };
  }

  getToken(request: Request) {
    const cookies: unknown = request.cookies;

    if (!cookies || typeof cookies !== 'object') {
      return null;
    }

    const token = (cookies as Record<string, unknown>)[SESSION_COOKIE_NAME];
    return typeof token === 'string' && token.length > 0 ? token : null;
  }

  setCookie(response: Response, token: string) {
    response.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: 'strict',
      path: '/',
      maxAge: this.durationInMilliseconds,
    });
  }

  clearCookie(response: Response) {
    response.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: this.cookieSecure,
      sameSite: 'strict',
      path: '/',
    });
  }
}
