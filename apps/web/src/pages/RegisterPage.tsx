import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { PasswordField } from '../components/auth/PasswordField'
import { useAuth } from '../contexts/auth-context'
import { ApiError } from '../services/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== passwordConfirmation) {
      setError('A confirmação deve ser igual à senha.')
      return
    }

    setSubmitting(true)

    try {
      await register({ fullName, email, password })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível criar a conta. Tente novamente.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      description="Comece a organizar suas finanças em poucos passos."
      footer={
        <p>
          Já possui uma conta? <Link to="/login">Fazer login</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <label className="form-field" htmlFor="full-name">
          <span>Nome completo</span>
          <input
            id="full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            placeholder="Seu nome completo"
            minLength={3}
            maxLength={160}
            required
          />
        </label>

        <label className="form-field" htmlFor="register-email">
          <span>E-mail</span>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="seuemail@exemplo.com"
            required
          />
        </label>

        <PasswordField
          id="register-password"
          label="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="10+ caracteres, maiúscula e número"
          minLength={10}
          maxLength={128}
          required
        />

        <PasswordField
          id="password-confirmation"
          label="Confirme a senha"
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          autoComplete="new-password"
          placeholder="Digite novamente"
          minLength={10}
          maxLength={128}
          required
        />

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="spin" size={18} aria-hidden="true" />
          ) : (
            <ArrowRight size={18} aria-hidden="true" />
          )}
          {submitting ? 'Criando conta...' : 'Criar minha conta'}
        </button>
      </form>
    </AuthLayout>
  )
}
