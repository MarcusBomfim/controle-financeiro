import { apiRequest } from './api'
import type {
  Account,
  Category,
  CreateAccountData,
  CreateCategoryData,
  CreateTransactionData,
  FinancialTransaction,
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
  listTransactions: () =>
    apiRequest<TransactionsResponse>('/transactions?limit=100'),
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
}
