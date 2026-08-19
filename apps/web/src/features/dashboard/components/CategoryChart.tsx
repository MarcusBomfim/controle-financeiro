import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { DashboardOverview } from '../../../types/finance'
import { formatCurrency } from '../../../utils/formatters'

interface CategoryChartProps {
  data: DashboardOverview['categoryBreakdown']
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty chart-empty--small">
        Nenhuma despesa concluída neste mês.
      </div>
    )
  }

  const visibleCategories = data.slice(0, 5)

  return (
    <div className="category-chart">
      <div aria-label="Gráfico de despesas por categoria">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={visibleCategories}
              dataKey="amountInCents"
              nameKey="name"
              innerRadius={50}
              outerRadius={76}
              paddingAngle={3}
              stroke="none"
            >
              {visibleCategories.map((category) => (
                <Cell key={category.categoryId} fill={category.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                border: '1px solid #dce7e5',
                borderRadius: 10,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="category-chart__legend">
        {visibleCategories.map((category) => (
          <div key={category.categoryId}>
            <span>
              <i style={{ backgroundColor: category.color }} />
              {category.name}
            </span>
            <strong>{formatCurrency(category.amountInCents)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
