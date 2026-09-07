export interface AgentProofData {
  id: string;
  chain: string;
  onchainId: string;
  registryAddress?: string;
  availabilityPct?: number | null;
  dataSufficiency?: string;
  observationCount?: number;
  medianLatencyMs?: number | null;
  p95LatencyMs?: number | null;
  consecutiveFailures?: number;
  lastProbeAt?: string | null;
  directApiUrl: string;
}

const AGENTPROOF_BASE_URL = 'https://agentproof-rho.vercel.app/api/v1';

export function getAgentProofDirectUrl(tokenId: string, endpoint: 'reliability' | 'reputation-integrity' | 'services' | 'data' = 'reliability'): string {
  const formattedId = tokenId.startsWith('bsc:') ? tokenId : `bsc:${tokenId}`;
  if (endpoint === 'data') {
    return `${AGENTPROOF_BASE_URL}/agents/bsc/${formattedId}`;
  }
  return `${AGENTPROOF_BASE_URL}/agents/bsc/${formattedId}/${endpoint}`;
}

export async function fetchAgentProofPassport(
  chainId: number | string,
  tokenId: string
): Promise<AgentProofData | null> {
  try {
    const formattedId = tokenId.startsWith('bsc:') ? tokenId : `bsc:${tokenId}`;
    const directApiUrl = getAgentProofDirectUrl(tokenId, 'reliability');

    const res = await fetch(directApiUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    const windows = json?.data?.windows;
    const windowData = windows?.['24h'] || windows?.['7d'] || windows?.['30d'];

    if (!windowData) {
      return null;
    }

    return {
      id: formattedId,
      chain: 'bsc',
      onchainId: tokenId.replace(/^bsc:/, ''),
      availabilityPct: windowData.availabilityPct ?? null,
      dataSufficiency: windowData.dataSufficiency ?? 'UNKNOWN',
      observationCount: windowData.observationCount ?? 0,
      medianLatencyMs: windowData.medianLatencyMs ?? null,
      p95LatencyMs: windowData.p95LatencyMs ?? null,
      consecutiveFailures: windowData.consecutiveFailures ?? 0,
      lastProbeAt: windowData.lastProbeAt || windowData.lastSuccessfulProbeAt || null,
      directApiUrl,
    };
  } catch (err) {
    console.warn('[AgentProof Integration] Live API check error:', err);
    return null;
  }
}
