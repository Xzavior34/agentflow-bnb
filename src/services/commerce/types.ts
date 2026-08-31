/**
 * ERC-8183 Agentic Commerce Types & Actor Provenance Definitions
 */

export type LifecycleActor = 'USER' | 'AGENTFLOW' | 'AGENT' | 'EVALUATOR' | 'CONTRACT';

export enum ERC8183JobStatus {
  OPEN = 0,
  FUNDED = 1,
  SUBMITTED = 2,
  COMPLETED = 3,
  REJECTED = 4,
  EXPIRED = 5,
}

export interface ERC8183Job {
  id: string;
  jobId: number;
  client: string;
  provider: string;
  evaluator: string;
  description: string;
  budget: string; // in human-readable U
  budgetWei: string;
  expiredAt: number;
  status: ERC8183JobStatus;
  statusLabel: 'OPEN' | 'FUNDED' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';
  hook: string;
  submittedAt: number;
  deliverable: string;
  deliverableUrl?: string;
  actorHistory: Array<{
    actor: LifecycleActor;
    action: string;
    timestamp: string;
    txHash?: string;
    blockNumber?: number;
  }>;
}

export interface JobReceipt {
  jobId: number;
  agentName: string;
  agentTokenId: string;
  identityRegistry: string;
  commerceContract: string;
  chainId: number;
  network: string;
  clientAddress: string;
  providerAddress: string;
  evaluatorAddress: string;
  budget: string;
  status: 'COMPLETED' | 'SUBMITTED' | 'FUNDED' | 'OPEN';
  deliverableHash: string;
  transactions: {
    create?: { txHash: string; blockNumber: number; timestamp: string };
    fund?: { txHash: string; blockNumber: number; timestamp: string };
    submit?: { txHash: string; blockNumber: number; timestamp: string };
    settle?: { txHash: string; blockNumber: number; timestamp: string };
  };
  actorProvenance: Array<{
    step: string;
    actor: LifecycleActor;
    verifiedOnchain: boolean;
  }>;
}

export interface CreateJobInput {
  chainId: number;
  targetContract: string;
  provider: string;
  evaluator: string;
  description: string;
  budget: string; // e.g. "0.1"
  expiryDurationSec?: number;
  idempotencyKey?: string;
}
