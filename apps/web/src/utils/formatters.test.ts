import { describe, expect, it } from 'vitest'
import { formatCurrency, toCents, toDateInputValue } from './formatters'

describe('financial formatters', () => {
  it('formats integer cents as Brazilian currency', () => {
    expect(formatCurrency(123456)).toContain('1.234,56')
  })

  it('converts decimal values using comma or dot to cents', () => {
    expect(toCents('89,90')).toBe(8990)
    expect(toCents('120.45')).toBe(12045)
  })

  it('creates a date value accepted by date inputs', () => {
    expect(toDateInputValue(new Date('2026-08-18T12:00:00.000Z'))).toMatch(
      /^2026-08-18$/,
    )
  })
})
