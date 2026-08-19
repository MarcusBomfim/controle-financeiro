import {
  ChevronRight,
  CircleAlert,
  Plus,
  RefreshCw,
  Target,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { useFinance } from '../contexts/finance-context'
import { AccountFormModal } from '../features/accounts/components/AccountFormModal'
import { CashFlowChart } from '../features/dashboard/components/CashFlowChart'
import { CategoryChart } from '../features/dashboard/components/CategoryChart'
import { SummaryCard } from '../features/dashboard/components/SummaryCard'
import { TransactionFormModal } from '../features/transactions/components/TransactionFormModal'
import { financeApi } from '../services/finance-api'
import type { FinancialSummary } from '../types/dashboard'
import type { DashboardOverview } from '../types/finance'
import { formatCurrency, formatShortDate } from '../utils/formatters'

const today = new Date()
const currentPeriod = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, '0')}`

function formatPeriod(period: string) {
  const [year, month] = period.split('-').map(Number)

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
}

export function DashboardPage() {
  const {
    accounts,
    transactions,
    loading: financeLoading,
    error: financeError,
    refresh,
  } = useFinance()
  const [period, setPeriod] = useState(currentPeriod)
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [overviewError, setOverviewError] = useState<string | null>(null)
  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const activeAccounts = accounts.filter((account) => account.active)

  useEffect(() => {
    let active = true
    const [year, month] = period.split('-').map(Number)

    financeApi
      .getDashboard(year, month)
      .then((response) => {
        if (!active) return
        setOverview(response)
        setOverviewError(null)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setOverviewError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar o resumo mensal.',
        )
      })
      .finally(() => {
        if (active) setOverviewLoading(false)
      })

    return () => {
      active = false
    }
  }, [period, transactions])

  const summaries: FinancialSummary[] = overview
    ? [
        {
          label: 'Saldo atual',
          value: formatCurrency(overview.summary.totalBalanceInCents),
          variation: `${overview.summary.activeAccounts} conta(s) ativa(s)`,
          tone: 'neutral',
        },
        {
          label: 'Receitas no período',
          value: formatCurrency(overview.summary.incomeInCents),
          variation: `${overview.summary.completedTransactions} movimentação(ões) concluída(s)`,
          tone: 'positive',
        },
        {
          label: 'Despesas no período',
          value: formatCurrency(overview.summary.expenseInCents),
          variation:
            overview.summary.netInCents >= 0
              ? `Resultado positivo de ${formatCurrency(overview.summary.netInCents)}`
              : `Resultado negativo de ${formatCurrency(Math.abs(overview.summary.netInCents))}`,
          tone: 'negative',
        },
      ]
    : []

  const loading = financeLoading || overviewLoading
  const error = financeError ?? overviewError

  return (
    <AppShell title="Visão geral">
      <section className="hero-panel">
        <div>
          <span className="eyebrow eyebrow--light">Organização financeira</span>
          <h2>Decisões melhores começam com clareza.</h2>
          <p>
            Analise receitas, despesas e limites mensais com informações
            calculadas diretamente dos seus lançamentos.
          </p>
        </div>
        <div className="hero-panel__actions">
          <label>
            <span>Período analisado</span>
            <input
              type="month"
              value={period}
              onChange={(event) => {
                if (!event.target.value) return
                setOverviewLoading(true)
                setPeriod(event.target.value)
              }}
            />
          </label>
          <button
            type="button"
            onClick={() =>
              activeAccounts.length > 0
                ? setTransactionModalOpen(true)
                : setAccountModalOpen(true)
            }
          >
            <Plus size={18} aria-hidden="true" />
            {activeAccounts.length > 0
              ? 'Nova movimentação'
              : 'Cadastrar conta'}
          </button>
        </div>
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
          Calculando o resumo de {formatPeriod(period)}...
        </div>
      ) : overview ? (
        <>
          <section className="summary-grid" aria-label="Resumo financeiro">
            {summaries.map((summary) => (
              <SummaryCard key={summary.label} summary={summary} />
            ))}
          </section>

          <section className="analytics-grid">
            <article className="panel cash-flow-panel">
              <div className="panel__header">
                <div>
                  <span className="eyebrow">{formatPeriod(period)}</span>
                  <h2>Fluxo de receitas e despesas</h2>
                </div>
                <div className="chart-key" aria-label="Legenda do gráfico">
                  <span><i className="chart-key__income" /> Receitas</span>
                  <span><i className="chart-key__expense" /> Despesas</span>
                </div>
              </div>
              <CashFlowChart data={overview.cashFlow} />
            </article>

            <article className="panel category-panel">
              <div className="panel__header">
                <div>
                  <span className="eyebrow">Distribuição</span>
                  <h2>Despesas por categoria</h2>
                </div>
              </div>
              <CategoryChart data={overview.categoryBreakdown} />
            </article>
          </section>

          <section className="dashboard-grid dashboard-grid--lower">
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

              {overview.recentTransactions.length === 0 ? (
                <div className="empty-state">
                  <strong>Nenhuma movimentação cadastrada</strong>
                  <p>Registre uma receita ou despesa para iniciar a análise.</p>
                </div>
              ) : (
                <div className="transaction-list">
                  {overview.recentTransactions.map((transaction) => (
                    <div className="transaction" key={transaction.id}>
                      <span
                        className={`transaction__mark transaction__mark--${transaction.type.toLowerCase()}`}
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

            <article className="panel budget-overview-panel">
              <div className="panel__header">
                <div>
                  <span className="eyebrow">Planejamento mensal</span>
                  <h2>Orçamentos</h2>
                </div>
                <Link to="/orcamentos">
                  Gerenciar <ChevronRight size={17} />
                </Link>
              </div>

              {overview.budget.count === 0 ? (
                <div className="empty-state">
                  <Target size={28} />
                  <strong>Planejamento ainda não criado</strong>
                  <p>Defina limites para acompanhar seus gastos por categoria.</p>
                  <Link className="inline-cta" to="/orcamentos">
                    Criar orçamento
                  </Link>
                </div>
              ) : (
                <>
                  <div
                    className="budget-chart"
                    style={{
                      background: `conic-gradient(${
                        overview.budget.usagePercentage > 100
                          ? '#d35757'
                          : 'var(--primary)'
                      } 0 ${Math.min(overview.budget.usagePercentage, 100)}%, #e7efed ${Math.min(overview.budget.usagePercentage, 100)}% 100%)`,
                    }}
                    aria-label={`${overview.budget.usagePercentage}% dos orçamentos utilizados`}
                  >
                    <div className="budget-chart__value">
                      <strong>{overview.budget.usagePercentage}%</strong>
                      <span>utilizado</span>
                    </div>
                  </div>

                  <div className="budget-values">
                    <div>
                      <span>Gasto</span>
                      <strong>
                        {formatCurrency(overview.budget.spentInCents)}
                      </strong>
                    </div>
                    <div>
                      <span>Planejado</span>
                      <strong>
                        {formatCurrency(overview.budget.limitInCents)}
                      </strong>
                    </div>
                  </div>
                </>
              )}
            </article>
          </section>
        </>
      ) : null}

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
