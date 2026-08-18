import type { TransactionType } from '../enums/finance.enum';

export interface Category {
  id: string;
  ownerId: string | null;
  name: string;
  type: TransactionType.INCOME | TransactionType.EXPENSE;
  color: string;
  icon: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
