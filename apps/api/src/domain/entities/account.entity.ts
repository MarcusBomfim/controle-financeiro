import type { AccountType } from '../enums/finance.enum';

export interface Account {
  id: string;
  ownerId: string;
  name: string;
  type: AccountType;
  initialBalanceInCents: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
