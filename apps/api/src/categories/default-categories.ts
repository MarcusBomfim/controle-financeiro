export const defaultCategories = [
  {
    name: 'Salário',
    type: 'INCOME' as const,
    color: '#16896b',
    icon: 'briefcase-business',
  },
  {
    name: 'Renda extra',
    type: 'INCOME' as const,
    color: '#2c72c7',
    icon: 'circle-dollar-sign',
  },
  {
    name: 'Investimentos',
    type: 'INCOME' as const,
    color: '#7b61b3',
    icon: 'chart-no-axes-combined',
  },
  {
    name: 'Alimentação',
    type: 'EXPENSE' as const,
    color: '#dd7d3d',
    icon: 'utensils',
  },
  {
    name: 'Moradia',
    type: 'EXPENSE' as const,
    color: '#a9664a',
    icon: 'house',
  },
  {
    name: 'Transporte',
    type: 'EXPENSE' as const,
    color: '#3978a8',
    icon: 'car-front',
  },
  {
    name: 'Saúde',
    type: 'EXPENSE' as const,
    color: '#d25269',
    icon: 'heart-pulse',
  },
  {
    name: 'Educação',
    type: 'EXPENSE' as const,
    color: '#7759b8',
    icon: 'graduation-cap',
  },
  {
    name: 'Lazer',
    type: 'EXPENSE' as const,
    color: '#1592a0',
    icon: 'gamepad-2',
  },
  {
    name: 'Outros',
    type: 'EXPENSE' as const,
    color: '#74838a',
    icon: 'shapes',
  },
];
