import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '../components/auth/LoadingScreen'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { PublicOnlyRoute } from '../components/auth/PublicOnlyRoute'
import { FinanceDataLayout } from '../components/layout/FinanceDataLayout'
import { AuthProvider } from '../contexts/AuthProvider'

const AccountsPage = lazy(() =>
  import('../pages/AccountsPage').then((module) => ({
    default: module.AccountsPage,
  })),
)
const BudgetsPage = lazy(() =>
  import('../pages/BudgetsPage').then((module) => ({
    default: module.BudgetsPage,
  })),
)
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)
const RegisterPage = lazy(() =>
  import('../pages/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
)
const TransactionsPage = lazy(() =>
  import('../pages/TransactionsPage').then((module) => ({
    default: module.TransactionsPage,
  })),
)

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<FinanceDataLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/movimentacoes" element={<TransactionsPage />} />
                <Route path="/contas" element={<AccountsPage />} />
                <Route path="/orcamentos" element={<BudgetsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
