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
  badgeUrl: string;
}

export interface AgentProofHealth {
  status: string;
  version: string;
  monitoringFreshness: string;
  latestRunAt: string | null;
}

const AGENTPROOF_BASE_URL = 'https://agentproof-rho.vercel.app/api/v1';

export function getAgentProofDirectUrl(
  tokenId: string,
  endpoint: 'reliability' | 'reputation-integrity' | 'services' | 'observations' | 'data' = 'reliability'
): string {
  const cleanId = tokenId.trim();
  const formattedId = cleanId.startsWith('bsc:') ? cleanId : `bsc:${cleanId}`;
  if (endpoint === 'data') {
    return `${AGENTPROOF_BASE_URL}/agents/bsc/${formattedId}`;
  }
  return `${AGENTPROOF_BASE_URL}/agents/bsc/${formattedId}/${endpoint}`;
}

export function getAgentProofWebPassportUrl(tokenId: string): string {
  const cleanId = tokenId.trim();
  const formattedId = cleanId.startsWith('bsc:') ? cleanId : `bsc:${cleanId}`;
  return `https://agentproof-rho.vercel.app/agents/bsc/${formattedId}`;
}

export function getAgentProofBadgeUrl(tokenId: string): string {
  const cleanId = tokenId.trim();
  const formattedId = cleanId.startsWith('bsc:') ? cleanId : `bsc:${cleanId}`;
  return `${AGENTPROOF_BASE_URL}/agents/bsc/${formattedId}/badge.svg`;
}

export async function fetchAgentProofHealth(): Promise<AgentProofHealth | null> {
  try {
    const res = await fetch(`${AGENTPROOF_BASE_URL}/health`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return {
      status: json?.data?.status || 'ok',
      version: json?.data?.version || '0.1.0',
      monitoringFreshness: json?.data?.monitoring?.freshness || 'FRESH',
      latestRunAt: json?.data?.monitoring?.latestRunAt || null,
    };
  } catch (err) {
    console.warn('[AgentProof Health] API un-reachable:', err);
    return null;
  }
}

export async function fetchAgentProofPassport(
  chainId: number | string,
  tokenId: string
): Promise<AgentProofData | null> {
  try {
    const cleanId = tokenId.trim();
    if (!cleanId) return null;

    const formattedId = cleanId.startsWith('bsc:') ? cleanId : `bsc:${cleanId}`;
    const directApiUrl = getAgentProofDirectUrl(cleanId, 'reliability');
    const badgeUrl = getAgentProofBadgeUrl(cleanId);

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
      onchainId: cleanId.replace(/^bsc:/, ''),
      availabilityPct: windowData.availabilityPct ?? null,
      dataSufficiency: windowData.dataSufficiency ?? 'UNKNOWN',
      observationCount: windowData.observationCount ?? 0,
      medianLatencyMs: windowData.medianLatencyMs ?? null,
      p95LatencyMs: windowData.p95LatencyMs ?? null,
      consecutiveFailures: windowData.consecutiveFailures ?? 0,
      lastProbeAt: windowData.lastProbeAt || windowData.lastSuccessfulProbeAt || null,
      directApiUrl,
      badgeUrl,
    };
  } catch (err) {
    console.warn('[AgentProof Integration] Live API check error:', err);
    return null;
  }
}
