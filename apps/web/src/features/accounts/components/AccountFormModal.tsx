import { LoaderCircle, WalletCards } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { useFinance } from '../../../contexts/finance-context'
import type { AccountType } from '../../../types/finance'
import { toCents } from '../../../utils/formatters'

interface AccountFormModalProps {
  open: boolean
  onClose: () => void
}

const accountTypes: Array<{ value: AccountType; label: string }> = [
  { value: 'CHECKING', label: 'Conta corrente' },
  { value: 'SAVINGS', label: 'Poupança' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'INVESTMENT', label: 'Investimento' },
]

export function AccountFormModal({
  open,
  onClose,
}: AccountFormModalProps) {
  const { createAccount } = useFinance()
  const [name, setName] = useState('')
  const [type, setType] = useState<AccountType>('CHECKING')
  const [initialBalance, setInitialBalance] = useState('0,00')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const initialBalanceInCents = toCents(initialBalance)

    if (!Number.isFinite(initialBalanceInCents)) {
      setError('Informe um saldo inicial válido.')
      return
    }

    setSubmitting(true)

    try {
      await createAccount({ name, type, initialBalanceInCents })
      setName('')
      setInitialBalance('0,00')
      onClose()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a conta.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova conta"
      description="Cadastre onde você guarda ou movimenta seu dinheiro."
    >
      <form className="resource-form" onSubmit={handleSubmit}>
        <label className="form-field">
          Nome da conta
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Conta principal"
            minLength={2}
            maxLength={100}
            autoFocus
            required
          />
        </label>

        <label className="form-field">
          Tipo
          <select
            value={type}
            onChange={(event) => setType(event.target.value as AccountType)}
          >
            {accountTypes.map((accountType) => (
              <option key={accountType.value} value={accountType.value}>
                {accountType.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Saldo inicial
          <div className="money-input">
            <span>R$</span>
            <input
              inputMode="decimal"
              value={initialBalance}
              onChange={(event) => setInitialBalance(event.target.value)}
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
            <WalletCards size={18} />
          )}
          {submitting ? 'Salvando...' : 'Cadastrar conta'}
        </button>
      </form>
    </Modal>
  )
}
