import { describe, it, expect, beforeEach } from 'vitest';
import {
  isAllowedChainId,
  isAllowedContract,
  isAllowedMethod,
  ALLOWED_CONTRACTS,
  MAX_TESTNET_BUDGET_U,
} from './allowlist';
import { validateCreateJob, validateJobOperation, ValidationError } from './validation';
import { idempotency } from './idempotency';
import { getProvenanceForStage } from './provenance';

describe('Commerce Security Allowlists', () => {
  it('allows BSC Testnet (chain 97) and rejects other chains', () => {
    expect(isAllowedChainId(97)).toBe(true);
    expect(isAllowedChainId(1)).toBe(false);
    expect(isAllowedChainId(56)).toBe(false);
    expect(isAllowedChainId(137)).toBe(false);
  });

  it('verifies canonical contract addresses case-insensitively', () => {
    expect(isAllowedContract(ALLOWED_CONTRACTS.COMMERCE_KERNEL)).toBe(true);
    expect(isAllowedContract(ALLOWED_CONTRACTS.COMMERCE_KERNEL.toUpperCase())).toBe(true);
    expect(isAllowedContract(ALLOWED_CONTRACTS.IDENTITY_REGISTRY)).toBe(true);
    expect(isAllowedContract('0x0000000000000000000000000000000000000000')).toBe(false);
    expect(isAllowedContract('0xdeadbeef')).toBe(false);
  });

  it('restricts allowed method calls to specific lifecycle operations', () => {
    expect(isAllowedMethod('createJob')).toBe(true);
    expect(isAllowedMethod('fund')).toBe(true);
    expect(isAllowedMethod('submit')).toBe(true);
    expect(isAllowedMethod('complete')).toBe(true);
    expect(isAllowedMethod('selfdestruct')).toBe(false);
    expect(isAllowedMethod('transfer')).toBe(false);
    expect(isAllowedMethod('arbitraryExecute')).toBe(false);
  });
});

describe('Commerce Input Validation', () => {
  const validJobInput = {
    chainId: 97,
    targetContract: ALLOWED_CONTRACTS.COMMERCE_KERNEL,
    provider: '0x7ca564102be3C107EdA9075F490a9bB1bb74daED',
    evaluator: '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25',
    description: 'SafeHire ProofOps risk evaluation for PancakeSwap pool',
    budget: '0.1',
    expiryDurationSec: 3600,
  };

  it('accepts valid job input within bounded values', () => {
    expect(() => validateCreateJob(validJobInput)).not.toThrow();
  });

  it('rejects unapproved chains', () => {
    expect(() => validateCreateJob({ ...validJobInput, chainId: 1 })).toThrow(ValidationError);
  });

  it('rejects unapproved contracts', () => {
    expect(() =>
      validateCreateJob({ ...validJobInput, targetContract: '0x1111111111111111111111111111111111111111' })
    ).toThrow(ValidationError);
  });

  it('rejects budgets exceeding the maximum testnet limit', () => {
    expect(() =>
      validateCreateJob({ ...validJobInput, budget: (MAX_TESTNET_BUDGET_U + 1).toString() })
    ).toThrow(ValidationError);
  });

  it('rejects descriptions that are too short or invalid', () => {
    expect(() => validateCreateJob({ ...validJobInput, description: 'hi' })).toThrow(ValidationError);
  });

  it('validates lifecycle operations with valid and invalid jobIds', () => {
    expect(() => validateJobOperation('submit', 810)).not.toThrow();
    expect(() => validateJobOperation('submit', -1)).toThrow(ValidationError);
    expect(() => validateJobOperation('unauthorizedMethod', 810)).toThrow(ValidationError);
  });
});

describe('Idempotency Protection', () => {
  beforeEach(() => {
    idempotency.clear();
  });

  it('allows the first execution and prevents duplicate concurrent attempts', () => {
    const key = 'job-creation-proofops-tx-1';
    const first = idempotency.start(key);
    expect(first.ok).toBe(true);

    const duplicate = idempotency.start(key);
    expect(duplicate.ok).toBe(false);
    expect(duplicate.cached?.status).toBe('PENDING');
  });

  it('stores resolved result for replay safety', () => {
    const key = 'job-creation-proofops-tx-2';
    idempotency.start(key);
    idempotency.resolve(key, { jobId: 815, txHash: '0xabc123' });

    const rec = idempotency.get<{ jobId: number; txHash: string }>(key);
    expect(rec?.status).toBe('RESOLVED');
    expect(rec?.result?.jobId).toBe(815);
  });
});

describe('Actor Provenance Tracking', () => {
  it('correctly maps each lifecycle step to its responsible actor', () => {
    const neg = getProvenanceForStage('NEGOTIATE');
    expect(neg.actor).toBe('AGENT');
    expect(neg.isAutonomousAgent).toBe(true);

    const create = getProvenanceForStage('CREATE_JOB');
    expect(create.actor).toBe('USER');
    expect(create.isAutonomousAgent).toBe(false);

    const submit = getProvenanceForStage('SUBMIT_RESULT');
    expect(submit.actor).toBe('AGENT');
    expect(submit.isAutonomousAgent).toBe(true);

    const evaluate = getProvenanceForStage('EVALUATE_POLICY');
    expect(evaluate.actor).toBe('EVALUATOR');

    const settle = getProvenanceForStage('SETTLE_ESCROW');
    expect(settle.actor).toBe('CONTRACT');
  });
});
