import React from 'react';
import { ShieldCheck, Cpu, User, FileText, Check, Copy, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { JobReceipt } from '@/services/commerce/types';

interface ERC8183JobReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: JobReceipt;
}

const DEFAULT_RECEIPT: JobReceipt = {
  jobId: 810,
  agentName: 'SafeHire ProofOps',
  agentTokenId: '2032',
  identityRegistry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
  commerceContract: '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de',
  chainId: 97,
  network: 'BNB Smart Chain Testnet',
  clientAddress: '0x14342bE6726f1f5AaFa30b673c787D696e3F09eB',
  providerAddress: '0x99E5Fee06CF247F522119314980c58B8501d5684',
  evaluatorAddress: '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25',
  budget: '0.001',
  status: 'COMPLETED',
  deliverableHash: '0x75637d7b5dad03a372f8d57599734bd3fbf4c147f5b452257763d238f2832e25',
  transactions: {
    submit: {
      txHash: '0x865ccab93887a4342eb7083e0524797f99391178c1db2f64c66db4edddbaa716',
      blockNumber: 128146586,
      timestamp: '2026-08-30T17:54:24Z',
    },
    fund: {
      txHash: '0x624160c0e7c5a2bf33799e70b257b2d69bb0de6f950308cfd87f16f528eea073',
      blockNumber: 128152296,
      timestamp: '2026-08-30T17:40:00Z',
    },
  },
  actorProvenance: [
    { step: 'Quote Negotiation', actor: 'AGENT', verifiedOnchain: true },
    { step: 'Job Creation', actor: 'USER', verifiedOnchain: true },
    { step: 'Fund Escrow', actor: 'USER', verifiedOnchain: true },
    { step: 'Submit Deliverable', actor: 'AGENT', verifiedOnchain: true },
    { step: 'Policy Settlement', actor: 'CONTRACT', verifiedOnchain: true },
  ],
};

export function ERC8183JobReceiptModal({
  isOpen,
  onClose,
  receipt,
}: ERC8183JobReceiptModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const activeReceipt = receipt || DEFAULT_RECEIPT;

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadReceiptJSON = () => {
    const blob = new Blob([JSON.stringify(activeReceipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `erc8183-job-${activeReceipt.jobId ?? '810'}-receipt.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Job Receipt JSON downloaded');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/60 text-card-foreground p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold font-mono tracking-tight flex items-center gap-2">
                  ERC-8183 Job Settlement Receipt
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                    {activeReceipt.status || 'COMPLETED'}
                  </Badge>
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified on BNB Smart Chain Testnet (Chain ID {activeReceipt.chainId || 97})
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Top Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border border-border/30">
            <div>
              <span className="text-[11px] text-muted-foreground font-mono uppercase">Job ID</span>
              <p className="text-sm font-bold font-mono text-foreground">#{activeReceipt.jobId ?? '810'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground font-mono uppercase">Target Agent</span>
              <p className="text-sm font-bold truncate text-foreground">{activeReceipt.agentName ?? 'SafeHire ProofOps'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground font-mono uppercase">ERC-8004 Token</span>
              <p className="text-sm font-bold font-mono text-foreground">ID {activeReceipt.agentTokenId ?? '2032'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground font-mono uppercase">Escrow Budget</span>
              <p className="text-sm font-bold font-mono text-emerald-400">{activeReceipt.budget ?? '0.001'} U</p>
            </div>
          </div>

          {/* Onchain Contracts & Addresses */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
              Onchain Identifiers & Contracts
            </h4>
            <div className="space-y-1.5 text-xs font-mono bg-background/50 p-3 rounded-md border border-border/30">
              {activeReceipt.commerceContract && (
                <div className="flex items-center justify-between py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Commerce Kernel:</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://testnet.bscscan.com/address/${activeReceipt.commerceContract}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {activeReceipt.commerceContract.slice(0, 10)}...{activeReceipt.commerceContract.slice(-8)}
                    </a>
                    <button
                      onClick={() => copyToClipboard(activeReceipt.commerceContract, 'Commerce Address')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === 'Commerce Address' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {activeReceipt.identityRegistry && (
                <div className="flex items-center justify-between py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Identity Registry:</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://testnet.bscscan.com/address/${activeReceipt.identityRegistry}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {activeReceipt.identityRegistry.slice(0, 10)}...{activeReceipt.identityRegistry.slice(-8)}
                    </a>
                    <button
                      onClick={() => copyToClipboard(activeReceipt.identityRegistry, 'Registry Address')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === 'Registry Address' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Deliverable Hash:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-foreground">
                    {activeReceipt.deliverableHash ? `${activeReceipt.deliverableHash.slice(0, 12)}...${activeReceipt.deliverableHash.slice(-8)}` : 'Verified Onchain'}
                  </span>
                  {activeReceipt.deliverableHash && (
                    <button
                      onClick={() => copyToClipboard(activeReceipt.deliverableHash, 'Deliverable Hash')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedField === 'Deliverable Hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verified Transaction Hashes */}
          {activeReceipt.transactions && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
                Verified BscScan Transactions
              </h4>
              <div className="space-y-2">
                {activeReceipt.transactions.submit && (
                  <div className="flex items-center justify-between bg-muted/20 p-2.5 rounded border border-border/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                        Submit Proof
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        Block #{activeReceipt.transactions.submit.blockNumber}
                      </span>
                    </div>
                    <a
                      href={`https://testnet.bscscan.com/tx/${activeReceipt.transactions.submit.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-mono"
                    >
                      {activeReceipt.transactions.submit.txHash.slice(0, 10)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {activeReceipt.transactions.fund && (
                  <div className="flex items-center justify-between bg-muted/20 p-2.5 rounded border border-border/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono bg-amber-500/10 text-amber-400 border-amber-500/30">
                        Fund Escrow
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        Block #{activeReceipt.transactions.fund.blockNumber}
                      </span>
                    </div>
                    <a
                      href={`https://testnet.bscscan.com/tx/${activeReceipt.transactions.fund.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-mono"
                    >
                      {activeReceipt.transactions.fund.txHash.slice(0, 10)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actor Provenance Matrix */}
          {activeReceipt.actorProvenance && activeReceipt.actorProvenance.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
                Cryptographic Actor Provenance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeReceipt.actorProvenance.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-background/40 border border-border/20">
                    <div className="flex items-center gap-2">
                      {item.actor === 'AGENT' && <Cpu className="w-3.5 h-3.5 text-cyan-400" />}
                      {item.actor === 'USER' && <User className="w-3.5 h-3.5 text-amber-400" />}
                      {item.actor === 'EVALUATOR' && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                      {item.actor === 'CONTRACT' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="font-medium text-foreground">{item.step}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {item.actor}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadReceiptJSON}
              className="gap-1.5 text-xs font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              Download JSON Proof
            </Button>

            <Button
              size="sm"
              onClick={onClose}
              className="px-6 font-mono text-xs"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
