/**
 * Data provenance tagging.
 *
 * Every field on a normalized AgentFlowAgent should be traceable to where it
 * came from, so the UI never presents an AgentFlow-derived guess (like
 * category classification) with the same confidence as an onchain fact.
 * See docs/DATA_INTEGRITY_AUDIT.md and docs/BNB_PROTOCOL_RESEARCH.md.
 */

export type ProvenanceSource =
  | 'ONCHAIN'          // Read directly from the ERC-8004/8183 contracts (or an indexer's faithful mirror of them)
  | '8004SCAN'         // From 8004scan's indexed API response (feedback, reputation, activity, etc.)
  | 'AGENT_METADATA'   // From the agent's own registration file / agent URI / agent card (self-reported)
  | 'AGENTFLOW_DERIVED'; // Computed/classified by AgentFlow itself (e.g. category classification)

export interface Provenance {
  source: ProvenanceSource;
  /** ISO timestamp of when this value was retrieved/computed, for cache-age transparency. */
  retrievedAt: string;
}

export interface Provenanced<T> {
  value: T;
  provenance: Provenance;
}

export function provenance(source: ProvenanceSource, retrievedAt: string = new Date().toISOString()): Provenance {
  return { source, retrievedAt };
}

export function withProvenance<T>(value: T, source: ProvenanceSource, retrievedAt?: string): Provenanced<T> {
  return { value, provenance: provenance(source, retrievedAt) };
}
