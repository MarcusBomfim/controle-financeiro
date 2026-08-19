import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardOverview } from '../../../types/finance'
import { formatCurrency } from '../../../utils/formatters'

interface CashFlowChartProps {
  data: DashboardOverview['cashFlow']
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        Registre movimentações concluídas para visualizar o fluxo do mês.
      </div>
    )
  }

  return (
    <div className="cash-flow-chart" aria-label="Gráfico de receitas e despesas">
      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e8efed" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#74868d', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={70}
            tick={{ fill: '#74868d', fontSize: 10 }}
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                notation: 'compact',
                style: 'currency',
                currency: 'BRL',
              }).format(Number(value) / 100)
            }
          />
          <Tooltip
            cursor={{ fill: '#f2f7f6' }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === 'incomeInCents' ? 'Receitas' : 'Despesas',
            ]}
            labelFormatter={(day) => `Dia ${day}`}
            contentStyle={{
              border: '1px solid #dce7e5',
              borderRadius: 10,
              boxShadow: '0 12px 30px rgb(18 52 59 / 10%)',
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="incomeInCents"
            fill="#087b64"
            radius={[5, 5, 0, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="expenseInCents"
            fill="#e08a75"
            radius={[5, 5, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
