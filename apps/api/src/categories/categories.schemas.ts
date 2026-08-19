import { z } from 'zod';

export const categoryTypeSchema = z.enum(['INCOME', 'EXPENSE']);

const colorSchema = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i, 'Informe uma cor hexadecimal válida.');

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(100, 'O nome deve possuir no máximo 100 caracteres.'),
  type: categoryTypeSchema,
  color: colorSchema,
  icon: z
    .string()
    .trim()
    .min(2)
    .max(50, 'O identificador do ícone é muito longo.'),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ active: z.boolean().optional() })
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
