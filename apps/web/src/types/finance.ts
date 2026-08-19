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

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  accountId?: string
  from?: string
  to?: string
}

export interface Budget {
  id: string
  categoryId: string
  year: number
  month: number
  limitInCents: number
  spentInCents: number
  remainingInCents: number
  usagePercentage: number
  category: TransactionCategory
}

export interface UpsertBudgetData {
  categoryId: string
  year: number
  month: number
  limitInCents: number
}

export interface DashboardOverview {
  period: { year: number; month: number }
  summary: {
    totalBalanceInCents: number
    incomeInCents: number
    expenseInCents: number
    netInCents: number
    activeAccounts: number
    completedTransactions: number
  }
  cashFlow: Array<{
    date: string
    day: string
    incomeInCents: number
    expenseInCents: number
  }>
  categoryBreakdown: Array<{
    categoryId: string
    name: string
    color: string
    amountInCents: number
  }>
  budget: {
    count: number
    limitInCents: number
    spentInCents: number
    remainingInCents: number
    usagePercentage: number
  }
  recentTransactions: FinancialTransaction[]
}
