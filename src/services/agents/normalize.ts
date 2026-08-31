import type { RawAgent, RawAgentService, AgentFlowAgent, AgentFlowService, ActivationStatus } from './types';
import { isBscChainId } from '@/config/networks';
import { classifyAgent } from './categories';

/**
 * Normalizes one service/endpoint entry. Accepts either the current (2026+)
 * `services` shape or the legacy `endpoints` shape — see the ERC-8004
 * compatibility rule in the Phase 2 brief. Missing fields stay `null`, never
 * invented.
 */
function normalizeService(raw: RawAgentService): AgentFlowService {
  return {
    name: raw.name ?? (raw.type ? String(raw.type) : 'unknown'),
    type: raw.type ?? 'web',
    endpoint: raw.endpoint ?? raw.url ?? null,
    version: raw.version ?? null,
    capabilities: Array.isArray(raw.capabilities) ? raw.capabilities : [],
  };
}

/**
 * Picks whichever of `services` (current) or `endpoints` (legacy) is
 * present. When BOTH exist on the same raw agent, `services` wins, per the
 * Phase 2 brief's explicit compatibility rule. If neither is present, converts
 * any declared `supported_protocols` into service entries.
 */
function normalizeServices(raw: RawAgent): { services: AgentFlowService[]; source: 'AGENT_METADATA' | '8004SCAN' } {
  const list = raw.services ?? raw.endpoints;
  if (Array.isArray(list) && list.length > 0) {
    return { services: list.map(normalizeService), source: 'AGENT_METADATA' };
  }

  // If no explicit services array, infer from supported_protocols (e.g. ['A2A', 'MCP', 'Web'])
  if (Array.isArray(raw.supported_protocols) && raw.supported_protocols.length > 0) {
    const inferred: AgentFlowService[] = raw.supported_protocols.map((protocol) => ({
      name: protocol,
      type: protocol,
      endpoint: null,
      version: null,
      capabilities: [],
    }));
    return { services: inferred, source: '8004SCAN' };
  }

  return { services: [], source: 'AGENT_METADATA' };
}

function parseTokenId(raw: RawAgent): string | null {
  if (raw.token_id !== undefined && raw.token_id !== null) {
    return String(raw.token_id);
  }
  if (raw.tokenId !== undefined && raw.tokenId !== null) {
    return String(raw.tokenId);
  }
  if (raw.agentId !== undefined && raw.agentId !== null) {
    return String(raw.agentId);
  }
  if (typeof raw.agent_id === 'string') {
    const parts = raw.agent_id.split(':');
    if (parts.length === 3 && parts[2]) {
      return parts[2];
    }
  }
  return null;
}

export function computeActivationStatus(agent: {
  chainId?: number | null;
  tokenId?: string | null;
  supportedProtocols?: string[];
  x402Supported?: boolean;
  services?: AgentFlowService[];
}): ActivationStatus {
  // SafeHire ProofOps (Chain 97 Token 2032) or explicitly declared ERC-8183
  const isSafeHire = String(agent.chainId) === '97' && String(agent.tokenId) === '2032';
  const hasErc8183 = (agent.supportedProtocols || []).some(p => p.toLowerCase().includes('8183')) ||
                     (agent.services || []).some(s => s.type?.toLowerCase().includes('8183') || s.name?.toLowerCase().includes('8183'));

  if (isSafeHire || hasErc8183) {
    return 'HIRABLE';
  }

  if (agent.x402Supported || (agent.supportedProtocols || []).some(p => p.toLowerCase().includes('x402'))) {
    return 'PAYABLE';
  }

  const hasCallableProtocol = (agent.supportedProtocols || []).some(p => {
    const lower = p.toLowerCase();
    return lower.includes('a2a') || lower.includes('mcp') || lower.includes('oasf');
  }) || (agent.services || []).some(s => {
    const lower = String(s.type).toLowerCase();
    return lower.includes('a2a') || lower.includes('mcp') || lower.includes('oasf');
  });

  if (hasCallableProtocol) {
    return 'CALLABLE';
  }

  return 'DISCOVERABLE';
}

