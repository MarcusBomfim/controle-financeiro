import {
  Ban,
  CircleAlert,
  Filter,
  Plus,
  ReceiptText,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { useFinance } from '../contexts/finance-context'
import { TransactionFormModal } from '../features/transactions/components/TransactionFormModal'
import { financeApi } from '../services/finance-api'
import type {
  FinancialTransaction,
  TransactionStatus,
  TransactionType,
} from '../types/finance'
import { formatCurrency, formatLongDate } from '../utils/formatters'

type TypeFilter = TransactionType | 'ALL'
type StatusFilter = TransactionStatus | 'ALL'

const today = new Date()
const currentPeriod = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, '0')}`

function getPeriodRange(period: string) {
  const [year, month] = period.split('-').map(Number)

  return {
    from: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
    to: new Date(Date.UTC(year, month, 1)).toISOString(),
  }
}

const statusLabels: Record<TransactionStatus, string> = {
  COMPLETED: 'Concluída',
  PENDING: 'Pendente',
  CANCELED: 'Cancelada',
}

export function TransactionsPage() {
  const {
    accounts,
    transactions,
    loading,
    error,
    refresh,
    cancelTransaction,
  } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [accountFilter, setAccountFilter] = useState('ALL')
  const [periodFilter, setPeriodFilter] = useState(currentPeriod)
  const [filteredTransactions, setFilteredTransactions] =
    useState<FinancialTransaction[]>(transactions)
  const [filterLoading, setFilterLoading] = useState(true)
  const [filterError, setFilterError] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const periodRange = periodFilter
      ? getPeriodRange(periodFilter)
      : { from: undefined, to: undefined }

    financeApi
      .listTransactions({
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        accountId: accountFilter === 'ALL' ? undefined : accountFilter,
        ...periodRange,
      })
      .then((response) => {
        if (!active) return
        setFilteredTransactions(response.transactions)
        setFilterError(null)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setFilterError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível aplicar os filtros.',
        )
      })
      .finally(() => {
        if (active) setFilterLoading(false)
      })

    return () => {
      active = false
    }
  }, [
    accountFilter,
    periodFilter,
    statusFilter,
    transactions,
    typeFilter,
  ])

  async function handleCancel(transactionId: string) {
    const confirmed = window.confirm(
      'Deseja cancelar esta movimentação? O saldo será recalculado.',
    )

    if (!confirmed) return

    setCancelingId(transactionId)
    setActionError(null)

    try {
      await cancelTransaction(transactionId)
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cancelar a movimentação.',
      )
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <AppShell title="Movimentações" eyebrow="Histórico financeiro">
      <section className="page-intro">
        <div>
          <h2>Entradas e saídas em um só lugar</h2>
          <p>
            Consulte seu histórico, filtre os lançamentos e registre novas
            movimentações.
          </p>
        </div>
        <button
          className="primary-action"
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={!accounts.some((account) => account.active)}
          title={
            accounts.some((account) => account.active)
              ? undefined
              : 'Cadastre uma conta ativa primeiro'
          }
        >
          <Plus size={17} /> Nova movimentação
        </button>
      </section>

      {(error || filterError || actionError) && (
        <div className="data-alert" role="alert">
          <CircleAlert size={19} />
          <span>{actionError ?? filterError ?? error}</span>
          {(error || filterError) && (
            <button
              type="button"
              onClick={() => {
                setFilterLoading(true)
                void refresh()
              }}
            >
              <RefreshCw size={15} /> Tentar novamente
            </button>
          )}
        </div>
      )}

      <section className="filter-bar" aria-label="Filtros das movimentações">
        <span>
          <Filter size={16} /> Filtrar
        </span>
        <label>
          <span>Tipo</span>
          <select
            value={typeFilter}
            onChange={(event) => {
              setFilterLoading(true)
              setTypeFilter(event.target.value as TypeFilter)
            }}
          >
            <option value="ALL">Todos</option>
            <option value="INCOME">Receitas</option>
            <option value="EXPENSE">Despesas</option>
            <option value="TRANSFER">Transferências</option>
          </select>
        </label>
        <label>
          <span>Período</span>
          <input
            type="month"
            value={periodFilter}
            onChange={(event) => {
              setFilterLoading(true)
              setPeriodFilter(event.target.value)
            }}
          />
        </label>
        <label>
          <span>Situação</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setFilterLoading(true)
              setStatusFilter(event.target.value as StatusFilter)
            }}
          >
            <option value="ALL">Todas</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="PENDING">Pendentes</option>
            <option value="CANCELED">Canceladas</option>
          </select>
        </label>
        <label>
          <span>Conta</span>
          <select
            value={accountFilter}
            onChange={(event) => {
              setFilterLoading(true)
              setAccountFilter(event.target.value)
            }}
          >
            <option value="ALL">Todas as contas</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="panel transaction-history">
        <div className="panel__header">
          <div>
            <span className="eyebrow">Resultados</span>
            <h2>
              {filteredTransactions.length}{' '}
              {filteredTransactions.length === 1
                ? 'movimentação'
                : 'movimentações'}
            </h2>
          </div>
        </div>

        {loading || filterLoading ? (
          <div className="content-loading content-loading--inside">
            <RefreshCw className="spin" size={21} />
            Carregando movimentações...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <ReceiptText size={30} />
            <strong>Nenhum resultado encontrado</strong>
            <p>Cadastre uma movimentação ou altere os filtros utilizados.</p>
          </div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Conta</th>
                  <th>Data</th>
                  <th>Situação</th>
                  <th>Valor</th>
                  <th>
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <span className="table-description">
                        <i
                          style={{
                            backgroundColor:
                              transaction.category?.color ?? '#3978a8',
                          }}
                        />
                        <span>
                          <strong>{transaction.description}</strong>
                          <small>
                            {transaction.category?.name ??
                              (transaction.type === 'TRANSFER'
                                ? 'Transferência'
                                : 'Sem categoria')}
                          </small>
                        </span>
                      </span>
                    </td>
                    <td>
                      {transaction.destinationAccount
                        ? `${transaction.account.name} → ${transaction.destinationAccount.name}`
                        : transaction.account.name}
                    </td>
                    <td>{formatLongDate(transaction.occurredAt)}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${transaction.status.toLowerCase()}`}
                      >
                        {statusLabels[transaction.status]}
                      </span>
                    </td>
                    <td
                      className={`table-amount table-amount--${transaction.type.toLowerCase()}`}
                    >
                      {transaction.type === 'INCOME'
                        ? '+ '
                        : transaction.type === 'EXPENSE'
                          ? '- '
                          : ''}
                      {formatCurrency(transaction.amountInCents)}
                    </td>
                    <td>
                      {transaction.status !== 'CANCELED' && (
                        <button
                          className="table-action"
                          type="button"
                          disabled={cancelingId === transaction.id}
                          onClick={() => void handleCancel(transaction.id)}
                          aria-label={`Cancelar ${transaction.description}`}
                          title="Cancelar movimentação"
                        >
                          <Ban size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AppShell>
  )
}
