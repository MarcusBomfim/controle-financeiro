import type { PrismaService } from '../database/prisma.service';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  it('calcula o saldo com receitas, despesas e transferências concluídas', async () => {
    const findMany = jest.fn().mockResolvedValue([
      {
        id: 'account-1',
        ownerId: 'user-1',
        name: 'Conta principal',
        type: 'CHECKING',
        initialBalanceInCents: 100_00,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        transactions: [
          { type: 'INCOME', amountInCents: 500_00 },
          { type: 'EXPENSE', amountInCents: 125_00 },
          { type: 'TRANSFER', amountInCents: 50_00 },
        ],
        incomingTransfers: [{ amountInCents: 25_00 }],
      },
    ]);
    const prisma = {
      account: { findMany },
    } as unknown as PrismaService;
    const service = new AccountsService(prisma);

    const accounts = await service.findAll('user-1');

    expect(accounts[0].currentBalanceInCents).toBe(450_00);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ownerId: 'user-1' } }),
    );
  });
});
