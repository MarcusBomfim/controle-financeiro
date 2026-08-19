import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import type { MonthQuery } from '../common/schemas/month.schema';
import { getMonthRange } from '../common/schemas/month.schema';
import { PrismaService } from '../database/prisma.service';
import {
  buildCashFlowSeries,
  buildCategoryBreakdown,
} from './dashboard.calculations';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
  ) {}

  async getMonthlyOverview(ownerId: string, query: MonthQuery) {
    const { start, end } = getMonthRange(query.year, query.month);
    const [accounts, monthTransactions, recentTransactions, budgets] =
      await Promise.all([
        this.accountsService.findAll(ownerId),
        this.prisma.financialTransaction.findMany({
          where: {
            ownerId,
            status: 'COMPLETED',
            type: { in: ['INCOME', 'EXPENSE'] },
            occurredAt: { gte: start, lt: end },
          },
          select: {
            amountInCents: true,
            type: true,
            occurredAt: true,
            categoryId: true,
            category: {
              select: { id: true, name: true, color: true },
            },
          },
          orderBy: { occurredAt: 'asc' },
        }),
        this.prisma.financialTransaction.findMany({
          where: { ownerId, status: { not: 'CANCELED' } },
          include: {
            account: { select: { id: true, name: true } },
            destinationAccount: { select: { id: true, name: true } },
            category: {
              select: { id: true, name: true, color: true, icon: true },
            },
          },
          orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
          take: 5,
        }),
        this.prisma.budget.findMany({
          where: { ownerId, year: query.year, month: query.month },
          select: { categoryId: true, limitInCents: true },
        }),
      ]);

    const incomeInCents = monthTransactions
      .filter((transaction) => transaction.type === 'INCOME')
      .reduce((total, transaction) => total + transaction.amountInCents, 0);
    const expenseInCents = monthTransactions
      .filter((transaction) => transaction.type === 'EXPENSE')
      .reduce((total, transaction) => total + transaction.amountInCents, 0);
    const totalBalanceInCents = accounts
      .filter((account) => account.active)
      .reduce((total, account) => total + account.currentBalanceInCents, 0);
    const budgetCategoryIds = new Set(
      budgets.map((budget) => budget.categoryId),
    );
    const budgetLimitInCents = budgets.reduce(
      (total, budget) => total + budget.limitInCents,
      0,
    );
    const budgetSpentInCents = monthTransactions
      .filter(
        (transaction) =>
          transaction.type === 'EXPENSE' &&
          transaction.categoryId &&
          budgetCategoryIds.has(transaction.categoryId),
      )
      .reduce((total, transaction) => total + transaction.amountInCents, 0);

    return {
      period: query,
      summary: {
        totalBalanceInCents,
        incomeInCents,
        expenseInCents,
        netInCents: incomeInCents - expenseInCents,
        activeAccounts: accounts.filter((account) => account.active).length,
        completedTransactions: monthTransactions.length,
      },
      cashFlow: buildCashFlowSeries(monthTransactions),
      categoryBreakdown: buildCategoryBreakdown(monthTransactions),
      budget: {
        count: budgets.length,
        limitInCents: budgetLimitInCents,
        spentInCents: budgetSpentInCents,
        remainingInCents: budgetLimitInCents - budgetSpentInCents,
        usagePercentage:
          budgetLimitInCents > 0
            ? Math.round((budgetSpentInCents / budgetLimitInCents) * 100)
            : 0,
      },
      recentTransactions,
    };
  }
}
