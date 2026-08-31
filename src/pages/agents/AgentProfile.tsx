import { useParams, Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowLeft, ShieldCheck, Zap, Receipt, Cpu, CheckCircle2, Lock, AlertCircle, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAgentProfile } from '@/hooks/useAgents';
import { getTrustSignals, getEvidenceLevel } from '@/services/agents/trust';
import { CATEGORY_LABELS } from '@/services/agents/categories';
import { NETWORKS, ACTIVE_NETWORK } from '@/config/networks';
import { ERC8183JobReceiptModal } from '@/components/ERC8183JobReceiptModal';
import { ERC8183HireWizardModal } from '@/components/ERC8183HireWizardModal';
import type { JobReceipt } from '@/services/commerce/types';

function explorerUrlForChain(chainId: number | null): string | null {
  if (chainId === NETWORKS.bscMainnet.chainId) return NETWORKS.bscMainnet.explorerUrl;
  if (chainId === NETWORKS.bscTestnet.chainId) return NETWORKS.bscTestnet.explorerUrl;
  return null;
}

export default function AgentProfile() {
  const { chainId: chainIdParam, tokenId } = useParams<{ chainId: string; tokenId: string }>();
  const chainId = Number(chainIdParam);
  const [searchParams] = useSearchParams();

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isHireWizardOpen, setIsHireWizardOpen] = useState(false);

  const { data: agent, isLoading, isError, error } = useAgentProfile(chainId, tokenId ?? '');

  useEffect(() => {
    if (searchParams.get('hire') === 'true') {
      setIsHireWizardOpen(true);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Alert variant="destructive">
            <AlertTitle>Agent Record Not Found</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'This agent could not be found on 8004scan or the registry.'}
            </AlertDescription>
          </Alert>
          <Button asChild variant="ghost" className="mt-4 font-mono text-xs">
            <Link to="/agents">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const signals = getTrustSignals(agent);
  const evidenceLevel = getEvidenceLevel(signals);
  const explorerUrl = explorerUrlForChain(agent.chainId);

  const isHirable = agent.activationStatus === 'HIRABLE';

  return (
    <div className="min-h-screen py-16 px-4 pb-32">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation */}
        <Button asChild variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground">
          <Link to="/agents">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Marketplace
          </Link>
        </Button>

        {/* Header / Identity Banner */}
        <div className="glass-card p-6 md:p-8 mb-6 border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {agent.name ?? 'Unnamed Agent'}
                </h1>
                {agent.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" title="Verified Publisher" />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                ERC-8004 Token ID: <strong className="text-amber-400">#{agent.tokenId ?? '?'}</strong> · Network: BSC-{agent.chainId ?? '?'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={evidenceLevel === 'Strong evidence' ? 'default' : 'outline'} className="font-mono text-xs">
                {evidenceLevel}
              </Badge>
              {isHirable ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-mono text-xs font-bold animate-pulse">
                  <Zap className="w-3 h-3 mr-1 fill-emerald-400" />
                  HIRABLE (ERC-8183)
                </Badge>
              ) : (
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                  {agent.activationStatus}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-6">
            {agent.description ?? 'No description declared in registered agent metadata.'}
          </p>

          {/* Activation Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-muted/30 border border-border/50 font-mono text-xs mb-6">
            <div>
              <span className="text-muted-foreground block text-[11px]">Activation Method:</span>
              <strong className="text-foreground font-semibold">
                {isHirable ? 'ERC-8183 Escrow Commerce' : agent.supportedProtocols?.[0] || 'Protocol Call'}
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Network / Chain:</span>
              <strong className="text-amber-400 font-semibold">
                {ACTIVE_NETWORK.chainName} ({ACTIVE_NETWORK.chainId})
              </strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Payment Mechanism:</span>
              <strong className="text-emerald-400 font-semibold">
                {isHirable ? 'United Stables U / tBNB' : 'Direct Call'}
              </strong>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              onClick={() => setIsHireWizardOpen(true)}
              size="lg"
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-sm font-bold shadow-[0_0_15px_rgba(251,191,36,0.25)] gap-2 px-8"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              {isHirable
                ? 'Hire Agent (ERC-8183 Escrow)'
                : agent.activationStatus === 'PAYABLE'
                ? 'Pay & Hire Agent (x402)'
                : agent.activationStatus === 'CALLABLE'
                ? 'Call & Hire Agent (A2A/MCP)'
                : 'Hire Agent (Escrow Sandbox)'}
            </Button>

            <Button
              onClick={() => setIsReceiptOpen(true)}
              variant="outline"
              size="lg"
              className="font-mono text-xs gap-2 border-border hover:border-amber-400"
            >
              <Receipt className="w-4 h-4" />
              Inspect Onchain Job Receipt
            </Button>
          </div>
        </div>

        {/* Capabilities & Declared Services */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Declared Capabilities & Protocol Services
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
              Provenance: AGENT_METADATA
            </Badge>
          </div>

          {agent.services.length > 0 && (
            <div className="mb-6 space-y-3">
              {agent.services.map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-neutral-950/60 border border-border/50 text-xs font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">{s.name}</span>
                    <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                  </div>
                  {s.endpoint && (
                    <p className="text-muted-foreground truncate" title={s.endpoint}>
                      Endpoint: {s.endpoint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="font-mono text-xs">
                {cap}
              </Badge>
            ))}
          </div>
        </section>

        {/* Deterministic Trust & Provenance Signals */}
        <section className="glass-card p-6 mb-6">
          <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Deterministic Identity & Protocol Evidence
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
              <span className="text-muted-foreground text-[11px]">ERC-8004 Registry Contract:</span>
              <p className="font-semibold text-foreground truncate">{agent.registry ?? '0x8004A818BFB912233c491871b3d84c89A494BD9e'}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
              <span className="text-muted-foreground text-[11px]">Publisher / Owner Address:</span>
              <p className="font-semibold text-foreground truncate">{agent.owner ?? 'Unspecified'}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
              <span className="text-muted-foreground text-[11px]">8004scan Star Rating:</span>
              <p className="font-semibold text-foreground">{agent.starCount} Stars</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/20 border border-border space-y-1">
              <span className="text-muted-foreground text-[11px]">Total Feedbacks Index:</span>
              <p className="font-semibold text-foreground">{agent.feedbackCount ?? 'Not rated'}</p>
            </div>
          </div>

          {explorerUrl && agent.registry && (
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
              <Button asChild variant="outline" size="sm" className="font-mono text-xs gap-1.5">
                <a href={`${explorerUrl}/address/${agent.registry}`} target="_blank" rel="noreferrer">
                  View Registry on BscScan <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          )}
        </section>

        {/* Independent Reliability Evidence — Provided by AgentProof */}
        <section className="glass-card p-6 mb-6 border-amber-400/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Independent Reliability Evidence — Provided by AgentProof
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono text-amber-400 border-amber-400/40">
              INDEPENDENT PROBE DATA
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            AgentProof continuously monitors onchain reachability, response latency, and reputation integrity across BNB Chain agents.
          </p>

          <div className="p-4 rounded-lg bg-muted/30 border border-border/40 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Passport Index Status:</span>
              <span className="text-foreground font-semibold">
                Independent reliability evidence not yet available
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/30">
              <span>Canonical Target: {agent.chainId ? `BSC:${agent.chainId}:${agent.tokenId}` : 'BSC-97'}</span>
              <a
                href="https://agentproof-rho.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                View Full Reliability Passport <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Hire Wizard Modal */}
      {isHireWizardOpen && agent && (
        <ERC8183HireWizardModal
          agent={agent}
          isOpen={isHireWizardOpen}
          onClose={() => setIsHireWizardOpen(false)}
          onOpenReceipt={() => setIsReceiptOpen(true)}
        />
      )}

      {/* Job Receipt Modal */}
      {isReceiptOpen && (
        <ERC8183JobReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </div>
  );
}
