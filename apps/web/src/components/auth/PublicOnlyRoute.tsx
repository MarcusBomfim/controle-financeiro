import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import { LoadingScreen } from './LoadingScreen'

export function PublicOnlyRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
