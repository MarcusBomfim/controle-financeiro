import {
  ChartNoAxesCombined,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
} from 'lucide-react'

const navigationItems = [
  { label: 'Visão geral', icon: LayoutDashboard, active: true },
  { label: 'Movimentações', icon: ReceiptText, active: false },
  { label: 'Contas', icon: Landmark, active: false },
  { label: 'Orçamentos', icon: PiggyBank, active: false },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <ChartNoAxesCombined size={21} />
        </span>
        <span>
          <strong>Controle</strong>
          <small>Financeiro</small>
        </span>
      </div>

      <nav aria-label="Navegação principal">
        <span className="sidebar__label">Menu</span>
        <ul>
          {navigationItems.map(({ label, icon: Icon, active }) => (
            <li key={label}>
              <button
                className={active ? 'nav-item nav-item--active' : 'nav-item'}
                type="button"
                aria-current={active ? 'page' : undefined}
                disabled={!active}
              >
                <Icon size={19} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__progress">
        <span>Desenvolvimento</span>
        <strong>Parte 1 de 6</strong>
        <div className="progress-bar" aria-label="Uma de seis etapas concluídas">
          <span />
        </div>
      </div>
    </aside>
  )
}
