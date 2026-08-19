import { apiRequest } from './api'
import type {
  Account,
  Budget,
  Category,
  CreateAccountData,
  CreateCategoryData,
  CreateTransactionData,
  DashboardOverview,
  FinancialTransaction,
  TransactionFilters,
  UpsertBudgetData,
} from '../types/finance'

interface AccountsResponse {
  accounts: Account[]
}

interface CategoriesResponse {
  categories: Category[]
}

interface TransactionsResponse {
  transactions: FinancialTransaction[]
}

interface BudgetsResponse {
  budgets: Budget[]
}

function createQuery(
  values: Record<string, string | number | undefined>,
) {
  const query = new URLSearchParams()

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  })

  return query.toString()
}

export const financeApi = {
  listAccounts: () => apiRequest<AccountsResponse>('/accounts'),
  createAccount: (data: CreateAccountData) =>
    apiRequest<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAccount: (accountId: string, data: { active: boolean }) =>
    apiRequest<Account>(`/accounts/${accountId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  listCategories: () => apiRequest<CategoriesResponse>('/categories'),
  createCategory: (data: CreateCategoryData) =>
    apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (categoryId: string, data: { active: boolean }) =>
    apiRequest<Category>(`/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  listTransactions: (filters: TransactionFilters = {}) =>
    apiRequest<TransactionsResponse>(
      `/transactions?${createQuery({ ...filters, limit: 100 })}`,
    ),
  createTransaction: (data: CreateTransactionData) =>
    apiRequest<FinancialTransaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  cancelTransaction: (transactionId: string) =>
    apiRequest<FinancialTransaction>(
      `/transactions/${transactionId}/cancel`,
      { method: 'PATCH' },
    ),
  listBudgets: (year: number, month: number) =>
    apiRequest<BudgetsResponse>(
      `/budgets?${createQuery({ year, month })}`,
    ),
  upsertBudget: (data: UpsertBudgetData) =>
    apiRequest<Budget>('/budgets', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteBudget: (budgetId: string) =>
    apiRequest<void>(`/budgets/${budgetId}`, { method: 'DELETE' }),
  getDashboard: (year: number, month: number) =>
    apiRequest<DashboardOverview>(
      `/dashboard?${createQuery({ year, month })}`,
    ),
}