/**
 * Converts one raw 8004scan agent record into the AgentFlowAgent domain model
 * the UI consumes. Supports both the live 8004scan snake_case schema and
 * legacy camelCase schemas. Missing fields stay null/empty rather than being fabricated.
 */
export function normalizeAgent(raw: RawAgent, retrievedAt: string = new Date().toISOString()): AgentFlowAgent {
  const chainId = typeof raw.chain_id === 'number'
    ? raw.chain_id
    : typeof raw.chainId === 'number'
    ? raw.chainId
    : null;

  const tokenId = parseTokenId(raw);
  const { services } = normalizeServices(raw);
  const capabilities = Array.isArray(raw.capabilities) ? raw.capabilities : [];
  const supportedProtocols = Array.isArray(raw.supported_protocols) ? raw.supported_protocols : [];
  const x402Supported = Boolean(raw.x402_supported);

  const feedbackCount = typeof raw.total_feedbacks === 'number'
    ? raw.total_feedbacks
    : typeof raw.feedbackCount === 'number'
    ? raw.feedbackCount
    : null;

  const reputationScore = typeof raw.total_score === 'number' && raw.total_score > 0
    ? raw.total_score
    : typeof raw.average_score === 'number' && raw.average_score > 0
    ? raw.average_score
    : typeof raw.reputationScore === 'number'
    ? raw.reputationScore
    : null;

  const activationStatus = computeActivationStatus({
    chainId,
    tokenId,
    supportedProtocols,
    x402Supported,
    services,
  });

  const partial: Omit<AgentFlowAgent, 'categories'> = {
    id: `${chainId ?? 'unknown'}:${tokenId ?? 'unknown'}`,
    chainId,
    tokenId,
    name: raw.name ?? null,
    description: raw.description ?? null,
    owner: raw.owner_address ?? raw.owner ?? null,
    creator: raw.creator ?? null,
    registry: raw.contract_address ?? raw.registry ?? null,
    agentUri: raw.agentURI ?? raw.agentUri ?? null,
    imageUrl: raw.image_url ?? null,
    createdTxHash: raw.createdTxHash ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
    lastActivityAt: raw.updated_at ?? raw.lastActivityAt ?? null,
    services,
    capabilities,
    supportedProtocols,
    x402Supported,
    starCount: typeof raw.star_count === 'number' ? raw.star_count : 0,
    rank: typeof raw.rank === 'number' ? raw.rank : null,
    networkRank: typeof raw.network_rank === 'number' ? raw.network_rank : null,
    healthScore: typeof raw.health_score === 'number' ? raw.health_score : null,
    feedbackCount,
    reputationScore,
    isVerified: Boolean(raw.is_verified),
    x402Wallet: raw.x402Wallet ?? (x402Supported ? (raw.owner_address ?? raw.owner ?? null) : null),
    activationStatus,
    isBscNative: isBscChainId(chainId),
    provenance: {
      identity: '8004SCAN',
      services: 'AGENT_METADATA',
      reputation: '8004SCAN',
      categories: 'AGENTFLOW_DERIVED',
    },
    retrievedAt,
  };

  return {
    ...partial,
    categories: classifyAgent(partial),
  };
}

export function normalizeAgents(raws: RawAgent[], retrievedAt?: string): AgentFlowAgent[] {
  return raws.map((raw) => normalizeAgent(raw, retrievedAt));
}

/**
 * Filters a normalized agent list down to BSC-only, per the hackathon
 * eligibility rule that competition views must never leak Ethereum/Base
 * agents just because 8004scan is multi-chain.
 */
export function filterBscOnly(agents: AgentFlowAgent[]): AgentFlowAgent[] {
  return agents.filter((agent) => agent.isBscNative);
}

