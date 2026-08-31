import { useQuery } from '@tanstack/react-query';
import { getAgents, searchAgents, getAgentByChainAndToken, ScanApiRateLimitError } from '@/services/agents/8004scan';
import { normalizeAgents, normalizeAgent, filterBscOnly } from '@/services/agents/normalize';
import type { AgentFlowAgent } from '@/services/agents/types';

/**
 * Shared query defaults for 8004scan-backed queries. The anonymous tier is
 * rate-limited to 10 req/min / 100 req/day (see docs/BNB_PROTOCOL_RESEARCH.md
 * and the Phase 2 brief) — a 5 minute staleTime plus TanStack Query's
 * built-in request de-duplication keeps this app well under that even with
 * several components reading agent data at once. `retry` is capped so a
 * sustained rate-limit or outage surfaces as an error state quickly rather
 * than compounding the problem with more requests.
 */
const SHARED_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  retry: (failureCount: number, error: unknown) => {
    if (error instanceof ScanApiRateLimitError) return false; // never retry a rate limit — that makes it worse
    return failureCount < 2;
  },
};

export interface UseAgentsOptions {
  /** Restrict results to BSC-native agents only (chainId 56/97). Defaults to true — see the hackathon eligibility rule. */
  bscOnly?: boolean;
  limit?: number;
  offset?: number;
}

export function useAgents(options: UseAgentsOptions = {}) {
  const { bscOnly = true, limit = 50, offset = 0 } = options;

  return useQuery<AgentFlowAgent[]>({
    queryKey: ['agents', 'list', { limit, offset, bscOnly }],
    queryFn: async () => {
      const response = await getAgents({ limit, offset });
      const normalized = normalizeAgents(response.agents ?? []);
      return bscOnly ? filterBscOnly(normalized) : normalized;
    },
    ...SHARED_QUERY_OPTIONS,
  });
}

export function useAgentSearch(query: string, options: UseAgentsOptions = {}) {
  const { bscOnly = true, limit = 50 } = options;

  return useQuery<AgentFlowAgent[]>({
    queryKey: ['agents', 'search', query, { limit, bscOnly }],
    queryFn: async () => {
      const response = await searchAgents(query, { limit });
      const normalized = normalizeAgents(response.agents ?? []);
      return bscOnly ? filterBscOnly(normalized) : normalized;
    },
    enabled: query.trim().length > 0,
    ...SHARED_QUERY_OPTIONS,
  });
}

export function useAgentProfile(chainId: number, tokenId: string) {
  return useQuery<AgentFlowAgent>({
    queryKey: ['agents', 'profile', chainId, tokenId],
    queryFn: async () => {
      const raw = await getAgentByChainAndToken(chainId, tokenId);
      return normalizeAgent(raw);
    },
    enabled: Number.isFinite(chainId) && tokenId.length > 0,
    ...SHARED_QUERY_OPTIONS,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['agents', 'stats'],
    queryFn: async () => {
      return getStats();
    },
    ...SHARED_QUERY_OPTIONS,
  });
}

