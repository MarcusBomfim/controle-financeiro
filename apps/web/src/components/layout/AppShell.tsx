import { LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/auth-context'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  title: string
  eyebrow?: string
  children: ReactNode
}

const currentDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
}).format(new Date())

export function AppShell({
  title,
  eyebrow = currentDate,
  children,
}: AppShellProps) {
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
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
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

        {children}
      </main>
    </div>
  )
}
