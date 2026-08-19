import { afterEach, describe, expect, it, vi } from 'vitest'
import { financeApi } from './finance-api'

describe('financeApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends transaction filters to the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ transactions: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await financeApi.listTransactions({
      type: 'EXPENSE',
      status: 'COMPLETED',
      accountId: 'account-1',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        '/api/transactions?type=EXPENSE&status=COMPLETED&accountId=account-1&limit=100',
      ),
      expect.objectContaining({ credentials: 'include' }),
    )
  })
})
