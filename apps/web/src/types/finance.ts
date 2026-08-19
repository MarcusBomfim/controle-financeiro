export type AccountType = 'CHECKING' | 'SAVINGS' | 'CASH' | 'INVESTMENT'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELED'

export interface Account {
  id: string
  name: string
  type: AccountType
  initialBalanceInCents: number
  currentBalanceInCents: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  type: Exclude<TransactionType, 'TRANSFER'>
  color: string
  icon: string
  active: boolean
}

export interface TransactionAccount {
  id: string
  name: string
}

export interface TransactionCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface FinancialTransaction {
  id: string
  description: string
  amountInCents: number
  type: TransactionType
  status: TransactionStatus
  occurredAt: string
  account: TransactionAccount
  destinationAccount: TransactionAccount | null
  category: TransactionCategory | null
}

export interface CreateAccountData {
  name: string
  type: AccountType
  initialBalanceInCents: number
}

export interface CreateCategoryData {
  name: string
  type: Exclude<TransactionType, 'TRANSFER'>
  color: string
  icon: string
}

export interface CreateTransactionData {
  accountId: string
  destinationAccountId?: string | null
  categoryId?: string | null
  description: string
  amountInCents: number
  type: TransactionType
  status: Exclude<TransactionStatus, 'CANCELED'>
  occurredAt: string
}
