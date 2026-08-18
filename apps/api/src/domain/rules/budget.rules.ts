export interface BudgetDraft {
  year: number;
  month: number;
  limitInCents: number;
}

export function isValidBudget(budget: BudgetDraft): boolean {
  return (
    Number.isInteger(budget.year) &&
    budget.year >= 2000 &&
    Number.isInteger(budget.month) &&
    budget.month >= 1 &&
    budget.month <= 12 &&
    Number.isInteger(budget.limitInCents) &&
    budget.limitInCents > 0
  );
}
