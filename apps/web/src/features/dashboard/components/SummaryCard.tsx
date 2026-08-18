import { ArrowDownRight, ArrowUpRight, WalletCards } from 'lucide-react'
import type { FinancialSummary } from '../../../types/dashboard'

interface SummaryCardProps {
  summary: FinancialSummary
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const Icon =
    summary.tone === 'positive'
      ? ArrowUpRight
      : summary.tone === 'negative'
        ? ArrowDownRight
        : WalletCards

  return (
    <article className={`summary-card summary-card--${summary.tone}`}>
      <div className="summary-card__header">
        <span>{summary.label}</span>
        <span className="summary-card__icon" aria-hidden="true">
          <Icon size={18} strokeWidth={2.2} />
        </span>
      </div>
      <strong>{summary.value}</strong>
      <small>{summary.variation}</small>
    </article>
  )
}
