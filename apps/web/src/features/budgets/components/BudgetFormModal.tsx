import { LoaderCircle, Target } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { useFinance } from '../../../contexts/finance-context'
import { financeApi } from '../../../services/finance-api'
import { toCents } from '../../../utils/formatters'

interface BudgetFormModalProps {
  open: boolean
  period: string
  onClose: () => void
  onSaved: () => Promise<void>
}

export function BudgetFormModal({
  open,
  period,
  onClose,
  onSaved,
}: BudgetFormModalProps) {
  const { categories } = useFinance()
  const [categoryId, setCategoryId] = useState('')
  const [limit, setLimit] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const expenseCategories = categories.filter(
    (category) => category.active && category.type === 'EXPENSE',
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const limitInCents = toCents(limit)

    if (!Number.isFinite(limitInCents) || limitInCents <= 0) {
      setError('Informe um limite maior que zero.')
      return
    }

    const [year, month] = period.split('-').map(Number)
    setSubmitting(true)

    try {
      await financeApi.upsertBudget({
        categoryId,
        year,
        month,
        limitInCents,
      })
      await onSaved()
      setCategoryId('')
      setLimit('')
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível salvar o orçamento.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Planejar categoria"
      description="Defina quanto pretende gastar nesta categoria durante o mês."
    >
      <form className="resource-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Categoria de despesa
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            autoFocus
            required
          >
            <option value="">Selecione uma categoria</option>
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Limite mensal
          <div className="money-input">
            <span>R$</span>
            <input
              inputMode="decimal"
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              placeholder="0,00"
              required
            />
          </div>
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <Target size={18} />
          )}
          {submitting ? 'Salvando...' : 'Salvar planejamento'}
        </button>
      </form>
    </Modal>
  )
}
