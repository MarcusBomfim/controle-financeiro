import { ChevronRight, LogOut, Plus } from 'lucide-react'
import { Sidebar } from '../components/layout/Sidebar'
import { useAuth } from '../contexts/auth-context'
import { SummaryCard } from '../features/dashboard/components/SummaryCard'
import {
  financialSummaries,
  recentTransactions,
} from '../features/dashboard/data/dashboard-data'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const firstName = user?.fullName.split(' ')[0] ?? 'Usuário'
  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Terça-feira, 18 de agosto</span>
            <h1>Visão geral</h1>
          </div>

          <div className="topbar__actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Sair da conta"
              title="Sair"
              onClick={() => void logout()}
            >
              <LogOut size={18} />
            </button>
            <div className="user-chip" aria-label="Usuário autenticado">
              <span>{initials}</span>
              <div>
                <strong>{firstName}</strong>
                <small>Conta pessoal</small>
              </div>
            </div>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <span className="eyebrow eyebrow--light">Organização financeira</span>
            <h2>Seu dinheiro, com mais clareza.</h2>
            <p>
              Acompanhe o que entra, entenda seus gastos e planeje os próximos meses.
            </p>
          </div>
          <button type="button" disabled title="Disponível na Parte 3">
            <Plus size={18} aria-hidden="true" />
            Nova movimentação
          </button>
        </section>

        <section className="summary-grid" aria-label="Resumo financeiro">
          {financialSummaries.map((summary) => (
            <SummaryCard key={summary.label} summary={summary} />
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel transactions-panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Agosto de 2026</span>
                <h2>Movimentações recentes</h2>
              </div>
              <button type="button" disabled>
                Ver todas <ChevronRight size={17} />
              </button>
            </div>

            <div className="transaction-list">
              {recentTransactions.map((transaction) => (
                <div className="transaction" key={transaction.id}>
                  <span className={`transaction__mark transaction__mark--${transaction.type}`}>
                    {transaction.description.charAt(0)}
                  </span>
                  <div className="transaction__details">
                    <strong>{transaction.description}</strong>
                    <small>{transaction.category}</small>
                  </div>
                  <time>{transaction.date}</time>
                  <strong className={`transaction__amount transaction__amount--${transaction.type}`}>
                    {transaction.amount}
                  </strong>
                </div>
              ))}
            </div>
          </article>

          <article className="panel budget-panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Limite mensal</span>
                <h2>Orçamento</h2>
              </div>
            </div>

            <div className="budget-chart" aria-label="55 por cento do orçamento utilizado">
              <div className="budget-chart__value">
                <strong>55%</strong>
                <span>utilizado</span>
              </div>
            </div>

            <div className="budget-values">
              <div>
                <span>Gasto</span>
                <strong>R$ 2.180</strong>
              </div>
              <div>
                <span>Disponível</span>
                <strong>R$ 1.820</strong>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
