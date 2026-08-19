import {
  CircleAlert,
  Eye,
  EyeOff,
  Landmark,
  Plus,
  RefreshCw,
  Tags,
} from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { useFinance } from '../contexts/finance-context'
import { AccountFormModal } from '../features/accounts/components/AccountFormModal'
import { CategoryFormModal } from '../features/categories/components/CategoryFormModal'
import type { AccountType } from '../types/finance'
import { formatCurrency } from '../utils/formatters'

const accountTypeLabels: Record<AccountType, string> = {
  CHECKING: 'Conta corrente',
  SAVINGS: 'Poupança',
  CASH: 'Dinheiro',
  INVESTMENT: 'Investimento',
}

export function AccountsPage() {
  const {
    accounts,
    categories,
    loading,
    error,
    refresh,
    setAccountActive,
    setCategoryActive,
  } = useFinance()
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function toggleAccount(accountId: string, active: boolean) {
    setUpdatingId(accountId)
    setActionError(null)

    try {
      await setAccountActive(accountId, active)
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar a conta.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  async function toggleCategory(categoryId: string, active: boolean) {
    setUpdatingId(categoryId)
    setActionError(null)

    try {
      await setCategoryActive(categoryId, active)
    } catch (requestError) {
      setActionError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível atualizar a categoria.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AppShell title="Contas e categorias" eyebrow="Organização do patrimônio">
      <section className="page-intro">
        <div>
          <h2>Estruture sua vida financeira</h2>
          <p>
            Cadastre suas contas e personalize as categorias utilizadas nos
            lançamentos.
          </p>
        </div>
        <div className="page-intro__actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setCategoryModalOpen(true)}
          >
            <Tags size={17} /> Nova categoria
          </button>
          <button
            className="primary-action"
            type="button"
            onClick={() => setAccountModalOpen(true)}
          >
            <Plus size={17} /> Nova conta
          </button>
        </div>
      </section>

      {(error || actionError) && (
        <div className="data-alert" role="alert">
          <CircleAlert size={19} />
          <span>{actionError ?? error}</span>
          {error && (
            <button type="button" onClick={() => void refresh()}>
              <RefreshCw size={15} /> Tentar novamente
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="content-loading">
          <RefreshCw className="spin" size={21} />
          Carregando contas e categorias...
        </div>
      ) : (
        <div className="management-sections">
          <section className="panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Onde está seu dinheiro</span>
                <h2>Contas cadastradas</h2>
              </div>
              <span className="count-badge">{accounts.length}</span>
            </div>

            {accounts.length === 0 ? (
              <div className="empty-state">
                <Landmark size={30} />
                <strong>Nenhuma conta cadastrada</strong>
                <p>Cadastre sua primeira conta para registrar movimentações.</p>
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(true)}
                >
                  <Plus size={16} /> Cadastrar conta
                </button>
              </div>
            ) : (
              <div className="account-card-grid">
                {accounts.map((account) => (
                  <article
                    className={`account-card${account.active ? '' : ' account-card--inactive'}`}
                    key={account.id}
                  >
                    <div className="account-card__heading">
                      <span className="account-card__icon">
                        <Landmark size={18} />
                      </span>
                      <span className={account.active ? 'status-dot' : 'status-dot status-dot--inactive'}>
                        {account.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div>
                      <strong>{account.name}</strong>
                      <small>{accountTypeLabels[account.type]}</small>
                    </div>
                    <p>{formatCurrency(account.currentBalanceInCents)}</p>
                    <footer>
                      <span>
                        Inicial: {formatCurrency(account.initialBalanceInCents)}
                      </span>
                      <button
                        type="button"
                        disabled={updatingId === account.id}
                        onClick={() =>
                          void toggleAccount(account.id, !account.active)
                        }
                      >
                        {account.active ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                        {account.active ? 'Desativar' : 'Ativar'}
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel__header">
              <div>
                <span className="eyebrow">Classificação</span>
                <h2>Categorias</h2>
              </div>
              <span className="count-badge">{categories.length}</span>
            </div>

            <div className="category-list">
              {categories.map((category) => (
                <article
                  className={category.active ? 'category-item' : 'category-item category-item--inactive'}
                  key={category.id}
                >
                  <span
                    className="category-item__color"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{category.name}</strong>
                    <small>
                      {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </small>
                  </div>
                  <button
                    type="button"
                    disabled={updatingId === category.id}
                    onClick={() =>
                      void toggleCategory(category.id, !category.active)
                    }
                  >
                    {category.active ? 'Desativar' : 'Ativar'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      <AccountFormModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />
      <CategoryFormModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </AppShell>
  )
}
