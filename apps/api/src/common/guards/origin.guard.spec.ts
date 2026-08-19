import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { Environment } from '../../config/environment';
import { OriginGuard } from './origin.guard';

function createContext(method: string, origin?: string) {
  const request = {
    method,
    get: jest.fn().mockReturnValue(origin),
  } as unknown as Request;

  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('OriginGuard', () => {
  const configService = {
    get: jest.fn().mockReturnValue('http://localhost:5173'),
  } as unknown as ConfigService<Environment, true>;
  const guard = new OriginGuard(configService);

  it('permite operações de leitura independentemente da origem', () => {
    expect(
      guard.canActivate(createContext('GET', 'https://site-externo.com')),
    ).toBe(true);
  });

  it('permite escrita originada pela interface configurada', () => {
    expect(
      guard.canActivate(createContext('POST', 'http://localhost:5173')),
    ).toBe(true);
  });

  it('bloqueia escrita originada por outro site', () => {
    expect(() =>
      guard.canActivate(createContext('POST', 'https://site-externo.com')),
    ).toThrow(ForbiddenException);
  });
});
