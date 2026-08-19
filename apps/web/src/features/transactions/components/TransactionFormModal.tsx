import { ArrowLeftRight, LoaderCircle } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { useFinance } from '../../../contexts/finance-context'
import type {
  TransactionStatus,
  TransactionType,
} from '../../../types/finance'
import { toCents, toDateInputValue } from '../../../utils/formatters'

interface TransactionFormModalProps {
  open: boolean
  onClose: () => void
}

export function TransactionFormModal({
  open,
  onClose,
}: TransactionFormModalProps) {
  const { accounts, categories, createTransaction } = useFinance()
  const activeAccounts = accounts.filter((account) => account.active)
  const [type, setType] = useState<TransactionType>('EXPENSE')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [destinationAccountId, setDestinationAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] =
    useState<Exclude<TransactionStatus, 'CANCELED'>>('COMPLETED')
  const [occurredAt, setOccurredAt] = useState(toDateInputValue())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const availableCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.active && category.type === type,
      ),
    [categories, type],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const amountInCents = toCents(amount)

    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }

    setSubmitting(true)

    try {
      await createTransaction({
        accountId,
        destinationAccountId:
          type === 'TRANSFER' ? destinationAccountId : null,
        categoryId: type === 'TRANSFER' ? null : categoryId,
        description,
        amountInCents,
        type,
        status,
        occurredAt: new Date(`${occurredAt}T12:00:00`).toISOString(),
      })
      setDescription('')
      setAmount('')
      setDestinationAccountId('')
      setCategoryId('')
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a movimentação.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategoryId('')
    setDestinationAccountId('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova movimentação"
      description="Registre uma receita, despesa ou transferência entre contas."
    >
      {activeAccounts.length === 0 ? (
        <div className="empty-state empty-state--compact">
          <strong>Cadastre uma conta primeiro</strong>
          <p>Uma movimentação precisa estar vinculada a uma conta ativa.</p>
        </div>
      ) : (
        <form className="resource-form" onSubmit={handleSubmit}>
          <div className="segmented-control" aria-label="Tipo da movimentação">
            {(
              [
                ['EXPENSE', 'Despesa'],
                ['INCOME', 'Receita'],
                ['TRANSFER', 'Transferência'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                className={type === value ? 'is-active' : ''}
                type="button"
                onClick={() => handleTypeChange(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="form-field">
            Descrição
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex.: Compra do mês"
              minLength={2}
              maxLength={180}
              autoFocus
              required
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              Valor
              <div className="money-input">
                <span>R$</span>
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </label>

            <label className="form-field">
              Data
              <input
                type="date"
                value={occurredAt}
                onChange={(event) => setOccurredAt(event.target.value)}
                required
              />
            </label>
          </div>

          <label className="form-field">
            {type === 'TRANSFER' ? 'Conta de origem' : 'Conta'}
            <select
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              required
            >
              <option value="">Selecione uma conta</option>
              {activeAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>

          {type === 'TRANSFER' ? (
            <label className="form-field">
              Conta de destino
              <select
                value={destinationAccountId}
                onChange={(event) =>
                  setDestinationAccountId(event.target.value)
                }
                required
              >
                <option value="">Selecione a conta de destino</option>
                {activeAccounts
                  .filter((account) => account.id !== accountId)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
              </select>
            </label>
          ) : (
            <label className="form-field">
              Categoria
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="form-field">
            Situação
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as Exclude<
                    TransactionStatus,
                    'CANCELED'
                  >,
                )
              }
            >
              <option value="COMPLETED">Concluída</option>
              <option value="PENDING">Pendente</option>
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <ArrowLeftRight size={18} />
            )}
            {submitting ? 'Salvando...' : 'Salvar movimentação'}
          </button>
        </form>
      )}
    </Modal>
  )
}
