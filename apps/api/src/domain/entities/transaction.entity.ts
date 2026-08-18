import type { TransactionStatus, TransactionType } from '../enums/finance.enum';

export interface FinancialTransaction {
  id: string;
  ownerId: string;
  accountId: string;
  destinationAccountId: string | null;
  categoryId: string | null;
  recurrenceId: string | null;
  description: string;
  amountInCents: number;
  type: TransactionType;
  status: TransactionStatus;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
