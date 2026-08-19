import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { financeApi } from '../services/finance-api'
import type {
  Account,
  Category,
  CreateAccountData,
  CreateCategoryData,
  CreateTransactionData,
  FinancialTransaction,
} from '../types/finance'
import { FinanceContext } from './finance-context'

export function FinanceProvider({ children }: PropsWithChildren) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [accountsResponse, categoriesResponse, transactionsResponse] =
        await Promise.all([
          financeApi.listAccounts(),
          financeApi.listCategories(),
          financeApi.listTransactions(),
        ])

      setAccounts(accountsResponse.accounts)
      setCategories(categoriesResponse.categories)
      setTransactions(transactionsResponse.transactions)
      setError(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar seus dados financeiros.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    Promise.all([
      financeApi.listAccounts(),
      financeApi.listCategories(),
      financeApi.listTransactions(),
    ])
      .then(
        ([accountsResponse, categoriesResponse, transactionsResponse]) => {
          if (!active) return

          setAccounts(accountsResponse.accounts)
          setCategories(categoriesResponse.categories)
          setTransactions(transactionsResponse.transactions)
          setError(null)
        },
      )
      .catch((requestError: unknown) => {
        if (!active) return

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar seus dados financeiros.',
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      accounts,
      categories,
      transactions,
      loading,
      error,
      refresh: () => loadData(),
      async createAccount(data: CreateAccountData) {
        await financeApi.createAccount(data)
        await loadData()
      },
      async setAccountActive(accountId: string, active: boolean) {
        await financeApi.updateAccount(accountId, { active })
        await loadData()
      },
      async createCategory(data: CreateCategoryData) {
        await financeApi.createCategory(data)
        await loadData()
      },
      async setCategoryActive(categoryId: string, active: boolean) {
        await financeApi.updateCategory(categoryId, { active })
        await loadData()
      },
      async createTransaction(data: CreateTransactionData) {
        await financeApi.createTransaction(data)
        await loadData()
      },
      async cancelTransaction(transactionId: string) {
        await financeApi.cancelTransaction(transactionId)
        await loadData()
      },
    }),
    [accounts, categories, error, loadData, loading, transactions],
  )

  return <FinanceContext value={value}>{children}</FinanceContext>
}
