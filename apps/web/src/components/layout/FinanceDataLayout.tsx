import { Outlet } from 'react-router-dom'
import { FinanceProvider } from '../../contexts/FinanceProvider'

export function FinanceDataLayout() {
  return (
    <FinanceProvider>
      <Outlet />
    </FinanceProvider>
  )
}
