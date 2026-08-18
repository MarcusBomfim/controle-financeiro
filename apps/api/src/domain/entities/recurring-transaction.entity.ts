import type {
  RecurrenceFrequency,
  TransactionType,
} from '../enums/finance.enum';

export interface RecurringTransaction {
  id: string;
  ownerId: string;
  accountId: string;
  destinationAccountId: string | null;
  categoryId: string | null;
  description: string;
  amountInCents: number;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  interval: number;
  nextOccurrenceAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
