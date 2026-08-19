import { LoaderCircle, Tags } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { useFinance } from '../../../contexts/finance-context'
import type { TransactionType } from '../../../types/finance'

interface CategoryFormModalProps {
  open: boolean
  onClose: () => void
}

type CategoryType = Exclude<TransactionType, 'TRANSFER'>

export function CategoryFormModal({
  open,
  onClose,
}: CategoryFormModalProps) {
  const { createCategory } = useFinance()
  const [name, setName] = useState('')
  const [type, setType] = useState<CategoryType>('EXPENSE')
  const [color, setColor] = useState('#087b64')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await createCategory({ name, type, color, icon: 'tag' })
      setName('')
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a categoria.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova categoria"
      description="Crie uma classificação para organizar suas movimentações."
    >
      <form className="resource-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Nome da categoria
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Assinaturas"
            minLength={2}
            maxLength={100}
            autoFocus
            required
          />
        </label>

        <div className="form-row">
          <label className="form-field">
            Tipo
            <select
              value={type}
              onChange={(event) => setType(event.target.value as CategoryType)}
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </label>

          <label className="form-field">
            Cor
            <span className="color-field">
              <input
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              />
              <span>{color.toUpperCase()}</span>
            </span>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="spin" size={18} />
          ) : (
            <Tags size={18} />
          )}
          {submitting ? 'Salvando...' : 'Cadastrar categoria'}
        </button>
      </form>
    </Modal>
  )
}
