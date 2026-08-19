import { z } from 'zod';

export const upsertBudgetSchema = z.object({
  categoryId: z.string().uuid('Selecione uma categoria válida.'),
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  limitInCents: z
    .number()
    .int('O limite deve ser informado em centavos.')
    .positive('O limite deve ser maior que zero.')
    .max(2_000_000_000),
});

export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;
