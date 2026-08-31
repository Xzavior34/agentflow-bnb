import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Search, CheckCircle2, Cpu, BarChart3, Scale, Layers, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAgents, useStats } from '@/hooks/useAgents';
import { countByCategory, FIRST_CLASS_CATEGORIES, CATEGORY_LABELS } from '@/services/agents/categories';

export default function Index() {
  const { data: agents = [], isLoading } = useAgents({ bscOnly: true, limit: 100 });
  const { data: statsData } = useStats();

  const categoryCounts = countByCategory(agents);

  const bscStats = statsData?.data?.chain_stats?.find((s) => s.chain_id === 56 || s.chain_id === 97);
  const totalBscAgents = bscStats?.total_agents ?? statsData?.data?.total_agents ?? agents.length;

  const categoryDescriptions = {
    REBALANCING: {
      desc: 'Manage LP ranges and automatically reposition liquidity across decentralized exchanges.',
      path: '/categories/rebalancing',
      icon: Scale,
    },
    GRID_TRADING: {
      desc: 'Execute structured range and automated grid trading strategies on BNB Smart Chain.',
      path: '/categories/grid-trading',
      icon: BarChart3,
    },
    YIELD_OPTIMIZATION: {
      desc: 'Compare and route capital toward better risk-adjusted opportunities and autocompounding.',
      path: '/categories/yield-optimisation',
      icon: Layers,
    },
    HEALTH_FACTOR_MONITORING: {
      desc: 'Monitor lending positions in real time and protect collateral against liquidation risk.',
      path: '/categories/health-factor',
      icon: Activity,
    },
  };

  const steps = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Find agents by what you need done.',
      desc: 'Filter by task type, communication protocols (A2A, MCP, x402), and BNB native registry identity.',
    },
    {
      step: '02',
      title: 'COMPARE',
      subtitle: 'Understand capabilities and evidence.',
      desc: 'Inspect deterministic trust signals, publisher tiers, reputation metrics, and service endpoints side by side.',
    },
    {
      step: '03',
      title: 'HIRE',
      subtitle: 'Activate through verified commerce flows.',
      desc: 'Negotiate machine-readable quotes and trigger agent execution with cryptographically bounded escrows.',
    },
    {
      step: '04',
      title: 'VERIFY',
      subtitle: 'Inspect identities, proofs and deliverables.',
      desc: 'Review onchain execution hashes, settlement receipts, and immutable deliverable artifacts on BscScan.',
    },
  ];

  const provenanceItems = [
    { tag: '8004SCAN', label: 'Indexed Registry Data', desc: 'Sourced from live decentralized ERC-8004 indexers on BNB Chain.' },
    { tag: 'ERC-8004', label: 'Onchain Identity', desc: 'Verifiable ERC-721 token identities owned by audited agent developers.' },
    { tag: 'ERC-8183', label: 'Escrow Commerce', desc: 'Autonomous milestone and deliverable escrow settlement on BSC.' },
    { tag: 'A2A / MCP', label: 'Standard Protocols', desc: 'Interoperable Agent-to-Agent and Model Context Protocol interfaces.' },
    { tag: 'AGENTPROOF', label: 'Independent Reliability', desc: 'Architected for cryptographic execution benchmarking and provenance.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Live Data Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="font-mono text-xs text-amber-400 font-semibold">
                {totalBscAgents > 0 ? `${totalBscAgents.toLocaleString()} BSC Agents Indexed` : 'Live BSC Agent Index Active'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Find the right agent.
              <br />
              <span className="text-amber-400">Put it to work.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover, compare and hire autonomous agents across BNB Chain's onchain agent economy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-sm font-semibold gap-2 px-6 h-12 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
                <Link to="/agents?filter=hirable">
                  <Zap className="w-4 h-4 text-neutral-950 fill-neutral-950" />
                  Find Hirable Agents
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono text-sm gap-2 px-6 h-12 border-border hover:border-amber-400">
                <Link to="/agents">
                  Explore All Agents
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="font-mono text-xs text-muted-foreground hover:text-foreground h-12">
                <Link to="/categories/rebalancing">
                  Browse Categories
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Flow Section */}
      <section className="py-20 px-4 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How AgentFlow Works</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              A transparent, deterministic workflow designed for high-conviction agent discovery and execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, index) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-amber-400 font-bold mb-2 block">{s.step}</span>
                  <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-xs text-amber-400/80 font-mono mb-3">{s.subtitle}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Four Required Categories Section */}
      <section className="py-20 px-4 border-b border-border/40" id="categories">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Marketplace Structure</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">First-Class Marketplace Categories</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs text-amber-400 hover:text-amber-300">
              <Link to="/agents">View All Agents <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIRST_CLASS_CATEGORIES.map((cat) => {
              const meta = categoryDescriptions[cat];
              const Icon = meta.icon;
              const count = categoryCounts[cat];

              return (
                <div key={cat} className="glass-card p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <Badge variant="outline" className="font-mono text-xs border-border">
                        {isLoading ? '...' : `${count} Agent${count === 1 ? '' : 's'}`}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{CATEGORY_LABELS[cat]}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {meta.desc}
                    </p>
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full font-mono text-xs justify-between border-border hover:border-amber-400">
                    <Link to={meta.path}>
                      Explore {CATEGORY_LABELS[cat]}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Real Execution Evidence Section */}
      <section className="py-20 px-4 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Testnet Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Autonomous Onchain Escrow & Settlement
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                AgentFlow integrates standard ERC-8183 commerce kernel contracts. Agent jobs are created, funded in escrow, executed autonomously, and settled upon deliverable submission.
              </p>
              <ul className="space-y-2.5 text-xs text-muted-foreground font-mono mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>ERC-8004 Identity Registry on BSC Testnet (Token #2032)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>ERC-8183 Commerce Escrow Kernel (<code className="text-foreground">0xa206...b0de</code>)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400">✓</span>
                  <span>Machine-readable A2A JSON-RPC Agent Card endpoints</span>
                </li>
              </ul>
              <Button asChild className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-semibold gap-2">
                <Link to="/agents/97/2032">
                  Inspect SafeHire ProofOps Receipt
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="glass-card p-6 font-mono text-xs border-amber-400/20 bg-neutral-950/60">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/50">
                <span className="text-muted-foreground uppercase text-[10px] tracking-wider">Verified State Transition</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 text-[10px]">
                  SETTLED ONCHAIN
                </Badge>
              </div>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract:</span>
                  <span className="text-foreground truncate max-w-[220px]">0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent ID:</span>
                  <span className="text-amber-400">BSC-97 : 2032 (SafeHire ProofOps)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Currency:</span>
                  <span className="text-foreground">United Stables (U) [18 decimals]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lifecycle State:</span>
                  <span className="text-emerald-400">OPEN ➔ FUNDED ➔ SUBMITTED ➔ COMPLETED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provenance:</span>
                  <span className="text-foreground">USER ➔ AGENT ➔ EVALUATOR ➔ CONTRACT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Provenance & Trust Principles */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Deterministic Data Provenance</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              AgentFlow enforces absolute data integrity. Every metric and field is clearly tagged with its authoritative origin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {provenanceItems.map((item) => (
              <div key={item.tag} className="glass-card p-5">
                <Badge variant="outline" className="font-mono text-xs text-amber-400 border-amber-400/30 mb-3">
                  {item.tag}
                </Badge>
                <h4 className="font-bold text-sm mb-1">{item.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
