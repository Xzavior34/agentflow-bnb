import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, X, Plus, Check, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAgents } from '@/hooks/useAgents';
import { CATEGORY_LABELS } from '@/services/agents/categories';
import { getTrustSignals, getEvidenceLevel } from '@/services/agents/trust';
import type { AgentFlowAgent } from '@/services/agents/types';

const MAX_COMPARE = 3;

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allAgents = [], isLoading } = useAgents({ bscOnly: true, limit: 100 });

  // Initial selection from query parameters or default to top candidates
  const initialIds = useMemo(() => {
    const fromUrl = searchParams.get('ids')?.split(',').filter(Boolean) ?? [];
    if (fromUrl.length > 0) return fromUrl.slice(0, MAX_COMPARE);
    if (allAgents.length >= 2) return [allAgents[0].id, allAgents[1].id];
    return [];
  }, [searchParams, allAgents]);

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const selectedAgents = useMemo(() => {
    return selectedIds
      .map((id) => allAgents.find((a) => a.id === id))
      .filter((a): a is AgentFlowAgent => Boolean(a));
  }, [selectedIds, allAgents]);

  const addAgent = (agentId: string) => {
    if (selectedIds.includes(agentId) || selectedIds.length >= MAX_COMPARE) return;
    const next = [...selectedIds, agentId];
    setSelectedIds(next);
    setSearchParams({ ids: next.join(',') });
  };

  const removeAgent = (agentId: string) => {
    const next = selectedIds.filter((id) => id !== agentId);
    setSelectedIds(next);
    setSearchParams({ ids: next.join(',') });
  };

  const availableToAdd = allAgents.filter((a) => !selectedIds.includes(a.id));

  const comparisonRows: Array<{
    category: string;
    label: string;
    render: (a: AgentFlowAgent) => React.ReactNode;
  }> = [
    {
      category: 'Identity',
      label: 'Token ID / Chain',
      render: (a) => (
        <span className="font-mono text-xs text-amber-400">
          BSC-{a.chainId ?? '?'}:{a.tokenId ?? '?'}
        </span>
      ),
    },
    {
      category: 'Identity',
      label: 'Publisher / Owner',
      render: (a) => (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px] block" title={a.owner ?? 'Not available'}>
          {a.owner ? `${a.owner.slice(0, 6)}...${a.owner.slice(-4)}` : 'Not available'}
        </span>
      ),
    },
    {
      category: 'Classification',
      label: 'Categories',
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.categories.map((c) => (
            <Badge key={c} variant="secondary" className="font-mono text-[10px]">
              {CATEGORY_LABELS[c]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      category: 'Protocols',
      label: 'Supported Protocols',
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.supportedProtocols?.map((p) => (
            <Badge key={p} variant="outline" className="font-mono text-[10px] text-foreground">
              {p}
            </Badge>
          )) ?? <span className="text-xs text-muted-foreground italic">None declared</span>}
          {a.x402Supported && (
            <Badge variant="outline" className="font-mono text-[10px] text-amber-400 border-amber-400/40">
              x402
            </Badge>
          )}
        </div>
      ),
    },
    {
      category: 'Capabilities',
      label: 'Declared Capabilities',
      render: (a) => (
        <div className="flex flex-wrap gap-1">
          {a.capabilities.length > 0 ? (
            a.capabilities.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px]">
                {c}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">No capabilities declared</span>
          )}
        </div>
      ),
    },
    {
      category: 'Trust & Reputation',
      label: 'Evidence Level',
      render: (a) => {
        const signals = getTrustSignals(a);
        const level = getEvidenceLevel(signals);
        return (
          <Badge variant={level === 'Strong evidence' ? 'default' : 'outline'} className="text-[10px]">
            {level}
          </Badge>
        );
      },
    },
    {
      category: 'Trust & Reputation',
      label: 'Feedback & Reputation',
      render: (a) => (
        <span className="font-mono text-xs">
          {a.feedbackCount !== null ? `${a.feedbackCount} Feedbacks` : 'Not measured'} ·{' '}
          {a.reputationScore !== null ? `Score: ${a.reputationScore}` : 'No score'}
        </span>
      ),
    },
    {
      category: 'Activation',
      label: 'Escrow / Activation',
      render: (a) => {
        return a.activationStatus === 'HIRABLE' ? (
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3 fill-emerald-400" /> HIRABLE (ERC-8183 Escrow)
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">{a.activationStatus}</span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 pb-32">
      <div className="container mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 font-mono text-xs text-muted-foreground">
              <Link to="/agents">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Marketplace
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Compare Autonomous Agents</h1>
            <p className="text-xs text-muted-foreground font-mono">
              Side-by-side technical and trust signal evaluation for up to 3 agents.
            </p>
          </div>

          {/* Add agent dropdown */}
          {selectedIds.length < MAX_COMPARE && availableToAdd.length > 0 && (
            <div className="w-full sm:w-64">
              <Select onValueChange={addAgent}>
                <SelectTrigger className="font-mono text-xs h-9">
                  <SelectValue placeholder="+ Add Agent to Compare" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableToAdd.map((a) => (
                    <SelectItem key={a.id} value={a.id} className="font-mono text-xs">
                      {a.name ?? a.id} (ID: {a.tokenId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Empty state if fewer than 2 agents */}
        {selectedAgents.length < 2 && !isLoading && (
          <div className="glass-card p-12 text-center max-w-xl mx-auto mb-8">
            <Cpu className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-base mb-1">Select Agents to Compare</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Pick at least 2 agents from the marketplace or dropdown to inspect side-by-side capabilities.
            </p>
            <Button asChild className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs">
              <Link to="/agents">Browse Marketplace</Link>
            </Button>
          </div>
        )}

        {/* Comparison Table */}
        {selectedAgents.length >= 2 && (
          <div className="glass-card p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted-foreground pb-4 pr-6 w-1/4 border-b border-border">
                    Criteria
                  </th>
                  {selectedAgents.map((agent) => (
                    <th key={agent.id} className="text-left pb-4 pr-6 w-1/4 border-b border-border">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-foreground">{agent.name ?? 'Unnamed Agent'}</h3>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {agent.chainId}:{agent.tokenId}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAgent(agent.id)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <Button asChild size="sm" className="w-full mt-3 font-mono text-xs h-7 bg-amber-400 hover:bg-amber-300 text-neutral-950">
                        <Link to={`/agents/${agent.chainId}/${agent.tokenId}`}>View Profile</Link>
                      </Button>
                    </th>
                  ))}
                  {/* Empty placeholder column if < 3 selected */}
                  {selectedAgents.length < MAX_COMPARE && (
                    <th className="text-left pb-4 pr-6 w-1/4 border-b border-border border-dashed">
                      <div className="border border-dashed border-border rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground font-mono mb-2">Slot Empty</p>
                        {availableToAdd.length > 0 && (
                          <Select onValueChange={addAgent}>
                            <SelectTrigger className="font-mono text-[11px] h-7">
                              <SelectValue placeholder="+ Add Agent" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {availableToAdd.map((a) => (
                                <SelectItem key={a.id} value={a.id} className="font-mono text-xs">
                                  {a.name ?? a.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {comparisonRows.map((row, idx) => (
                  <tr key={`${row.category}-${row.label}-${idx}`} className="hover:bg-muted/10 transition-colors">
                    <td className="py-3.5 pr-6 font-mono text-xs text-muted-foreground">
                      <span className="text-[10px] uppercase tracking-wider block text-muted-foreground/60">{row.category}</span>
                      <span className="font-medium text-foreground">{row.label}</span>
                    </td>
                    {selectedAgents.map((agent) => (
                      <td key={agent.id} className="py-3.5 pr-6 align-top">
                        {row.render(agent)}
                      </td>
                    ))}
                    {selectedAgents.length < MAX_COMPARE && <td className="py-3.5 pr-6" />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
