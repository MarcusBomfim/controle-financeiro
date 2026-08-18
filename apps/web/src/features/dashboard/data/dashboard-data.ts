import type { FinancialSummary, RecentTransaction } from '../../../types/dashboard'

export const financialSummaries: FinancialSummary[] = [
  {
    label: 'Saldo total',
    value: 'R$ 8.450,00',
    variation: 'Atualizado hoje',
    tone: 'neutral',
  },
  {
    label: 'Receitas no mês',
    value: 'R$ 5.200,00',
    variation: '+8% em relação a julho',
    tone: 'positive',
  },
  {
    label: 'Despesas no mês',
    value: 'R$ 2.180,00',
    variation: '42% das receitas',
    tone: 'negative',
  },
]

export const recentTransactions: RecentTransaction[] = [
  {
    id: 'transaction-1',
    description: 'Salário',
    category: 'Receita principal',
    date: '05 ago',
    amount: '+ R$ 5.200,00',
    type: 'income',
  },
  {
    id: 'transaction-2',
    description: 'Supermercado',
    category: 'Alimentação',
    date: '08 ago',
    amount: '- R$ 486,90',
    type: 'expense',
  },
  {
    id: 'transaction-3',
    description: 'Conta de energia',
    category: 'Moradia',
    date: '10 ago',
    amount: '- R$ 214,60',
    type: 'expense',
  },
]
