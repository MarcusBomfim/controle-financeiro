import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { apiRequest } from '../services/api'
import type {
  AuthResponse,
  AuthUser,
  LoginData,
  RegisterData,
} from '../types/auth'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    apiRequest<AuthResponse>('/auth/me')
      .then((response) => {
        if (active) setUser(response.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(data: LoginData) {
        const response = await apiRequest<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        setUser(response.user)
      },
      async register(data: RegisterData) {
        const response = await apiRequest<AuthResponse>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        setUser(response.user)
      },
      async logout() {
        try {
          await apiRequest<void>('/auth/logout', { method: 'POST' })
        } finally {
          setUser(null)
        }
      },
    }),
    [loading, user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
