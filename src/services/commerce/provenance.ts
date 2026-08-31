/**
 * Actor Provenance & Cryptographic Attribution Tracker for AgentFlow
 */

import type { LifecycleActor } from './types';

export interface ProvenanceRecord {
  stage: string;
  actor: LifecycleActor;
  actorDescription: string;
  isAutonomousAgent: boolean;
  evidenceType: 'ONCHAIN_TX' | 'SIGNED_ENVELOPE' | 'CONTRACT_STATE' | 'USER_INTENT';
  identifier?: string;
}

export function getProvenanceForStage(stage: string): ProvenanceRecord {
  switch (stage.toUpperCase()) {
    case 'NEGOTIATE':
      return {
        stage: 'NEGOTIATE',
        actor: 'AGENT',
        actorDescription: 'Autonomous Agent Core (SafeHire ProofOps Token 2032)',
        isAutonomousAgent: true,
        evidenceType: 'SIGNED_ENVELOPE',
      };
    case 'CREATE_JOB':
      return {
        stage: 'CREATE_JOB',
        actor: 'USER',
        actorDescription: 'Client User Wallet (Fund Owner)',
        isAutonomousAgent: false,
        evidenceType: 'ONCHAIN_TX',
      };
    case 'FUND_ESCROW':
      return {
        stage: 'FUND_ESCROW',
        actor: 'USER',
        actorDescription: 'Client User Wallet (Escrow Depositor)',
        isAutonomousAgent: false,
        evidenceType: 'ONCHAIN_TX',
      };
    case 'EXECUTE_TASK':
      return {
        stage: 'EXECUTE_TASK',
        actor: 'AGENT',
        actorDescription: 'SafeHire ProofOps Evaluation Engine',
        isAutonomousAgent: true,
        evidenceType: 'SIGNED_ENVELOPE',
      };
    case 'SUBMIT_RESULT':
      return {
        stage: 'SUBMIT_RESULT',
        actor: 'AGENT',
        actorDescription: 'Agent Provider Signer Relay',
        isAutonomousAgent: true,
        evidenceType: 'ONCHAIN_TX',
      };
    case 'EVALUATE_POLICY':
      return {
        stage: 'EVALUATE_POLICY',
        actor: 'EVALUATOR',
        actorDescription: 'Optimistic Policy & Evaluator Router Contract',
        isAutonomousAgent: false,
        evidenceType: 'CONTRACT_STATE',
      };
    case 'SETTLE_ESCROW':
      return {
        stage: 'SETTLE_ESCROW',
        actor: 'CONTRACT',
        actorDescription: 'Commerce Kernel Settlement Engine',
        isAutonomousAgent: false,
        evidenceType: 'CONTRACT_STATE',
      };
    default:
      return {
        stage,
        actor: 'AGENTFLOW',
        actorDescription: 'AgentFlow Orchestration Runtime',
        isAutonomousAgent: false,
        evidenceType: 'USER_INTENT',
      };
  }
}
