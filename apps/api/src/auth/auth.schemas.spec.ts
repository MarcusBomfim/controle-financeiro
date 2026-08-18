import { loginSchema, registerSchema } from './auth.schemas';

describe('auth schemas', () => {
  it('normalizes a valid registration', () => {
    const result = registerSchema.parse({
      fullName: '  Maria da Silva  ',
      email: 'MARIA@EXEMPLO.COM',
      password: 'senha-segura-123',
    });

    expect(result.fullName).toBe('Maria da Silva');
    expect(result.email).toBe('maria@exemplo.com');
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      fullName: 'Maria da Silva',
      email: 'maria@exemplo.com',
      password: '123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'email-invalido',
      password: 'senha',
    });

    expect(result.success).toBe(false);
  });
});
