import { ChartNoAxesCombined, CheckCircle2, LockKeyhole } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'

interface AuthLayoutProps extends PropsWithChildren {
  title: string
  description: string
  footer: ReactNode
}

const benefits = [
  'Organize contas e movimentações',
  'Acompanhe receitas e despesas',
  'Planeje seus limites mensais',
]

export function AuthLayout({
  title,
  description,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-layout">
      <section className="auth-presentation">
        <div className="auth-brand">
          <span className="brand__mark" aria-hidden="true">
            <ChartNoAxesCombined size={21} />
          </span>
          <span>
            <strong>Controle</strong>
            <small>Financeiro</small>
          </span>
        </div>

        <div className="auth-presentation__content">
          <span className="auth-kicker">
            <LockKeyhole size={15} aria-hidden="true" />
            Seus dados, sua organização
          </span>
          <h1>Decisões melhores começam com números claros.</h1>
          <p>
            Reúna sua vida financeira em um painel simples, seguro e construído
            para acompanhar sua evolução.
          </p>

          <ul>
            {benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={17} aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <small className="auth-presentation__stage">Projeto • Parte 2 de 6</small>
      </section>

      <section className="auth-form-area">
        <div className="auth-form-card">
          <div className="auth-form-card__heading">
            <span className="eyebrow">Acesso pessoal</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          {children}

          <div className="auth-form-card__footer">{footer}</div>
        </div>
      </section>
    </main>
  )
}
