import {
  ChartNoAxesCombined,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Visão geral', icon: LayoutDashboard, to: '/', enabled: true },
  {
    label: 'Movimentações',
    icon: ReceiptText,
    to: '/movimentacoes',
    enabled: true,
  },
  { label: 'Contas', icon: Landmark, to: '/contas', enabled: true },
  { label: 'Orçamentos', icon: PiggyBank, to: '/orcamentos', enabled: false },
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
          {navigationItems.map(({ label, icon: Icon, to, enabled }) => (
            <li key={label}>
              {enabled ? (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-item nav-item--active' : 'nav-item'
                  }
                  to={to}
                  end={to === '/'}
                >
                  <Icon size={19} aria-hidden="true" />
                  {label}
                </NavLink>
              ) : (
                <span className="nav-item nav-item--disabled" title="Disponível na Parte 4">
                  <Icon size={19} aria-hidden="true" />
                  {label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__progress">
        <span>Desenvolvimento</span>
        <strong>Parte 3 de 6</strong>
        <div className="progress-bar" aria-label="Três de seis etapas concluídas">
          <span />
        </div>
      </div>
    </aside>
  )
}
