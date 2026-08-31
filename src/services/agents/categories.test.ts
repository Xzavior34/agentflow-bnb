import { describe, it, expect } from 'vitest';
import { normalizeAgent } from './normalize';
import { classifyAgent, countByCategory, FIRST_CLASS_CATEGORIES } from './categories';
import {
  FIXTURE_AGENT_MODERN_SERVICES,
  FIXTURE_AGENT_LEGACY_ENDPOINTS,
  FIXTURE_AGENT_BOTH_SHAPES,
  FIXTURE_AGENT_UNCATEGORIZABLE,
  FIXTURE_AGENT_MINIMAL,
} from './__fixtures__/rawAgents';

describe('classifyAgent', () => {
  it('classifies a rebalancing agent from its description', () => {
    const categories = classifyAgent(normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES));
    expect(categories).toContain('REBALANCING');
  });

  it('classifies a grid trading agent', () => {
    const categories = classifyAgent(normalizeAgent(FIXTURE_AGENT_LEGACY_ENDPOINTS));
    expect(categories).toContain('GRID_TRADING');
  });

  it('classifies a yield optimization agent', () => {
    const categories = classifyAgent(normalizeAgent(FIXTURE_AGENT_BOTH_SHAPES));
    expect(categories).toContain('YIELD_OPTIMIZATION');
  });

  it('returns UNCATEGORIZED when there is no matching evidence', () => {
    const categories = classifyAgent(normalizeAgent(FIXTURE_AGENT_UNCATEGORIZABLE));
    expect(categories).toEqual(['UNCATEGORIZED']);
  });

  it('returns UNCATEGORIZED rather than guessing when data is sparse', () => {
    const categories = classifyAgent(normalizeAgent(FIXTURE_AGENT_MINIMAL));
    expect(categories).toEqual(['UNCATEGORIZED']);
  });

  it('never randomly assigns a category — same input always yields same output', () => {
    const agent = normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES);
    const first = classifyAgent(agent);
    const second = classifyAgent(agent);
    expect(first).toEqual(second);
  });
});

describe('countByCategory', () => {
  it('counts agents per category, including multi-category agents in both buckets', () => {
    const agents = [
      normalizeAgent(FIXTURE_AGENT_MODERN_SERVICES), // REBALANCING
      normalizeAgent(FIXTURE_AGENT_LEGACY_ENDPOINTS), // GRID_TRADING
      normalizeAgent(FIXTURE_AGENT_UNCATEGORIZABLE), // UNCATEGORIZED
    ];
    const counts = countByCategory(agents);
    expect(counts.REBALANCING).toBe(1);
    expect(counts.GRID_TRADING).toBe(1);
    expect(counts.UNCATEGORIZED).toBe(1);
    expect(counts.HEALTH_FACTOR_MONITORING).toBe(0);
  });
});

describe('FIRST_CLASS_CATEGORIES', () => {
  it('contains exactly the four required categories, no more, no less', () => {
    expect(FIRST_CLASS_CATEGORIES).toHaveLength(4);
    expect(FIRST_CLASS_CATEGORIES).toEqual(
      expect.arrayContaining(['REBALANCING', 'GRID_TRADING', 'YIELD_OPTIMIZATION', 'HEALTH_FACTOR_MONITORING'])
    );
  });
});
