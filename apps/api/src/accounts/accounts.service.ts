import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from './accounts.schemas';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { ownerId },
      include: {
        transactions: {
          where: { status: 'COMPLETED' },
          select: { amountInCents: true, type: true },
        },
        incomingTransfers: {
          where: { status: 'COMPLETED', type: 'TRANSFER' },
          select: { amountInCents: true },
        },
      },
      orderBy: [{ active: 'desc' }, { createdAt: 'asc' }],
    });

    return accounts.map(({ transactions, incomingTransfers, ...account }) => {
      const outgoingBalance = transactions.reduce((balance, transaction) => {
        if (transaction.type === 'INCOME') {
          return balance + transaction.amountInCents;
        }

        return balance - transaction.amountInCents;
      }, account.initialBalanceInCents);

      const currentBalanceInCents = incomingTransfers.reduce(
        (balance, transaction) => balance + transaction.amountInCents,
        outgoingBalance,
      );

      return { ...account, currentBalanceInCents };
    });
  }

  create(ownerId: string, input: CreateAccountInput) {
    return this.prisma.account.create({
      data: { ...input, ownerId },
    });
  }

  async update(ownerId: string, accountId: string, input: UpdateAccountInput) {
    await this.ensureOwnership(ownerId, accountId);

    return this.prisma.account.update({
      where: { id: accountId },
      data: input,
    });
  }

  private async ensureOwnership(ownerId: string, accountId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, ownerId },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada.');
    }
  }
}
