interface DashboardTransaction {
  amountInCents: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  occurredAt: Date;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}

export function buildCashFlowSeries(transactions: DashboardTransaction[]) {
  const days = new Map<
    string,
    { date: string; day: string; incomeInCents: number; expenseInCents: number }
  >();

  transactions.forEach((transaction) => {
    const date = transaction.occurredAt.toISOString().slice(0, 10);
    const current = days.get(date) ?? {
      date,
      day: date.slice(8, 10),
      incomeInCents: 0,
      expenseInCents: 0,
    };

    if (transaction.type === 'INCOME') {
      current.incomeInCents += transaction.amountInCents;
    } else if (transaction.type === 'EXPENSE') {
      current.expenseInCents += transaction.amountInCents;
    }

    days.set(date, current);
  });

  return [...days.values()].sort((first, second) =>
    first.date.localeCompare(second.date),
  );
}

export function buildCategoryBreakdown(transactions: DashboardTransaction[]) {
  const categories = new Map<
    string,
    { categoryId: string; name: string; color: string; amountInCents: number }
  >();

  transactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .forEach((transaction) => {
      const category = transaction.category ?? {
        id: 'uncategorized',
        name: 'Sem categoria',
        color: '#74838a',
      };
      const current = categories.get(category.id) ?? {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        amountInCents: 0,
      };

      current.amountInCents += transaction.amountInCents;
      categories.set(category.id, current);
    });

  return [...categories.values()].sort(
    (first, second) => second.amountInCents - first.amountInCents,
  );
}
