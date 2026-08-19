import { z } from 'zod';

export const accountTypeSchema = z.enum([
  'CHECKING',
  'SAVINGS',
  'CASH',
  'INVESTMENT',
]);

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(100, 'O nome deve possuir no máximo 100 caracteres.'),
  type: accountTypeSchema,
  initialBalanceInCents: z
    .number()
    .int('O saldo inicial deve ser informado em centavos.')
    .min(-2_000_000_000)
    .max(2_000_000_000),
});

export const updateAccountSchema = createAccountSchema
  .partial()
  .extend({ active: z.boolean().optional() })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
