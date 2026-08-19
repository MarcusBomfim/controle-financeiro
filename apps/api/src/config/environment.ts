import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  CLIENT_URL: z.url().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .startsWith('postgresql://')
    .default(
      'postgresql://finance_admin:finance_dev@localhost:5434/controle_financeiro?schema=public',
    ),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(8),
  RATE_LIMIT_TTL_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(3_600_000)
    .default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(10).max(10_000).default(120),
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  configuration: Record<string, unknown>,
): Environment {
  const environment = environmentSchema.parse(configuration);

  if (environment.NODE_ENV === 'production' && !environment.COOKIE_SECURE) {
    console.warn(
      'COOKIE_SECURE está desativado em produção. Ative-o quando utilizar HTTPS.',
    );
  }

  return environment;
}
