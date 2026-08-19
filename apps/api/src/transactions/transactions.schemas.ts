import { z } from 'zod';

const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE', 'TRANSFER']);
const transactionStatusSchema = z.enum(['PENDING', 'COMPLETED']);

export const createTransactionSchema = z
  .object({
    accountId: z.string().uuid('Selecione uma conta válida.'),
    destinationAccountId: z
      .string()
      .uuid('Selecione uma conta de destino válida.')
      .nullable()
      .optional(),
    categoryId: z
      .string()
      .uuid('Selecione uma categoria válida.')
      .nullable()
      .optional(),
    description: z
      .string()
      .trim()
      .min(2, 'Informe uma descrição com pelo menos 2 caracteres.')
      .max(180, 'A descrição deve possuir no máximo 180 caracteres.'),
    amountInCents: z
      .number()
      .int('O valor deve ser informado em centavos.')
      .positive('O valor deve ser maior que zero.')
      .max(2_000_000_000),
    type: transactionTypeSchema,
    status: transactionStatusSchema.default('COMPLETED'),
    occurredAt: z.string().datetime({ offset: true }),
  })
  .superRefine((input, context) => {
    if (input.type === 'TRANSFER') {
      if (!input.destinationAccountId) {
        context.addIssue({
          code: 'custom',
          path: ['destinationAccountId'],
          message: 'Selecione a conta de destino.',
        });
      }

      if (input.destinationAccountId === input.accountId) {
        context.addIssue({
          code: 'custom',
          path: ['destinationAccountId'],
          message: 'As contas de origem e destino devem ser diferentes.',
        });
      }

      if (input.categoryId) {
        context.addIssue({
          code: 'custom',
          path: ['categoryId'],
          message: 'Transferências não utilizam categorias.',
        });
      }
    } else {
      if (!input.categoryId) {
        context.addIssue({
          code: 'custom',
          path: ['categoryId'],
          message: 'Selecione uma categoria.',
        });
      }

      if (input.destinationAccountId) {
        context.addIssue({
          code: 'custom',
          path: ['destinationAccountId'],
          message: 'Somente transferências possuem uma conta de destino.',
        });
      }
    }
  });

export const transactionQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELED']).optional(),
  accountId: z.string().uuid().optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(100),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
