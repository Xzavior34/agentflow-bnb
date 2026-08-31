export interface AgentProofData {
  id: string;
  chain: string;
  onchainId: string;
  registryAddress: string;
  measuredAvailability?: number;
  evidenceSufficiency?: string;
  observationCount?: number;
  medianLatencyMs?: number;
  lastMeasuredAt?: string;
  provenance: {
    source: string;
    origin: string;
    observedAt: string;
  };
}

const AGENTPROOF_BASE_URL = 'https://agentproof-rho.vercel.app/api/v1';

export async function fetchAgentProofPassport(
  chainId: number | string,
  tokenId: string
): Promise<AgentProofData | null> {
  try {
    const chainSlug = Number(chainId) === 97 || String(chainId).toLowerCase().includes('bsc') ? 'bsc' : 'bsc';
    const res = await fetch(`${AGENTPROOF_BASE_URL}/agents/${chainSlug}/${tokenId}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data || data;
  } catch (err) {
    console.warn('[AgentProof Integration] Live API check deferred/unavailable:', err);
    return null;
  }
}
