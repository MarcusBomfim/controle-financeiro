import { z } from 'zod';

const today = new Date();

export const monthQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .default(today.getFullYear()),
  month: z.coerce
    .number()
    .int()
    .min(1)
    .max(12)
    .default(today.getMonth() + 1),
});

export type MonthQuery = z.infer<typeof monthQuerySchema>;

export function getMonthRange(year: number, month: number) {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}
