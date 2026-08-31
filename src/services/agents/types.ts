/**
 * IMPORTANT — read before touching this file.
 *
 * The shapes below marked "UNVERIFIED" are best-effort based on the field
 * list given in the Phase 2 brief (owner, creator, registry, agent URI,
 * services/endpoints, capabilities, feedback, etc.) and on how ERC-8004
 * metadata is generally structured (see @bnbagent/sdk's AgentEndpoint /
 * ERC8004Agent types, which this project DOES have installed and can
 * inspect). They have NOT been confirmed against a live 8004scan API
 * response, because this execution environment's network access is
 * restricted to package registries (see docs/BNB_PROTOCOL_RESEARCH.md) —
 * api.8004scan.io and BSC RPC/explorer hosts are blocked here.
 *
 * `normalizeAgent()` in normalize.ts is written defensively against this
 * uncertainty: every field access is optional-chained with a fallback to
 * `undefined`/"missing", never a fabricated placeholder. When this code is
 * actually run against the real API (locally, or once network access is
 * granted here), any field that doesn't match must be logged and that
 * specific field left missing — not silently coerced to fit.
 */

export type ServiceProtocolType = 'web' | 'A2A' | 'MCP' | 'Web' | string;

export type ActivationStatus = 'HIRABLE' | 'CALLABLE' | 'PAYABLE' | 'DISCOVERABLE';

/** A single service/endpoint entry, in whichever of the two raw shapes it arrived in. */
export interface RawAgentService {
  name?: string;
  type?: ServiceProtocolType;
  endpoint?: string;
  url?: string; // legacy `endpoints` entries have sometimes used `url` instead of `endpoint`
  version?: string;
  capabilities?: string[];
}

/**
 * Raw shape of a single agent as returned by 8004scan's public API.
 * Supports both the real snake_case fields returned by https://8004scan.io/api/v1/public/agents
 * and camelCase / legacy fields for full backwards compatibility.
 */
export interface RawAgent {
  // Real 8004scan API snake_case fields
  id?: string;
  agent_id?: string;
  token_id?: string;
  chain_id?: number;
  chain_type?: string;
  contract_address?: string;
  is_testnet?: boolean;
  owner_id?: string;
  owner_address?: string;
  owner_ens?: string | null;
  owner_username?: string | null;
  owner_avatar_url?: string | null;
  owner_publisher_tier?: string | null;
  owner_certified_name?: string | null;
  name?: string;
  description?: string;
  image_url?: string;
  is_verified?: boolean;
  star_count?: number;
  supported_protocols?: string[];
  x402_supported?: boolean;
  total_score?: number;
  rank?: number | null;
  network_rank?: number | null;
  health_score?: number | null;
  total_feedbacks?: number;
  average_score?: number | null;
  cross_chain_versions?: unknown[] | null;
  created_at?: string;
  updated_at?: string;

  // CamelCase and legacy aliases
  chainId?: number;
  tokenId?: number | string;
  agentId?: number | string;
  owner?: string;
  creator?: string;
  registry?: string;
  agentURI?: string;
  agentUri?: string;
  createdTxHash?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActivityAt?: string;
  services?: RawAgentService[];
  endpoints?: RawAgentService[];
  capabilities?: string[];
  tags?: string[];
  feedbackCount?: number;
  reputationScore?: number;
  x402Wallet?: string;
  metadata?: Record<string, unknown>;

  // Catch-all so unexpected real fields are preserved
  [key: string]: unknown;
}

export interface RawAgentListResponse {
  success?: boolean;
  data?: RawAgent[];
  agents?: RawAgent[];
  meta?: {
    version?: string;
    timestamp?: string;
    requestId?: string;
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      hasMore?: boolean;
    };
  };
  total?: number;
  page?: number;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

export interface RawStatsResponse {
  success?: boolean;
  data?: {
    total_agents?: number;
    total_users?: number;
    total_validators?: number;
    total_feedbacks?: number;
    total_validations?: number;
    chain_stats?: Array<{
      chain_id: number;
      name: string;
      is_testnet: boolean;
      total_agents: number;
      total_feedbacks: number;
      average_feedback_score: number | null;
      mcp_agents: number;
      a2a_agents: number;
      oasf_agents: number;
    }>;
    protocol_distribution?: {
      mcp?: number;
      a2a?: number;
      unknown?: number;
      [key: string]: unknown;
    };
    registration_stats?: Record<string, unknown>;
  };
  totalAgents?: number;
  chains?: Record<string, number>;
  [key: string]: unknown;
}

export interface RawFeedback {
  id?: string;
  agent_id?: string;
  chain_id?: number;
  token_id?: string;
  score?: number;
  rating?: number;
  comment?: string;
  created_at?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Normalized AgentFlow domain model — this is what the React UI consumes.
// Never pass a RawAgent directly to a component.
// ---------------------------------------------------------------------------

export interface AgentFlowService {
  name: string;
  type: ServiceProtocolType;
  endpoint: string | null;
  version: string | null;
  capabilities: string[];
}

export type MarketplaceCategory =
  | 'REBALANCING'
  | 'GRID_TRADING'
  | 'YIELD_OPTIMIZATION'
  | 'HEALTH_FACTOR_MONITORING'
  | 'UNCATEGORIZED';

export interface AgentFlowAgent {
  /** Stable identity key: `${chainId}:${tokenId}`. */
  id: string;
  chainId: number | null;
  tokenId: string | null;
  name: string | null;
  description: string | null;
  owner: string | null;
  creator: string | null;
  registry: string | null;
  agentUri: string | null;
  imageUrl: string | null;
  createdTxHash: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastActivityAt: string | null;
  services: AgentFlowService[];
  capabilities: string[];
  supportedProtocols: string[];
  x402Supported: boolean;
  starCount: number;
  rank: number | null;
  networkRank: number | null;
  healthScore: number | null;
  feedbackCount: number | null;
  reputationScore: number | null;
  isVerified: boolean;
  x402Wallet: string | null;
  categories: MarketplaceCategory[];
  activationStatus: ActivationStatus;
  /** True only if chainId is a known BSC chain ID (56 or 97). */
  isBscNative: boolean;
  /** Per-field provenance for anything the UI should be able to justify. */
  provenance: {
    identity: 'ONCHAIN' | '8004SCAN';
    services: 'AGENT_METADATA' | '8004SCAN';
    reputation: '8004SCAN' | 'AGENTFLOW_DERIVED';
    categories: 'AGENTFLOW_DERIVED';
  };
  /** When this normalized record was produced. */
  retrievedAt: string;
}
