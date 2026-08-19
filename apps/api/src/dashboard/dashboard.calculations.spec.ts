import {
  buildCashFlowSeries,
  buildCategoryBreakdown,
} from './dashboard.calculations';

const transactions = [
  {
    amountInCents: 500_00,
    type: 'INCOME' as const,
    occurredAt: new Date('2026-08-05T12:00:00.000Z'),
    category: { id: 'salary', name: 'Salário', color: '#16896b' },
  },
  {
    amountInCents: 120_00,
    type: 'EXPENSE' as const,
    occurredAt: new Date('2026-08-05T15:00:00.000Z'),
    category: { id: 'food', name: 'Alimentação', color: '#dd7d3d' },
  },
  {
    amountInCents: 80_00,
    type: 'EXPENSE' as const,
    occurredAt: new Date('2026-08-10T12:00:00.000Z'),
    category: { id: 'food', name: 'Alimentação', color: '#dd7d3d' },
  },
];

describe('dashboard calculations', () => {
  it('agrupa entradas e saídas por dia', () => {
    expect(buildCashFlowSeries(transactions)).toEqual([
      {
        date: '2026-08-05',
        day: '05',
        incomeInCents: 500_00,
        expenseInCents: 120_00,
      },
      {
        date: '2026-08-10',
        day: '10',
        incomeInCents: 0,
        expenseInCents: 80_00,
      },
    ]);
  });

  it('soma despesas da mesma categoria', () => {
    expect(buildCategoryBreakdown(transactions)).toEqual([
      {
        categoryId: 'food',
        name: 'Alimentação',
        color: '#dd7d3d',
        amountInCents: 200_00,
      },
    ]);
  });
});
