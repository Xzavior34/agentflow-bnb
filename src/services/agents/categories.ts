import type { AgentFlowAgent, MarketplaceCategory } from './types';

/**
 * Deterministic, keyword/capability-based classification into the four
 * first-class categories the BNB track requires equal depth across.
 * Never random, never LLM-guessed for Phase 2 — see the Phase 2 brief's
 * explicit "do NOT assign random categories" instruction.
 *
 * An agent can match multiple categories. If no category's evidence
 * threshold is met, the agent is UNCATEGORIZED rather than force-fit
 * somewhere for the sake of a nicer-looking count.
 *
 * This is intentionally simple (substring matching over name/description/
 * capabilities/tags) rather than a scored model, so the rule set is fully
 * auditable — see docs/TRUST_METHODOLOGY.md when written for the
 * equivalent transparency principle applied to reputation.
 */

const CATEGORY_KEYWORDS: Record<Exclude<MarketplaceCategory, 'UNCATEGORIZED'>, string[]> = {
  REBALANCING: [
    'rebalance',
    'rebalancing',
    'portfolio balance',
    'allocation drift',
    'target allocation',
    're-centers the position',
    'portfolio',
  ],
  GRID_TRADING: [
    'grid trading',
    'grid bot',
    'grid strategy',
    'range trading',
    'grid trade',
    'range trade',
    'trading agent',
    'market maker',
  ],
  YIELD_OPTIMIZATION: [
    'yield optimization',
    'yield optimisation',
    'yield farming',
    'apy optimization',
    'auto-compound',
    'autocompound',
    'best yield',
    'yield aggregat',
    'yield scout',
    'supply yield',
    'yield',
  ],
  HEALTH_FACTOR_MONITORING: [
    'health factor',
    'health-factor',
    'liquidation protection',
    'liquidation risk',
    'lending monitor',
    'collateral ratio',
    'liquidation warning',
    'proofops',
    'risk monitor',
  ],
};

function collectSearchableText(agent: Pick<AgentFlowAgent, 'name' | 'description' | 'capabilities' | 'services'>): string {
  const parts: string[] = [];
  if (agent.name) parts.push(agent.name);
  if (agent.description) parts.push(agent.description);
  if (agent.capabilities?.length) parts.push(agent.capabilities.join(' '));
  if (agent.services?.length) {
    parts.push(agent.services.map((s) => `${s.name} ${s.capabilities.join(' ')}`).join(' '));
  }
  return parts.join(' ').toLowerCase();
}

export function classifyAgent(
  agent: Pick<AgentFlowAgent, 'name' | 'description' | 'capabilities' | 'services'>
): MarketplaceCategory[] {
  const text = collectSearchableText(agent);
  if (!text.trim()) return ['UNCATEGORIZED'];

  const matched = (Object.keys(CATEGORY_KEYWORDS) as Array<Exclude<MarketplaceCategory, 'UNCATEGORIZED'>>).filter(
    (category) => CATEGORY_KEYWORDS[category].some((keyword) => text.includes(keyword))
  );

  return matched.length > 0 ? matched : ['UNCATEGORIZED'];
}

export const FIRST_CLASS_CATEGORIES: Exclude<MarketplaceCategory, 'UNCATEGORIZED'>[] = [
  'REBALANCING',
  'GRID_TRADING',
  'YIELD_OPTIMIZATION',
  'HEALTH_FACTOR_MONITORING',
];

export const CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  REBALANCING: 'Rebalancing',
  GRID_TRADING: 'Grid Trading',
  YIELD_OPTIMIZATION: 'Yield Optimization',
  HEALTH_FACTOR_MONITORING: 'Health Factor Monitoring',
  UNCATEGORIZED: 'Uncategorized',
};

export function countByCategory(agents: AgentFlowAgent[]): Record<MarketplaceCategory, number> {
  const counts: Record<MarketplaceCategory, number> = {
    REBALANCING: 0,
    GRID_TRADING: 0,
    YIELD_OPTIMIZATION: 0,
    HEALTH_FACTOR_MONITORING: 0,
    UNCATEGORIZED: 0,
  };
  for (const agent of agents) {
    for (const category of agent.categories) {
      counts[category]++;
    }
  }
  return counts;
}
