import {
  ChevronRight,
  CircleAlert,
  Landmark,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { useFinance } from '../contexts/finance-context'
import { AccountFormModal } from '../features/accounts/components/AccountFormModal'
import { SummaryCard } from '../features/dashboard/components/SummaryCard'
import { TransactionFormModal } from '../features/transactions/components/TransactionFormModal'
import type { FinancialSummary } from '../types/dashboard'
import { formatCurrency, formatShortDate } from '../utils/formatters'

function isCurrentMonth(date: string) {
  const value = new Date(date)
  const today = new Date()

  return (
    value.getMonth() === today.getMonth() &&
    value.getFullYear() === today.getFullYear()
  )
}

export function DashboardPage() {
  const { accounts, transactions, loading, error, refresh } = useFinance()
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)

  const activeAccounts = accounts.filter((account) => account.active)
  const completedCurrentMonth = transactions.filter(
    (transaction) =>
      transaction.status === 'COMPLETED' &&
      isCurrentMonth(transaction.occurredAt),
  )

  const totalBalance = activeAccounts.reduce(
    (total, account) => total + account.currentBalanceInCents,
    0,
  )
  const income = completedCurrentMonth
    .filter((transaction) => transaction.type === 'INCOME')
    .reduce((total, transaction) => total + transaction.amountInCents, 0)
  const expenses = completedCurrentMonth
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((total, transaction) => total + transaction.amountInCents, 0)

  const summaries: FinancialSummary[] = [
    {
      label: 'Saldo total',
      value: formatCurrency(totalBalance),
      variation: `${activeAccounts.length} conta${activeAccounts.length === 1 ? '' : 's'} ativa${activeAccounts.length === 1 ? '' : 's'}`,
      tone: 'neutral',
    },
    {
      label: 'Receitas no mês',
      value: formatCurrency(income),
      variation: `${completedCurrentMonth.filter((item) => item.type === 'INCOME').length} lançamento(s) concluído(s)`,
      tone: 'positive',
    },
    {
      label: 'Despesas no mês',
      value: formatCurrency(expenses),
      variation:
        income > 0
          ? `${Math.round((expenses / income) * 100)}% das receitas do mês`
          : 'Sem comparação com receitas',
      tone: 'negative',
    },
  ]

  const recentTransactions = useMemo(
    () => transactions.filter((item) => item.status !== 'CANCELED').slice(0, 5),
    [transactions],
  )

  return (
    <AppShell title="Visão geral">
      <section className="hero-panel">
        <div>
          <span className="eyebrow eyebrow--light">Organização financeira</span>
          <h2>Seu dinheiro, com mais clareza.</h2>
          <p>
            Os valores desta página agora são calculados a partir das suas
            contas e movimentações cadastradas.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            activeAccounts.length > 0
              ? setTransactionModalOpen(true)
              : setAccountModalOpen(true)
          }
        >
          <Plus size={18} aria-hidden="true" />
          {activeAccounts.length > 0 ? 'Nova movimentação' : 'Cadastrar conta'}
        </button>
      </section>

      {error && (
        <div className="data-alert" role="alert">
          <CircleAlert size={19} />
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()}>
            <RefreshCw size={15} /> Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <div className="content-loading">
          <RefreshCw className="spin" size={21} />
          Carregando dados financeiros...
        </div>
      ) : (
        <>
          <section className="summary-grid" aria-label="Resumo financeiro">
            {summaries.map((summary) => (
              <SummaryCard key={summary.label} summary={summary} />
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="panel transactions-panel">
              <div className="panel__header">
                <div>
                  <span className="eyebrow">Histórico financeiro</span>
                  <h2>Movimentações recentes</h2>
                </div>
                <Link to="/movimentacoes">
                  Ver todas <ChevronRight size={17} />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="empty-state">
                  <strong>Nenhuma movimentação cadastrada</strong>
                  <p>
                    Registre sua primeira receita ou despesa para visualizar o
                    resumo financeiro.
                  </p>
                  {activeAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTransactionModalOpen(true)}
                    >
                      <Plus size={16} /> Nova movimentação
                    </button>
                  )}
                </div>
              ) : (
                <div className="transaction-list">
                  {recentTransactions.map((transaction) => (
                    <div className="transaction" key={transaction.id}>
                      <span
                        className={`transaction__mark transaction__mark--${transaction.type.toLowerCase()}`}
                        style={{
                          '--category-color':
                            transaction.category?.color ?? '#3978a8',
                        } as CSSProperties}
                      >
                        {transaction.description.charAt(0).toUpperCase()}
                      </span>
                      <div className="transaction__details">
                        <strong>{transaction.description}</strong>
                        <small>
                          {transaction.category?.name ??
                            `${transaction.account.name} → ${transaction.destinationAccount?.name ?? ''}`}
                        </small>
                      </div>
                      <time>{formatShortDate(transaction.occurredAt)}</time>
                      <strong
                        className={`transaction__amount transaction__amount--${transaction.type.toLowerCase()}`}
                      >
                        {transaction.type === 'INCOME'
                          ? '+ '
                          : transaction.type === 'EXPENSE'
                            ? '- '
                            : ''}
                        {formatCurrency(transaction.amountInCents)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="panel accounts-overview">
              <div className="panel__header">
                <div>
                  <span className="eyebrow">Patrimônio</span>
                  <h2>Suas contas</h2>
                </div>
                <Link to="/contas">
                  Gerenciar <ChevronRight size={17} />
                </Link>
              </div>

              {activeAccounts.length === 0 ? (
                <div className="empty-state">
                  <Landmark size={28} />
                  <strong>Comece por uma conta</strong>
                  <p>Cadastre sua conta principal, carteira ou investimento.</p>
                  <button
                    type="button"
                    onClick={() => setAccountModalOpen(true)}
                  >
                    <Plus size={16} /> Cadastrar conta
                  </button>
                </div>
              ) : (
                <div className="account-balance-list">
                  {activeAccounts.slice(0, 4).map((account) => (
                    <div key={account.id}>
                      <span>
                        <i aria-hidden="true" />
                        {account.name}
                      </span>
                      <strong>
                        {formatCurrency(account.currentBalanceInCents)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </>
      )}

      <TransactionFormModal
        open={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
      />
      <AccountFormModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
    </AppShell>
  )
}
