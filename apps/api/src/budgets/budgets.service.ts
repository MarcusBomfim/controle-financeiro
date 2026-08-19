import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MonthQuery } from '../common/schemas/month.schema';
import { getMonthRange } from '../common/schemas/month.schema';
import { PrismaService } from '../database/prisma.service';
import type { UpsertBudgetInput } from './budgets.schemas';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: MonthQuery) {
    const budgets = await this.prisma.budget.findMany({
      where: { ownerId, year: query.year, month: query.month },
      include: {
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
      orderBy: { category: { name: 'asc' } },
    });

    if (budgets.length === 0) {
      return [];
    }

    const { start, end } = getMonthRange(query.year, query.month);
    const spentByCategory = await this.prisma.financialTransaction.groupBy({
      by: ['categoryId'],
      where: {
        ownerId,
        categoryId: { in: budgets.map((budget) => budget.categoryId) },
        type: 'EXPENSE',
        status: 'COMPLETED',
        occurredAt: { gte: start, lt: end },
      },
      _sum: { amountInCents: true },
    });
    const spentMap = new Map(
      spentByCategory.map((item) => [
        item.categoryId,
        item._sum.amountInCents ?? 0,
      ]),
    );

    return budgets.map((budget) => {
      const spentInCents = spentMap.get(budget.categoryId) ?? 0;

      return {
        ...budget,
        spentInCents,
        remainingInCents: budget.limitInCents - spentInCents,
        usagePercentage: Math.round((spentInCents / budget.limitInCents) * 100),
      };
    });
  }

  async upsert(ownerId: string, input: UpsertBudgetInput) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: input.categoryId,
        ownerId,
        type: 'EXPENSE',
        active: true,
      },
      select: { id: true },
    });

    if (!category) {
      throw new BadRequestException(
        'Selecione uma categoria de despesa ativa.',
      );
    }

    return this.prisma.budget.upsert({
      where: {
        ownerId_categoryId_year_month: {
          ownerId,
          categoryId: input.categoryId,
          year: input.year,
          month: input.month,
        },
      },
      update: { limitInCents: input.limitInCents },
      create: { ...input, ownerId },
    });
  }

  async remove(ownerId: string, budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, ownerId },
      select: { id: true },
    });

    if (!budget) {
      throw new NotFoundException('Orçamento não encontrado.');
    }

    await this.prisma.budget.delete({ where: { id: budgetId } });
  }
}
