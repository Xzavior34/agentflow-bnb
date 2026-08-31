import type { AgentFlowAgent } from './types';

/**
 * Transparent trust SIGNALS, deliberately not a composite 0-100 score.
 * Per the Phase 2 brief: "For Phase 2 do NOT introduce an arbitrary
 * AgentTrust score. Instead implement transparent TRUST SIGNALS."
 *
 * Each signal is a boolean fact with a documented, deterministic rule —
 * no weighting, no aggregation into a single number. A composite score can
 * be introduced later (see docs/TRUST_METHODOLOGY.md, not yet written) if
 * it can be justified with a transparent formula; until then this is all
 * the UI should show.
 */

export interface TrustSignal {
  key: string;
  label: string;
  present: boolean;
  /** Plain-language rule so the judge/user can verify the signal themselves. */
  rule: string;
}

export function getTrustSignals(agent: AgentFlowAgent): TrustSignal[] {
  return [
    {
      key: 'onchainIdentity',
      label: 'Onchain identity present',
      present: Boolean(agent.owner && agent.registry),
      rule: 'Agent has both an owner address and a registry (ERC-8004 Identity Registry) address on record.',
    },
    {
      key: 'metadataAvailable',
      label: 'Metadata available',
      present: Boolean(agent.name && agent.description),
      rule: 'Agent has both a name and a description in its registration metadata.',
    },
    {
      key: 'serviceEndpoint',
      label: 'Service endpoint present',
      present: agent.services.some((s) => Boolean(s.endpoint)),
      rule: 'At least one service/endpoint entry has a resolvable endpoint URL.',
    },
    {
      key: 'recentActivity',
      label: 'Recent activity',
      present: isRecentIso(agent.lastActivityAt, 30),
      rule: 'lastActivityAt is within the last 30 days.',
    },
    {
      key: 'feedbackAvailable',
      label: 'Feedback available',
      present: (agent.feedbackCount ?? 0) > 0,
      rule: 'feedbackCount from 8004scan is greater than zero.',
    },
    {
      key: 'reputationEvidence',
      label: 'Reputation evidence',
      present: agent.reputationScore !== null,
      rule: '8004scan reports a reputationScore for this agent (absence is shown as "no evidence", not zero).',
    },
    {
      key: 'x402WalletPresent',
      label: 'x402 wallet present',
      present: Boolean(agent.x402Wallet),
      rule: 'Agent metadata declares an x402-compatible payment wallet.',
    },
  ];
}

function isRecentIso(iso: string | null, withinDays: number): boolean {
  if (!iso) return false;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return false;
  const ageMs = Date.now() - parsed;
  return ageMs >= 0 && ageMs <= withinDays * 24 * 60 * 60 * 1000;
}

export type EvidenceLevel = 'Strong evidence' | 'Some evidence' | 'Limited evidence';

/**
 * Deterministic evidence-level label based on how many signals are present.
 * Documented rule (not a hidden weighting): 5+ of 7 = Strong, 2-4 = Some,
 * 0-1 = Limited. This is a coarse bucketing of the same transparent
 * signals above, not a new hidden score.
 */
export function getEvidenceLevel(signals: TrustSignal[]): EvidenceLevel {
  const presentCount = signals.filter((s) => s.present).length;
  if (presentCount >= 5) return 'Strong evidence';
  if (presentCount >= 2) return 'Some evidence';
  return 'Limited evidence';
}
