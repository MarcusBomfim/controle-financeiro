import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import type { LoginInput, RegisterInput } from './auth.schemas';
import type { AuthResult, AuthUser } from './auth.types';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';

function toAuthUser(user: {
  id: string;
  fullName: string;
  email: string;
}): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
}

@Injectable()
export class AuthService {
  private readonly dummyPasswordHash: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly sessionService: SessionService,
  ) {
    this.dummyPasswordHash = this.passwordService.hash(
      'Senha-temporaria-interna-4827',
    );
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    const passwordHash = await this.passwordService.hash(input.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          passwordHash,
        },
      });
      const sessionToken = await this.sessionService.create(user.id);

      return { user: toAuthUser(user), sessionToken };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe uma conta com este e-mail.');
      }

      throw error;
    }
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    const passwordHash = user?.passwordHash ?? (await this.dummyPasswordHash);
    const passwordMatches = await this.passwordService.verify(
      input.password,
      passwordHash,
    );

    if (!user || !user.active || !passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const sessionToken = await this.sessionService.create(user.id);
    return { user: toAuthUser(user), sessionToken };
  }
}
