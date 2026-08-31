import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, Scale, BarChart3, Layers, Activity, Search, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAgents } from '@/hooks/useAgents';
import { CATEGORY_LABELS, type MarketplaceCategory } from '@/services/agents/categories';
import { getTrustSignals, getEvidenceLevel } from '@/services/agents/trust';
import type { AgentFlowAgent } from '@/services/agents/types';
import { ERC8183HireWizardModal } from '@/components/ERC8183HireWizardModal';
import { ERC8183JobReceiptModal } from '@/components/ERC8183JobReceiptModal';

const SLUG_TO_CATEGORY: Record<string, MarketplaceCategory> = {
  'rebalancing': 'REBALANCING',
  'grid-trading': 'GRID_TRADING',
  'yield-optimisation': 'YIELD_OPTIMIZATION',
  'yield-optimization': 'YIELD_OPTIMIZATION',
  'health-factor': 'HEALTH_FACTOR_MONITORING',
  'health-factor-monitoring': 'HEALTH_FACTOR_MONITORING',
};

const CATEGORY_DETAILS: Record<
  Exclude<MarketplaceCategory, 'UNCATEGORIZED'>,
  {
    title: string;
    description: string;
    icon: typeof Scale;
    evaluationCriteria: Array<{ label: string; detail: string }>;
    supportedUseCases: string[];
  }
> = {
  REBALANCING: {
    title: 'Rebalancing Agents',
    description:
      'Autonomous agents designed to monitor decentralized exchange (DEX) liquidity pools, calculate allocation drifts, and reposition capital into optimal price bands.',
    icon: Scale,
    evaluationCriteria: [
      { label: 'DEX Protocols', detail: 'PancakeSwap v3, Uniswap v3, Thena, BiSwap' },
      { label: 'Position Model', detail: 'Concentrated Liquidity (CLMM), Multi-asset index weights' },
      { label: 'Automation Mode', detail: 'Automated drift trigger vs keeper rebalancing' },
      { label: 'Execution Safety', detail: 'Max slippage bounds, deadband buffers, rebalance frequency' },
    ],
    supportedUseCases: ['PancakeSwap v3 range management', 'Stablecoin pair peg-drift defense', 'Index liquidity re-centering'],
  },
  GRID_TRADING: {
    title: 'Grid Trading Agents',
    description:
      'Algorithmic agents that place systematic buy and sell orders at designated intervals within predefined price channels on BNB Chain markets.',
    icon: BarChart3,
    evaluationCriteria: [
      { label: 'Market Pair', detail: 'BNB/USDT, BTCB/USDT, ETH/BNB onchain pairs' },
      { label: 'Grid Topology', detail: 'Arithmetic vs Geometric spacing, dynamic boundary adjustments' },
      { label: 'Order Execution', detail: 'Onchain routing vs offchain signal with onchain settlement' },
      { label: 'Capital Protection', detail: 'Stop-loss triggers, drawdown ceilings, volatility pauses' },
    ],
    supportedUseCases: ['Sideways market range trading', 'Automated market making', 'Volatility harvesting'],
  },
  YIELD_OPTIMIZATION: {
    title: 'Yield Optimisation Agents',
    description:
      'Autonomous yield scouts that monitor real-time lending rates, farm APYs, and staking yields across BNB Chain protocols to maximize risk-adjusted returns.',
    icon: Layers,
    evaluationCriteria: [
      { label: 'Lending & Staking', detail: 'Venus Protocol, Helio/Lista, Alpaca Finance' },
      { label: 'Autocompounding', detail: 'Reward token harvesting, swap routing, auto-reinvest cycle' },
      { label: 'Risk Screening', detail: 'Smart contract audit check, TVL thresholds, utilization rates' },
      { label: 'Gas Efficiency', detail: 'Batch compounding, cost-benefit break-even computation' },
    ],
    supportedUseCases: ['Venus stablecoin supply routing', 'Lista BNB liquid staking optimization', 'Multi-vault yield switching'],
  },
  HEALTH_FACTOR_MONITORING: {
    title: 'Health Factor & Risk Monitors',
    description:
      'Real-time sentinel agents that continuously evaluate collateralization ratios, oracle updates, and borrow positions to protect portfolios against liquidation.',
    icon: Activity,
    evaluationCriteria: [
      { label: 'Lending Markets', detail: 'Venus, Radiant, Kinza collateral vaults' },
      { label: 'Alert Thresholds', detail: 'Configurable health factor boundaries (e.g. HF < 1.15)' },
      { label: 'Autonomous Defense', detail: 'Flash-repay, auto-collateral deposit, deleveraging execution' },
      { label: 'Oracle Fallbacks', detail: 'Multi-oracle price feeds, flash-loan manipulation resistance' },
    ],
    supportedUseCases: ['Venus borrow position defense', 'SafeHire ProofOps risk evaluation', 'Liquidation alert dispatched via A2A'],
  },
};

