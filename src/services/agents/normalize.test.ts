import { describe, it, expect } from 'vitest';
import { normalizeAgent, normalizeAgents, filterBscOnly } from './normalize';
import {
  FIXTURE_AGENT_MODERN_SERVICES,
  FIXTURE_AGENT_LEGACY_ENDPOINTS,
  FIXTURE_AGENT_BOTH_SHAPES,
  FIXTURE_AGENT_ETHEREUM_SHOULD_BE_FILTERED,
  FIXTURE_AGENT_MINIMAL,
  FIXTURE_AGENT_LIVE_8004SCAN,
} from './__fixtures__/rawAgents';

describe('normalizeAgent — services/endpoints compatibility', () => {
  it('reads the current `services` field', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES);
    expect(agent.services).toHaveLength(1);
    expect(agent.services[0].name).toBe('A2A');
    expect(agent.services[0].endpoint).toBe('https://rebalancebot.example/.well-known/agent-card.json');
  });

  it('falls back to the legacy `endpoints` field when `services` is absent', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_LEGACY_ENDPOINTS);
    expect(agent.services).toHaveLength(1);
    expect(agent.services[0].name).toBe('web');
    expect(agent.services[0].endpoint).toBe('https://gridtraderx.example/api');
  });

  it('prefers `services` over `endpoints` when both are present', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_BOTH_SHAPES);
    expect(agent.services).toHaveLength(1);
    expect(agent.services[0].name).toBe('MCP');
  });
});

describe('normalizeAgent — identity fields', () => {
  it('maps core identity fields correctly', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES);
    expect(agent.id).toBe('97:42');
    expect(agent.chainId).toBe(97);
    expect(agent.tokenId).toBe('42');
    expect(agent.owner).toBe('0x1111111111111111111111111111111111111111');
    expect(agent.reputationScore).toBe(87);
    expect(agent.feedbackCount).toBe(12);
  });
});

describe('normalizeAgent — missing-data handling', () => {
  it('leaves missing fields null/empty rather than inventing values', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MINIMAL);
    expect(agent.name).toBeNull();
    expect(agent.description).toBeNull();
    expect(agent.owner).toBeNull();
    expect(agent.services).toEqual([]);
    expect(agent.capabilities).toEqual([]);
    expect(agent.reputationScore).toBeNull();
    expect(agent.feedbackCount).toBeNull();
  });

  it('still produces a stable id even with sparse data', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MINIMAL);
    expect(agent.id).toBe('97:999');
  });
});

describe('normalizeAgent — live 8004scan API shape', () => {
  it('correctly maps snake_case fields from live 8004scan responses', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_LIVE_8004SCAN);
    expect(agent.id).toBe('56:319694');
    expect(agent.chainId).toBe(56);
    expect(agent.tokenId).toBe('319694');
    expect(agent.name).toBe('Mojeshissain');
    expect(agent.owner).toBe('0x2892b9681ef9f8f384ab321db7f8276db72cd3af');
    expect(agent.registry).toBe('0x8004a169fb4a3325136eb29fa0ceb6d2e539a432');
    expect(agent.imageUrl).toBe('https://api.8004scan.io/api/v1/media/agents/56/319694/image');
    expect(agent.supportedProtocols).toEqual(['Web', 'A2A']);
    expect(agent.services).toHaveLength(2);
    expect(agent.services[0].name).toBe('Web');
    expect(agent.services[1].name).toBe('A2A');
    expect(agent.reputationScore).toBe(92);
    expect(agent.feedbackCount).toBe(3);
    expect(agent.starCount).toBe(5);
    expect(agent.rank).toBe(10);
    expect(agent.networkRank).toBe(4);
    expect(agent.healthScore).toBe(95);
    expect(agent.isBscNative).toBe(true);
  });
});

describe('filterBscOnly', () => {
  it('excludes non-BSC chain IDs (e.g. Ethereum mainnet)', () => {
    const agents = normalizeAgents([FIXTURE_AGENT_MODERN_SERVICES, FIXTURE_AGENT_ETHEREUM_SHOULD_BE_FILTERED]);
    const filtered = filterBscOnly(agents);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].chainId).toBe(97);
  });

  it('marks isBscNative correctly on each normalized agent', () => {
    const [bscAgent, ethAgent] = normalizeAgents([FIXTURE_AGENT_MODERN_SERVICES, FIXTURE_AGENT_ETHEREUM_SHOULD_BE_FILTERED]);
    expect(bscAgent.isBscNative).toBe(true);
    expect(ethAgent.isBscNative).toBe(false);
  });
});
