import { describe, it, expect } from 'vitest';
import { getTrustSignals, getEvidenceLevel } from './trust';
import { normalizeAgent } from './normalize';
import { FIXTURE_AGENT_MODERN_SERVICES, FIXTURE_AGENT_MINIMAL } from './__fixtures__/rawAgents';

describe('getTrustSignals', () => {
  it('reports onchain identity present when owner and registry exist', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES);
    const signals = getTrustSignals(agent);
    const identity = signals.find((s) => s.key === 'onchainIdentity');
    expect(identity?.present).toBe(true);
  });

  it('reports no signals present for a sparse agent, never invents evidence', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MINIMAL);
    const signals = getTrustSignals(agent);
    const presentSignals = signals.filter((s) => s.present);
    expect(presentSignals).toHaveLength(0);
  });

  it('every signal carries a human-readable rule', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES);
    const signals = getTrustSignals(agent);
    for (const signal of signals) {
      expect(signal.rule.length).toBeGreaterThan(0);
    }
  });
});

describe('getEvidenceLevel', () => {
  it('returns "Limited evidence" when no signals are present', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MINIMAL);
    expect(getEvidenceLevel(getTrustSignals(agent))).toBe('Limited evidence');
  });

  it('returns a higher level for an agent with more signals present', () => {
    const sparse = getEvidenceLevel(getTrustSignals(normalizeAgent(FIXTURE_AGENT_MINIMAL)));
    const richer = getEvidenceLevel(getTrustSignals(normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES)));
    const order: Record<string, number> = { 'Limited evidence': 0, 'Some evidence': 1, 'Strong evidence': 2 };
    expect(order[richer]).toBeGreaterThanOrEqual(order[sparse]);
  });
});
