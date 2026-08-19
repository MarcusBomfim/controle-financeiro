import { upsertBudgetSchema } from './budgets.schemas';

describe('upsertBudgetSchema', () => {
  it('aceita um limite mensal válido', () => {
    const result = upsertBudgetSchema.safeParse({
      categoryId: '1b02df26-bbaf-4c15-93bc-ffb2e261fc43',
      year: 2026,
      month: 8,
      limitInCents: 800_00,
    });

    expect(result.success).toBe(true);
  });

  it('rejeita limite igual a zero', () => {
    const result = upsertBudgetSchema.safeParse({
      categoryId: '1b02df26-bbaf-4c15-93bc-ffb2e261fc43',
      year: 2026,
      month: 8,
      limitInCents: 0,
    });

    expect(result.success).toBe(false);
  });
});
