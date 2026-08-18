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
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  configuration: Record<string, unknown>,
): Environment {
  return environmentSchema.parse(configuration);
}
