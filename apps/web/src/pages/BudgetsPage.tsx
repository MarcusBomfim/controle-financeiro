import {
  CircleAlert,
  Plus,
  RefreshCw,
  Target,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { BudgetFormModal } from '../features/budgets/components/BudgetFormModal'
import { financeApi } from '../services/finance-api'
import type { Budget } from '../types/finance'
import { formatCurrency } from '../utils/formatters'

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

export function BudgetsPage() {
  const [period, setPeriod] = useState(currentPeriod)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const [year, month] = period.split('-').map(Number)

    try {
      const response = await financeApi.listBudgets(year, month)
      setBudgets(response.budgets)
      setError(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível carregar os orçamentos.',
      )
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    let active = true
    const [year, month] = period.split('-').map(Number)

    financeApi
      .listBudgets(year, month)
      .then((response) => {
        if (!active) return
        setBudgets(response.budgets)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível carregar os orçamentos.',
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [period])

  const summary = useMemo(
    () =>
      budgets.reduce(
        (result, budget) => ({
          limit: result.limit + budget.limitInCents,
          spent: result.spent + budget.spentInCents,
        }),
        { limit: 0, spent: 0 },
      ),
    [budgets],
  )

  async function handleDelete(budget: Budget) {
    const confirmed = window.confirm(
      `Deseja remover o planejamento de ${budget.category.name}?`,
    )

    if (!confirmed) return

    setDeletingId(budget.id)

    try {
      await financeApi.deleteBudget(budget.id)
      await reload()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível remover o orçamento.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AppShell title="Orçamentos" eyebrow="Planejamento mensal">
      <section className="page-intro">
        <div>
          <h2>Planeje antes de gastar</h2>
          <p>
            Defina limites por categoria e acompanhe automaticamente quanto
            ainda está disponível.
          </p>
        </div>
        <div className="page-intro__actions">
          <label className="period-field">
            <span>Período</span>
            <input
              type="month"
              value={period}
              onChange={(event) => {
                if (!event.target.value) return
                setLoading(true)
                setPeriod(event.target.value)
              }}
            />
          </label>
          <button
            className="primary-action"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={17} /> Planejar categoria
          </button>
        </div>
      </section>

      {error && (
        <div className="data-alert" role="alert">
          <CircleAlert size={19} />
          <span>{error}</span>
          <button type="button" onClick={() => void reload()}>
            <RefreshCw size={15} /> Tentar novamente
          </button>
        </div>
      )}

      <section className="budget-summary-grid">
        <article>
          <span>Planejado em {formatPeriod(period)}</span>
          <strong>{formatCurrency(summary.limit)}</strong>
        </article>
        <article>
          <span>Gasto nas categorias</span>
          <strong>{formatCurrency(summary.spent)}</strong>
        </article>
        <article>
          <span>Saldo do planejamento</span>
          <strong
            className={
              summary.limit - summary.spent < 0 ? 'negative-value' : ''
            }
          >
            {formatCurrency(summary.limit - summary.spent)}
          </strong>
        </article>
      </section>

      <section className="panel budgets-panel">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Limites por categoria</span>
            <h2>{formatPeriod(period)}</h2>
          </div>
          <span className="count-badge">{budgets.length}</span>
        </div>

        {loading ? (
          <div className="content-loading content-loading--inside">
            <RefreshCw className="spin" size={21} />
            Carregando planejamento...
          </div>
        ) : budgets.length === 0 ? (
          <div className="empty-state">
            <Target size={30} />
            <strong>Nenhum limite definido</strong>
            <p>
              Escolha uma categoria de despesa e informe quanto pretende gastar
              durante o mês.
            </p>
            <button type="button" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Criar planejamento
            </button>
          </div>
        ) : (
          <div className="budget-card-grid">
            {budgets.map((budget) => {
              const overLimit = budget.usagePercentage > 100
              const progress = Math.min(budget.usagePercentage, 100)

              return (
                <article
                  className={overLimit ? 'budget-card budget-card--over' : 'budget-card'}
                  key={budget.id}
                >
                  <header>
                    <span
                      style={{ backgroundColor: budget.category.color }}
                      aria-hidden="true"
                    />
                    <div>
                      <strong>{budget.category.name}</strong>
                      <small>
                        {budget.usagePercentage}% do limite utilizado
                      </small>
                    </div>
                    <button
                      type="button"
                      disabled={deletingId === budget.id}
                      onClick={() => void handleDelete(budget)}
                      aria-label={`Remover orçamento de ${budget.category.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </header>

                  <div className="budget-card__progress">
                    <span
                      style={{
                        width: `${progress}%`,
                        backgroundColor: overLimit
                          ? '#d35757'
                          : budget.category.color,
                      }}
                    />
                  </div>

                  <footer>
                    <div>
                      <span>Gasto</span>
                      <strong>{formatCurrency(budget.spentInCents)}</strong>
                    </div>
                    <div>
                      <span>Limite</span>
                      <strong>{formatCurrency(budget.limitInCents)}</strong>
                    </div>
                    <div>
                      <span>{overLimit ? 'Excedido' : 'Disponível'}</span>
                      <strong>
                        {formatCurrency(Math.abs(budget.remainingInCents))}
                      </strong>
                    </div>
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <BudgetFormModal
        open={modalOpen}
        period={period}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />
    </AppShell>
  )
}
