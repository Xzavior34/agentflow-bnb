import { SCAN_API_URL } from '@/config/networks';
import type { RawAgent, RawAgentListResponse, RawStatsResponse, RawFeedback } from './types';

export class ScanApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = 'ScanApiError';
  }
}

export class ScanApiRateLimitError extends ScanApiError {
  constructor(endpoint: string) {
    super('8004scan rate limit exceeded (anonymous tier: 10 req/min, 100 req/day)', 429, endpoint);
    this.name = 'ScanApiRateLimitError';
  }
}

interface FetchJsonOptions {
  timeoutMs?: number;
  maxRetriesOn429?: number;
}

async function fetchJson<T>(path: string, options: FetchJsonOptions = {}): Promise<T> {
  const { timeoutMs = 12_000, maxRetriesOn429 = 1 } = options;
  const baseUrl = SCAN_API_URL.replace('www.8004scan.io', '8004scan.io');
  const url = `${baseUrl}${path}`;

  let attempt = 0;
  while (true) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.status === 429) {
        if (attempt < maxRetriesOn429) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        throw new ScanApiRateLimitError(path);
      }

      if (!response.ok) {
        throw new ScanApiError(`8004scan request failed: ${response.status} ${response.statusText}`, response.status, path);
      }

      const json = await response.json();
      return json as T;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof ScanApiError) throw err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ScanApiError(`8004scan request timed out after ${timeoutMs}ms`, undefined, path);
      }
      throw new ScanApiError(
        `8004scan request errored: ${err instanceof Error ? err.message : String(err)}`,
        undefined,
        path
      );
    }
  }
}

export interface ListAgentsParams {
  page?: number;
  limit?: number;
  offset?: number;
  chainId?: number;
  chain_id?: number;
}

/**
 * Normalizes raw list responses from 8004scan which return `{ success: true, data: [...] }`
 * or `{ agents: [...] }` or raw arrays.
 */
function extractAgentsList(res: RawAgentListResponse | RawAgent[] | { data?: RawAgent[]; agents?: RawAgent[] }): RawAgent[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.agents)) return res.agents;
  return [];
}

export async function getAgents(params: ListAgentsParams = {}): Promise<RawAgentListResponse> {
  const query = new URLSearchParams();
  const page = params.page ?? (params.offset !== undefined && params.limit ? Math.floor(params.offset / params.limit) + 1 : 1);
  query.set('page', String(page));
  query.set('limit', String(params.limit ?? 50));
  
  const cid = params.chainId ?? params.chain_id;
  if (cid !== undefined) query.set('chain_id', String(cid));

  const qs = query.toString();
  const raw = await fetchJson<RawAgentListResponse | { data: RawAgent[] }>(`/public/agents${qs ? `?${qs}` : ''}`);
  const agents = extractAgentsList(raw);
  return {
    success: true,
    data: agents,
    agents,
    total: raw.meta?.pagination?.total ?? agents.length,
    page,
    limit: params.limit ?? 50,
  };
}

export async function searchAgents(q: string, params: ListAgentsParams = {}): Promise<RawAgentListResponse> {
  const query = new URLSearchParams({ q });
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  
  try {
    const raw = await fetchJson<RawAgentListResponse>(`/public/agents/search?${query.toString()}`);
    const agents = extractAgentsList(raw);
    return {
      success: true,
      data: agents,
      agents,
    };
  } catch {
    // If /public/agents/search endpoint fails on indexer (502 / backend error),
    // fallback gracefully to scanning public agents and filtering locally.
    const listRes = await getAgents({ limit: 100 });
    const all = listRes.agents ?? [];
    const term = q.toLowerCase();
    const filtered = all.filter((a) => {
      const text = `${a.name ?? ''} ${a.description ?? ''} ${(a.capabilities ?? []).join(' ')}`.toLowerCase();
      return text.includes(term);
    });
    return {
      success: true,
      data: filtered,
      agents: filtered,
      total: filtered.length,
    };
  }
}

export async function getAgentByChainAndToken(chainId: number, tokenId: string | number): Promise<RawAgent> {
  try {
    const res = await fetchJson<RawAgent | { success: boolean; data: RawAgent }>(`/public/agents/${chainId}/${tokenId}`);
    if ('data' in res && res.data && typeof res.data === 'object') {
      return res.data;
    }
    return res as RawAgent;
  } catch {
    // Fallback if direct ID endpoint is 404: find agent in public agents list
    const listRes = await getAgents({ limit: 100 });
    const agents = listRes.agents ?? [];
    const tokenStr = String(tokenId);
    const found = agents.find((a) => {
      const aChain = a.chain_id ?? a.chainId;
      const aToken = a.token_id !== undefined ? String(a.token_id) : a.tokenId !== undefined ? String(a.tokenId) : null;
      return aChain === chainId && aToken === tokenStr;
    });

    if (found) return found;
    throw new ScanApiError(`Agent ${chainId}:${tokenId} not found`, 404, `/public/agents/${chainId}/${tokenId}`);
  }
}

export async function getAccountAgents(address: string): Promise<RawAgentListResponse> {
  const raw = await fetchJson<RawAgentListResponse>(`/public/accounts/${address}/agents`);
  const agents = extractAgentsList(raw);
  return {
    success: true,
    data: agents,
    agents,
  };
}

export async function getStats(): Promise<RawStatsResponse> {
  return fetchJson<RawStatsResponse>('/public/stats');
}

export async function getFeedbacks(params: ListAgentsParams = {}): Promise<{ feedbacks?: RawFeedback[]; [key: string]: unknown }> {
  const query = new URLSearchParams();
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.page !== undefined) query.set('page', String(params.page));
  const qs = query.toString();
  return fetchJson(`/public/feedbacks${qs ? `?${qs}` : ''}`);
}

export async function getChains(): Promise<{ chains?: Array<{ chainId: number; name?: string }>; [key: string]: unknown }> {
  return fetchJson('/public/chains');
}
