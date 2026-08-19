import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Prisma } from '../generated/prisma/client';
import type {
  CreateTransactionInput,
  TransactionQuery,
} from './transactions.schemas';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: TransactionQuery) {
    const where: Prisma.FinancialTransactionWhereInput = { ownerId };

    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    if (query.accountId) {
      where.OR = [
        { accountId: query.accountId },
        { destinationAccountId: query.accountId },
      ];
    }

    if (query.from || query.to) {
      where.occurredAt = {
        ...(query.from ? { gte: new Date(query.from) } : {}),
        ...(query.to ? { lt: new Date(query.to) } : {}),
      };
    }

    return this.prisma.financialTransaction.findMany({
      where,
      include: {
        account: { select: { id: true, name: true } },
        destinationAccount: { select: { id: true, name: true } },
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      take: query.limit,
    });
  }

  async create(ownerId: string, input: CreateTransactionInput) {
    const account = await this.prisma.account.findFirst({
      where: { id: input.accountId, ownerId, active: true },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundException('Conta de origem não encontrada ou inativa.');
    }

    if (input.type === 'TRANSFER') {
      await this.validateDestinationAccount(
        ownerId,
        input.destinationAccountId,
      );
    } else {
      await this.validateCategory(ownerId, input.categoryId, input.type);
    }

    return this.prisma.financialTransaction.create({
      data: {
        ownerId,
        accountId: input.accountId,
        destinationAccountId:
          input.type === 'TRANSFER' ? input.destinationAccountId : null,
        categoryId: input.type === 'TRANSFER' ? null : input.categoryId,
        description: input.description,
        amountInCents: input.amountInCents,
        type: input.type,
        status: input.status,
        occurredAt: new Date(input.occurredAt),
      },
      include: {
        account: { select: { id: true, name: true } },
        destinationAccount: { select: { id: true, name: true } },
        category: {
          select: { id: true, name: true, color: true, icon: true },
        },
      },
    });
  }

  async cancel(ownerId: string, transactionId: string) {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: { id: transactionId, ownerId },
      select: { id: true, status: true },
    });

    if (!transaction) {
      throw new NotFoundException('Movimentação não encontrada.');
    }

    if (transaction.status === 'CANCELED') {
      return transaction;
    }

    return this.prisma.financialTransaction.update({
      where: { id: transactionId },
      data: { status: 'CANCELED' },
    });
  }

  private async validateDestinationAccount(
    ownerId: string,
    destinationAccountId: string | null | undefined,
  ) {
    if (!destinationAccountId) {
      throw new BadRequestException('Selecione a conta de destino.');
    }

    const destination = await this.prisma.account.findFirst({
      where: { id: destinationAccountId, ownerId, active: true },
      select: { id: true },
    });

    if (!destination) {
      throw new NotFoundException(
        'Conta de destino não encontrada ou inativa.',
      );
    }
  }

  private async validateCategory(
    ownerId: string,
    categoryId: string | null | undefined,
    type: 'INCOME' | 'EXPENSE',
  ) {
    if (!categoryId) {
      throw new BadRequestException('Selecione uma categoria.');
    }

    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        ownerId,
        active: true,
      },
      select: { type: true },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada ou inativa.');
    }

    if (category.type !== type) {
      throw new BadRequestException(
        'A categoria não corresponde ao tipo da movimentação.',
      );
    }
  }
}
