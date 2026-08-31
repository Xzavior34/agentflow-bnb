/**
 * TEST FIXTURES ONLY. Do not import from production code.
 *
 * These are hand-constructed per the field list in the Phase 2 brief and
 * @bnbagent/sdk's AgentEndpoint shape — they are NOT captured from a real
 * 8004scan API response (this sandbox cannot reach 8004scan.io — see
 * docs/BNB_PROTOCOL_RESEARCH.md). They exist to exercise normalize.ts's
 * defensive field-mapping logic, not to assert what the real API returns.
 */
import type { RawAgent } from '../types';

export const FIXTURE_AGENT_MODERN_SERVICES: RawAgent = {
  chainId: 97,
  tokenId: 42,
  name: 'RebalanceBot',
  description: 'Automatically rebalances a portfolio back to target allocation when it drifts.',
  owner: '0x1111111111111111111111111111111111111111',
  creator: '0x2222222222222222222222222222222222222222',
  registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  agentURI: 'data:application/json;base64,eyJmb28iOiJiYXIifQ==',
  createdTxHash: '0xaaaa',
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
  services: [
    { name: 'A2A', type: 'A2A', endpoint: 'https://rebalancebot.example/.well-known/agent-card.json', version: '1.0' },
  ],
  capabilities: ['rebalancing', 'portfolio-management'],
  feedbackCount: 12,
  reputationScore: 87,
};

export const FIXTURE_AGENT_LEGACY_ENDPOINTS: RawAgent = {
  chainId: 97,
  tokenId: 7,
  name: 'GridTraderX',
  description: 'Runs a grid trading strategy across a configurable price range.',
  owner: '0x3333333333333333333333333333333333333333',
  endpoints: [
    { name: 'web', type: 'web', url: 'https://gridtraderx.example/api' },
  ],
  capabilities: ['grid trading'],
};

export const FIXTURE_AGENT_BOTH_SHAPES: RawAgent = {
  chainId: 56,
  tokenId: 100,
  name: 'YieldMaximizer',
  description: 'Finds the best yield across lending protocols and auto-compounds returns.',
  services: [{ name: 'MCP', type: 'MCP', endpoint: 'https://yieldmax.example/mcp' }],
  endpoints: [{ name: 'web-legacy', type: 'web', url: 'https://yieldmax.example/legacy' }],
};

export const FIXTURE_AGENT_ETHEREUM_SHOULD_BE_FILTERED: RawAgent = {
  chainId: 1, // Ethereum mainnet — must never appear in BSC-only views
  tokenId: 5,
  name: 'EthOnlyAgent',
  description: 'An Ethereum-native agent that should never leak into BSC competition views.',
};

export const FIXTURE_AGENT_MINIMAL: RawAgent = {
  chainId: 97,
  tokenId: 999,
  // Deliberately sparse — exercises missing-data handling.
};

export const FIXTURE_AGENT_UNCATEGORIZABLE: RawAgent = {
  chainId: 97,
  tokenId: 1000,
  name: 'MysteryAgent',
  description: 'Does something with data.',
};

/**
 * TEST FIXTURE: Derived from actual live 8004scan public API response.
 * Uses real snake_case fields returned by https://8004scan.io/api/v1/public/agents.
 */
export const FIXTURE_AGENT_LIVE_8004SCAN: RawAgent = {
  id: '3ae918a4-e10f-48a8-84d6-4c8f9c84894c',
  agent_id: '56:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432:319694',
  token_id: '319694',
  chain_id: 56,
  chain_type: 'evm',
  contract_address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
  is_testnet: false,
  owner_id: '0d6b8915-979b-41e5-92ab-2852f7626dd8',
  owner_address: '0x2892b9681ef9f8f384ab321db7f8276db72cd3af',
  name: 'Mojeshissain',
  description: 'An EvoEvo AI Agent focused on sports.',
  image_url: 'https://api.8004scan.io/api/v1/media/agents/56/319694/image',
  is_verified: false,
  star_count: 5,
  supported_protocols: ['Web', 'A2A'],
  x402_supported: false,
  total_score: 92,
  rank: 10,
  network_rank: 4,
  health_score: 95,
  total_feedbacks: 3,
  average_score: 92,
  created_at: '2026-08-30T17:45:33Z',
  updated_at: '2026-08-30T21:11:45.137145Z',
};
