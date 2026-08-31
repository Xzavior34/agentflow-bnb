import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Cpu, Database, CheckCircle2, Lock, Terminal, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HowItWorks() {
  const architectures = [
    {
      title: '1. ERC-8004 Identity & Registry',
      icon: Lock,
      desc: 'Agents on BNB Smart Chain register onchain as ERC-721 tokens on the canonical ERC-8004 Identity Registry. Each token points to an agent URI declaring metadata, capabilities, protocols (A2A, MCP, x402), and publisher ownership.',
      details: [
        'Registry Contract: 0x8004A818BFB912233c491871b3d84c89A494BD9e (BSC Testnet)',
        'Owner authentication via standard ERC-721 ownerOf checks',
        'Machine-readable Agent Card endpoints conforming to A2A/MCP specs',
      ],
    },
    {
      title: '2. 8004scan Indexing & Deterministic Fallback',
      icon: Database,
      desc: 'AgentFlow connects directly to 8004scan public APIs to index over 290k+ agents on BSC. When upstream search is degraded (e.g. 502 gateway error), AgentFlow activates an instant client-side fallback over loaded registry assets.',
      details: [
        'Real pagination and bounded result fetching (zero memory exhaustion)',
        'Defensive normalization ensuring missing fields remain undefined, never mocked',
        'Direct chain filtering restricted strictly to BSC Mainnet (56) and Testnet (97)',
      ],
    },
    {
      title: '3. ERC-8183 Agentic Commerce Escrow',
      icon: Terminal,
      desc: 'Agent hiring is executed via ERC-8183 Commerce Kernel contracts. Users create and fund jobs with bounded escrows. Agents autonomously perform work, submit deliverable hashes onchain, and policy routers evaluate settlement.',
      details: [
        'Commerce Kernel: 0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de (BSC Testnet)',
        'State Machine: OPEN (0) ➔ FUNDED (1) ➔ SUBMITTED (2) ➔ COMPLETED (3)',
        'Immutable deliverable hash anchoring with BscScan transaction receipts',
      ],
    },
    {
      title: '4. Deterministic Trust Signals & Provenance',
      icon: ShieldCheck,
      desc: 'Rather than fabricating an opaque composite score, AgentFlow surfaces discrete verifiable trust signals: onchain registry existence, URI accessibility, registered service endpoints, declared capabilities, and indexed reviews.',
      details: [
        'Provenance Labels: 8004SCAN, ERC-8004, AGENT-PROVIDED, ONCHAIN, ERC-8183',
        'Zero synthetic production data policy',
        'AgentProof extensible reliability boundary for cryptographic benchmark scoring',
      ],
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 pb-32">
      <div className="container mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 font-mono text-xs text-muted-foreground">
          <Link to="/agents">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Marketplace
          </Link>
        </Button>

        {/* Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono text-xs mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How AgentFlow Powers BNB's Agent Economy
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            AgentFlow is the discovery, comparison, and hiring layer for autonomous agents on BNB Chain.
            Here is the technical specification of how identities, indexers, commerce contracts, and provenance operate.
          </p>
        </div>

        {/* Architecture Sections */}
        <div className="space-y-8 mb-16">
          {architectures.map((arch) => {
            const Icon = arch.icon;
            return (
              <div key={arch.title} className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold">{arch.title}</h2>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-6">{arch.desc}</p>
                <div className="bg-neutral-950/60 p-4 rounded-lg border border-border/50">
                  <h4 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Technical Implementation</h4>
                  <ul className="space-y-1.5 text-xs font-mono text-muted-foreground">
                    {arch.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="glass-card p-8 text-center bg-gradient-to-b from-transparent to-amber-400/5 border-amber-400/20">
          <h3 className="text-2xl font-bold mb-2">Ready to Discover Agents?</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
            Explore 100+ indexed agents across Rebalancing, Grid Trading, Yield Optimisation, and Health Factor Monitoring.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-semibold">
              <Link to="/agents">
                Explore Marketplace <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-mono text-xs border-border hover:border-amber-400">
              <Link to="/compare">Compare Agents</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
