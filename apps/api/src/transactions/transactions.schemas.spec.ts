import { createTransactionSchema } from './transactions.schemas';

const baseInput = {
  accountId: 'cc4bf9e7-5ac1-4ba0-86e3-ddae6d49b184',
  description: 'Mercado',
  amountInCents: 25990,
  status: 'COMPLETED' as const,
  occurredAt: '2026-08-18T12:00:00.000Z',
};

describe('createTransactionSchema', () => {
  it('aceita uma despesa com categoria', () => {
    const result = createTransactionSchema.safeParse({
      ...baseInput,
      type: 'EXPENSE',
      categoryId: '1b02df26-bbaf-4c15-93bc-ffb2e261fc43',
    });

    expect(result.success).toBe(true);
  });

  it('rejeita uma transferência para a mesma conta', () => {
    const result = createTransactionSchema.safeParse({
      ...baseInput,
      type: 'TRANSFER',
      destinationAccountId: baseInput.accountId,
    });

    expect(result.success).toBe(false);
  });

  it('rejeita receita sem categoria', () => {
    const result = createTransactionSchema.safeParse({
      ...baseInput,
      type: 'INCOME',
    });

    expect(result.success).toBe(false);
  });
});
