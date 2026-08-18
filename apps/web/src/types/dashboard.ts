export interface FinancialSummary {
  label: string
  value: string
  variation: string
  tone: 'neutral' | 'positive' | 'negative'
}

export interface RecentTransaction {
  id: string
  description: string
  category: string
  date: string
  amount: string
  type: 'income' | 'expense'
}
