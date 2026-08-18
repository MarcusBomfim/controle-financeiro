import { TransactionStatus, TransactionType } from '../enums/finance.enum';
import {
  calculateAccountBalance,
  validateTransactionDraft,
} from './transaction.rules';

describe('transaction rules', () => {
  it('accepts a valid expense', () => {
    const result = validateTransactionDraft({
      type: TransactionType.EXPENSE,
      amountInCents: 15_990,
      accountId: 'checking-account',
      categoryId: 'food-category',
    });

    expect(result).toEqual({ valid: true, errors: [] });
  });

  it('rejects a transfer to the same account', () => {
    const result = validateTransactionDraft({
      type: TransactionType.TRANSFER,
      amountInCents: 50_000,
      accountId: 'checking-account',
      destinationAccountId: 'checking-account',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'As contas de origem e destino devem ser diferentes.',
    );
  });

  it('calculates the balance using only completed movements', () => {
    const balance = calculateAccountBalance('checking-account', 100_000, [
      {
        type: TransactionType.INCOME,
        status: TransactionStatus.COMPLETED,
        amountInCents: 250_000,
        accountId: 'checking-account',
      },
      {
        type: TransactionType.EXPENSE,
        status: TransactionStatus.COMPLETED,
        amountInCents: 70_000,
        accountId: 'checking-account',
      },
      {
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PENDING,
        amountInCents: 20_000,
        accountId: 'checking-account',
      },
    ]);

    expect(balance).toBe(280_000);
  });
});
