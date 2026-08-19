import { createContext, use } from 'react'
import type {
  Account,
  Category,
  CreateAccountData,
  CreateCategoryData,
  CreateTransactionData,
  FinancialTransaction,
} from '../types/finance'

export interface FinanceContextValue {
  accounts: Account[]
  categories: Category[]
  transactions: FinancialTransaction[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createAccount: (data: CreateAccountData) => Promise<void>
  setAccountActive: (accountId: string, active: boolean) => Promise<void>
  createCategory: (data: CreateCategoryData) => Promise<void>
  setCategoryActive: (categoryId: string, active: boolean) => Promise<void>
  createTransaction: (data: CreateTransactionData) => Promise<void>
  cancelTransaction: (transactionId: string) => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)

export function useFinance() {
  const context = use(FinanceContext)

  if (!context) {
    throw new Error('useFinance deve ser utilizado dentro de FinanceProvider.')
  }

  return context
}