export default function CategoryPage() {
  const { category: slug = 'rebalancing' } = useParams<{ category: string }>();
  const [search, setSearch] = useState('');
  const [hiringAgent, setHiringAgent] = useState<AgentFlowAgent | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const catKey = SLUG_TO_CATEGORY[slug] || 'REBALANCING';
  const categoryEnum = catKey !== 'UNCATEGORIZED' ? catKey : 'REBALANCING';
  const details = CATEGORY_DETAILS[categoryEnum];
  const Icon = details.icon;

  const { data: allAgents = [], isLoading } = useAgents({ bscOnly: true, limit: 100 });

  const categoryAgents = useMemo(() => {
    return allAgents.filter((a) => a.categories.includes(categoryEnum));
  }, [allAgents, categoryEnum]);

  const filteredAgents = useMemo(() => {
    if (!search.trim()) return categoryAgents;
    const term = search.toLowerCase();
    return categoryAgents.filter((a) => {
      return (
        (a.name && a.name.toLowerCase().includes(term)) ||
        (a.description && a.description.toLowerCase().includes(term)) ||
        a.capabilities.some((c) => c.toLowerCase().includes(term))
      );
    });
  }, [categoryAgents, search]);

  return (
    <div className="min-h-screen py-16 px-4 pb-32">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 font-mono text-xs text-muted-foreground">
            <Link to="/agents">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Marketplace
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{details.title}</h1>
                <p className="text-xs text-muted-foreground font-mono">
                  BNB Chain First-Class Category · {categoryAgents.length} Indexed Agent{categoryAgents.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {/* Quick Switcher */}
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CATEGORY_DETAILS) as Array<keyof typeof CATEGORY_DETAILS>).map((c) => {
                const isCurrent = c === categoryEnum;
                const pathSlug = c === 'REBALANCING' ? 'rebalancing' : c === 'GRID_TRADING' ? 'grid-trading' : c === 'YIELD_OPTIMIZATION' ? 'yield-optimisation' : 'health-factor';
                return (
                  <Button
                    key={c}
                    asChild
                    size="sm"
                    variant={isCurrent ? 'default' : 'outline'}
                    className={`font-mono text-xs h-7 ${isCurrent ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300' : 'border-border'}`}
                  >
                    <Link to={`/categories/${pathSlug}`}>
                      {CATEGORY_LABELS[c]}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overview & Evaluation Criteria */}
        <div className="glass-card p-6 mb-8 border-border">
          <p className="text-sm text-foreground leading-relaxed mb-6">
            {details.description}
          </p>

          <h2 className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            Evaluation Criteria & Technical Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {details.evaluationCriteria.map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-xs font-mono">
                <span className="text-muted-foreground block text-[11px] mb-0.5">{item.label}:</span>
                <span className="text-foreground font-semibold">{item.detail}</span>
              </div>
            ))}
          </div>

          <h3 className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider mb-2">
            Supported Onchain Use Cases
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {details.supportedUseCases.map((useCase) => (
              <Badge key={useCase} variant="secondary" className="font-mono text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="font-bold text-lg font-mono text-foreground">
            {CATEGORY_LABELS[categoryEnum]} Agents ({filteredAgents.length})
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={`Filter ${CATEGORY_LABELS[categoryEnum]} agents...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredAgents.length === 0 && (
          <div className="glass-card p-12 text-center max-w-xl mx-auto">
            <Icon className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-base mb-1">No Matching Agents Found</h3>
            <p className="text-xs text-muted-foreground mb-6">
              {categoryAgents.length === 0
                ? `Currently no indexed agents meet the strict keyword criteria for ${CATEGORY_LABELS[categoryEnum]}.`
                : 'No agents matched your filter query.'}
            </p>
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
              <Link to="/agents">Explore All Agents</Link>
            </Button>
          </div>
        )}

        {/* Agent Cards */}
        {!isLoading && filteredAgents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <CategoryAgentCard key={agent.id} agent={agent} onHire={() => setHiringAgent(agent)} />
            ))}
          </div>
        )}
      </div>

      {/* Guided ERC-8183 Hiring Wizard Modal */}
      {hiringAgent && (
        <ERC8183HireWizardModal
          agent={hiringAgent}
          isOpen={Boolean(hiringAgent)}
          onClose={() => setHiringAgent(null)}
          onOpenReceipt={() => setShowReceiptModal(true)}
        />
      )}

      {/* Job Receipt Modal */}
      {showReceiptModal && (
        <ERC8183JobReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}

function CategoryAgentCard({ agent, onHire }: { agent: AgentFlowAgent; onHire: () => void }) {
  const signals = getTrustSignals(agent);
  const evidenceLevel = getEvidenceLevel(signals);
  const isHirable = agent.activationStatus === 'HIRABLE';

  return (
    <div className="glass-card p-5 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-sm truncate">{agent.name ?? 'Unnamed Agent'}</h3>
            <p className="font-mono text-[11px] text-muted-foreground">
              BSC-{agent.chainId ?? '?'}:{agent.tokenId ?? '?'}
            </p>
          </div>
          {isHirable ? (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] font-mono font-bold animate-pulse">
              <Zap className="w-3 h-3 mr-1 fill-emerald-400" />
              HIRABLE
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
              {agent.activationStatus}
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {agent.description ?? 'No description available in registered metadata.'}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {agent.supportedProtocols?.map((p) => (
            <Badge key={p} variant="secondary" className="font-mono text-[10px]">
              {p}
            </Badge>
          ))}
          {agent.x402Supported && (
            <Badge variant="outline" className="font-mono text-[10px] text-amber-400 border-amber-400/40">
              x402
            </Badge>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <Button onClick={onHire} size="sm" className="flex-1 font-mono text-xs h-7 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold gap-1">
          <Zap className="w-3 h-3 fill-neutral-950" /> Hire Agent
        </Button>
        <Button asChild size="sm" variant="outline" className="font-mono text-xs h-7 border-border hover:border-amber-400 px-3">
          <Link to={`/agents/${agent.chainId}/${agent.tokenId}`}>Inspect</Link>
        </Button>
      </div>
    </div>
  );
}
