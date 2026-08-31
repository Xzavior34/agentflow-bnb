import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAgents, getAgentByChainAndToken, ScanApiRateLimitError, ScanApiError } from './8004scan';

/**
 * These tests mock `fetch` entirely — they verify our client's request
 * construction and error-handling logic, NOT the real 8004scan API's
 * behavior (which this sandbox cannot reach). See the header comment in
 * 8004scan.ts.
 */

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('getAgents', () => {
  it('builds the correct URL with query params', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ agents: [] }),
    });

    await getAgents({ limit: 10, offset: 20 });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/public/agents');
    expect(calledUrl).toContain('limit=10');
    expect(calledUrl).toContain('page=3');
  });

  it('does not retry a 429 forever — it eventually throws ScanApiRateLimitError', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: async () => ({}),
    });

    await expect(getAgents()).rejects.toBeInstanceOf(ScanApiRateLimitError);
    // maxRetriesOn429 defaults to 1, so exactly 2 calls total (initial + 1 retry), never unbounded.
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBeLessThanOrEqual(2);
  });

  it('extracts agents when API returns { success: true, data: [...] }', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: [{ id: '1', name: 'Agent1', chain_id: 56, token_id: '123' }],
        meta: { pagination: { total: 1 } },
      }),
    });

    const res = await getAgents();
    expect(res.agents).toHaveLength(1);
    expect(res.agents?.[0].name).toBe('Agent1');
    expect(res.total).toBe(1);
  });

  it('throws a ScanApiError (not a raw exception) on a non-OK, non-429 response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    });

    await expect(getAgents()).rejects.toBeInstanceOf(ScanApiError);
  });
});

describe('getAgentByChainAndToken', () => {
  it('builds the correct path for a single agent lookup', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ chainId: 97, tokenId: 42 }),
    });

    await getAgentByChainAndToken(97, 42);

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(calledUrl).toContain('/public/agents/97/42');
  });
});
