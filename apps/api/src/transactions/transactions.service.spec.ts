import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../database/prisma.service';
import { TransactionsService } from './transactions.service';

const input = {
  accountId: 'cc4bf9e7-5ac1-4ba0-86e3-ddae6d49b184',
  categoryId: '1b02df26-bbaf-4c15-93bc-ffb2e261fc43',
  description: 'Salário',
  amountInCents: 3500_00,
  type: 'INCOME' as const,
  status: 'COMPLETED' as const,
  occurredAt: '2026-08-18T12:00:00.000Z',
};

describe('TransactionsService', () => {
  it('impede lançamentos em uma conta que não pertence ao usuário', async () => {
    const prisma = {
      account: { findFirst: jest.fn().mockResolvedValue(null) },
    } as unknown as PrismaService;
    const service = new TransactionsService(prisma);

    await expect(service.create('user-1', input)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('impede categoria com tipo diferente da movimentação', async () => {
    const prisma = {
      account: {
        findFirst: jest.fn().mockResolvedValue({ id: input.accountId }),
      },
      category: {
        findFirst: jest.fn().mockResolvedValue({ type: 'EXPENSE' }),
      },
    } as unknown as PrismaService;
    const service = new TransactionsService(prisma);

    await expect(service.create('user-1', input)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
