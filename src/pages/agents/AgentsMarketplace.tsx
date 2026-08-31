import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, Filter, Scale, BarChart3, Layers, Activity, Cpu, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAgents, useAgentSearch } from '@/hooks/useAgents';
import { FIRST_CLASS_CATEGORIES, CATEGORY_LABELS, countByCategory } from '@/services/agents/categories';
import { getTrustSignals, getEvidenceLevel } from '@/services/agents/trust';
import type { AgentFlowAgent, MarketplaceCategory } from '@/services/agents/types';
import { ACTIVE_NETWORK } from '@/config/networks';
import { ERC8183HireWizardModal } from '@/components/ERC8183HireWizardModal';
import { ERC8183JobReceiptModal } from '@/components/ERC8183JobReceiptModal';

const ALL_TAB = 'ALL' as const;
type CategoryTab = MarketplaceCategory | typeof ALL_TAB;

const MAX_COMPARE = 3;

export default function AgentsMarketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHirable = searchParams.get('filter') === 'hirable';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<CategoryTab>(ALL_TAB);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  
  // Real filter state
  const [hirableOnly, setHirableOnly] = useState(initialHirable);
  const [protocolFilter, setProtocolFilter] = useState<string | null>(null);
  const [x402Only, setX402Only] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Hire Modal State
  const [hiringAgent, setHiringAgent] = useState<AgentFlowAgent | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('filter') === 'hirable') {
      setHirableOnly(true);
    }
  }, [searchParams]);

  const listQuery = useAgents({ bscOnly: true, limit: 100 });
  const searchQueryResult = useAgentSearch(searchQuery, { bscOnly: true, limit: 100 });

  const isSearching = searchQuery.trim().length > 0;
  const activeQuery = isSearching ? searchQueryResult : listQuery;
  const agents = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

  const visibleAgents = useMemo(() => {
    return agents.filter((a) => {
      // Category filter
      if (activeTab !== ALL_TAB && !a.categories.includes(activeTab)) return false;

      // Hirable filter
      if (hirableOnly && a.activationStatus !== 'HIRABLE') return false;

      // Protocol filter
      if (protocolFilter && (!a.supportedProtocols || !a.supportedProtocols.includes(protocolFilter))) return false;

      // x402 filter
      if (x402Only && !a.x402Supported) return false;

      // Verified filter
      if (verifiedOnly && !a.isVerified) return false;

      return true;
    });
  }, [agents, activeTab, hirableOnly, protocolFilter, x402Only, verifiedOnly]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const compareAgents = agents.filter((a) => compareIds.includes(a.id));

  const activeFilterCount = (hirableOnly ? 1 : 0) + (protocolFilter ? 1 : 0) + (x402Only ? 1 : 0) + (verifiedOnly ? 1 : 0);

  const clearFilters = () => {
    setHirableOnly(false);
    setProtocolFilter(null);
    setX402Only(false);
    setVerifiedOnly(false);
    setSearchQuery('');
    setActiveTab(ALL_TAB);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-16 px-4 pb-32">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 mb-4">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs text-amber-400 font-semibold">BNB Agent Studio Marketplace</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Discover & Hire <span className="text-amber-400">Autonomous Agents</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Live onchain agent discovery, capability inspection, and verifiable escrow settlement across BNB Chain.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-mono mt-3">
            <span>Network: <strong className="text-foreground">{ACTIVE_NETWORK.chainName}</strong> (Chain {ACTIVE_NETWORK.chainId})</span>
            <span>·</span>
            <span>Registry: <strong className="text-foreground">ERC-8004</strong></span>
          </div>
        </div>

        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill (rebalancing, yield, grid), token ID, protocol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 text-xs sm:text-sm bg-muted/40 border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-6 overflow-x-auto pb-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoryTab)}>
            <TabsList className="bg-muted/40 border border-border p-1">
              <TabsTrigger value={ALL_TAB} className="font-mono text-xs">
                All Agents
              </TabsTrigger>
              {FIRST_CLASS_CATEGORIES.map((c) => (
                <TabsTrigger key={c} value={c} className="font-mono text-xs">
                  {CATEGORY_LABELS[c]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Activation & Protocol Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-mono">
          <span className="text-muted-foreground flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* HIRABLE Quick Filter Toggle */}
          <Badge
            variant={hirableOnly ? 'default' : 'outline'}
            onClick={() => setHirableOnly(!hirableOnly)}
            className={`cursor-pointer transition-all ${
              hirableOnly
                ? 'bg-emerald-500 text-neutral-950 font-bold border-emerald-400'
                : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            <Zap className="w-3 h-3 mr-1 fill-current" />
            HIRABLE ONLY (ERC-8183)
          </Badge>

          <Badge
            variant={protocolFilter === 'A2A' ? 'default' : 'outline'}
            onClick={() => setProtocolFilter(protocolFilter === 'A2A' ? null : 'A2A')}
            className="cursor-pointer border-border hover:border-amber-400"
          >
            A2A Protocol
          </Badge>
          <Badge
            variant={protocolFilter === 'MCP' ? 'default' : 'outline'}
            onClick={() => setProtocolFilter(protocolFilter === 'MCP' ? null : 'MCP')}
            className="cursor-pointer border-border hover:border-amber-400"
          >
            MCP Protocol
          </Badge>
          <Badge
            variant={x402Only ? 'default' : 'outline'}
            onClick={() => setX402Only(!x402Only)}
            className="cursor-pointer border-border hover:border-amber-400"
          >
            x402 Protocol
          </Badge>

          {activeFilterCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}

          <span className="ml-auto text-muted-foreground">
            Showing <strong>{visibleAgents.length}</strong> of {agents.length}
          </span>
        </div>

        {/* Loading State */}
        {activeQuery.isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error State */}
        {activeQuery.isError && (
          <Alert variant="destructive" className="max-w-xl mx-auto my-8">
            <AlertTitle>Unable to Load BSC Agents</AlertTitle>
            <AlertDescription>
              {activeQuery.error instanceof Error ? activeQuery.error.message : '8004scan public API is currently unreachable.'}
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={() => activeQuery.refetch()} className="font-mono text-xs">
                  Retry Connection
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!activeQuery.isLoading && !activeQuery.isError && visibleAgents.length === 0 && (
          <div className="glass-card p-12 text-center max-w-xl mx-auto my-8">
            <Cpu className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-base mb-1">No Matching Agents Found</h3>
            <p className="text-xs text-muted-foreground mb-6">
              {isSearching || activeFilterCount > 0
                ? 'Try broadening your search query or removing active filters.'
                : 'No agents indexed in this category yet.'}
            </p>
            <Button size="sm" variant="outline" onClick={clearFilters} className="font-mono text-xs">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Agent Cards Grid */}
        {!activeQuery.isLoading && visibleAgents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAgents.map((agent) => (
              <MarketplaceAgentCard
                key={agent.id}
                agent={agent}
                selected={compareIds.includes(agent.id)}
                compareDisabled={!compareIds.includes(agent.id) && compareIds.length >= MAX_COMPARE}
                onToggleCompare={() => toggleCompare(agent.id)}
                onHire={() => setHiringAgent(agent)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Compare Tray */}
      {compareAgents.length >= 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md shadow-2xl">
          <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-foreground">
                Comparing {compareAgents.length} Agents:
              </span>
              <div className="flex gap-2">
                {compareAgents.map((a) => (
                  <Badge key={a.id} variant="secondary" className="font-mono text-xs flex items-center gap-1">
                    {a.name ?? a.id}
                    <button onClick={() => toggleCompare(a.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-semibold">
                <Link to={`/compare?ids=${compareIds.join(',')}`}>
                  View Comparison <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCompareIds([])} className="font-mono text-xs text-muted-foreground">
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Guided ERC-8183 Hiring Wizard Modal */}
      {hiringAgent && (
        <ERC8183HireWizardModal
          agent={hiringAgent}
          isOpen={Boolean(hiringAgent)}
          onClose={() => setHiringAgent(null)}
          onOpenReceipt={() => setShowReceiptModal(true)}
        />
      )}

      {/* Cryptographic Job Receipt Modal */}
      {showReceiptModal && (
        <ERC8183JobReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}

function MarketplaceAgentCard({
  agent,
  selected,
  compareDisabled,
  onToggleCompare,
  onHire,
}: {
  agent: AgentFlowAgent;
  selected: boolean;
  compareDisabled: boolean;
  onToggleCompare: () => void;
  onHire: () => void;
}) {
  const signals = getTrustSignals(agent);
  const evidenceLevel = getEvidenceLevel(signals);
  const isHirable = agent.activationStatus === 'HIRABLE';

  // Activation Badge styling
  const renderActivationBadge = () => {
    switch (agent.activationStatus) {
      case 'HIRABLE':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] font-mono font-bold animate-pulse">
            <Zap className="w-3 h-3 mr-1 fill-emerald-400" />
            HIRABLE (ERC-8183)
          </Badge>
        );
      case 'PAYABLE':
        return (
          <Badge className="bg-amber-400/20 text-amber-400 border-amber-400/40 text-[10px] font-mono">
            PAYABLE (x402)
          </Badge>
        );
      case 'CALLABLE':
        return (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 text-[10px] font-mono">
            CALLABLE ({agent.supportedProtocols?.[0] || 'A2A/MCP'})
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground border-border text-[10px] font-mono">
            DISCOVERY ONLY
          </Badge>
        );
    }
  };

  return (
    <div className={`glass-card p-5 flex flex-col justify-between transition-all hover:border-amber-400/40 ${selected ? 'border-amber-400 ring-1 ring-amber-400/30' : ''}`}>
      <div>
        {/* Header / Identity */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-base truncate text-foreground">{agent.name ?? 'Unnamed Agent'}</h3>
            <p className="text-[11px] text-muted-foreground font-mono">
              BSC-{agent.chainId ?? '?'}:{agent.tokenId ?? '?'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {renderActivationBadge()}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {agent.description ?? 'No description declared in registered agent metadata.'}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.categories.map((c) => (
            <Badge key={c} variant="secondary" className="text-[10px] font-mono">
              {CATEGORY_LABELS[c]}
            </Badge>
          ))}
        </div>

        {/* Protocol Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {agent.supportedProtocols?.map((p) => (
            <Badge key={p} variant="outline" className="text-[10px] font-mono border-border text-foreground">
              {p}
            </Badge>
          ))}
          {agent.x402Supported && (
            <Badge variant="outline" className="text-[10px] font-mono text-amber-400 border-amber-400/40">
              x402
            </Badge>
          )}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-3">
          <span>{agent.feedbackCount !== null ? `${agent.feedbackCount} Feedbacks` : 'Unrated'}</span>
          <span>{agent.reputationScore !== null ? `Rep: ${agent.reputationScore}` : 'No Rep Score'}</span>
        </div>

        <div className="flex gap-2">
          {/* Prominent Hire Agent CTA for Hirable Agents */}
          {isHirable ? (
            <Button
              onClick={onHire}
              size="sm"
              className="flex-1 font-mono text-xs h-8 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)] gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-neutral-950" />
              Hire Agent
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="flex-1 font-mono text-xs h-8 border-border hover:border-amber-400">
              <Link to={`/agents/${agent.chainId}/${agent.tokenId}`}>View Agent</Link>
            </Button>
          )}

          <Button
            size="sm"
            variant={selected ? 'default' : 'outline'}
            className={`font-mono text-xs h-8 ${selected ? 'bg-neutral-800 text-amber-400 border-amber-400/50' : 'border-border hover:border-amber-400'}`}
            disabled={compareDisabled}
            onClick={onToggleCompare}
          >
            {selected ? 'Comparing' : 'Compare'}
          </Button>
        </div>
      </div>
    </div>
  );
}
