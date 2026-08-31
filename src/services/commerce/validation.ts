/**
 * Input & Parameter Validation for ERC-8183 Operations.
 */

import {
  isAllowedChainId,
  isAllowedContract,
  isAllowedMethod,
  MAX_TESTNET_BUDGET_U,
  MIN_EXPIRY_SECONDS,
  MAX_EXPIRY_SECONDS,
} from './allowlist';
import type { CreateJobInput } from './types';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateCreateJob(input: CreateJobInput): void {
  if (!isAllowedChainId(input.chainId)) {
    throw new ValidationError(`Chain ID ${input.chainId} is not allowed. Only BSC Testnet (97) is supported.`);
  }

  if (!isAllowedContract(input.targetContract)) {
    throw new ValidationError(`Contract ${input.targetContract} is not in the verified allowlist.`);
  }

  if (!isValidAddress(input.provider)) {
    throw new ValidationError(`Invalid provider address: ${input.provider}`);
  }

  if (!isValidAddress(input.evaluator)) {
    throw new ValidationError(`Invalid evaluator address: ${input.evaluator}`);
  }

  if (!input.description || typeof input.description !== 'string' || input.description.trim().length < 5) {
    throw new ValidationError('Job description must be at least 5 characters long.');
  }

  if (input.description.length > 2048) {
    throw new ValidationError('Job description exceeds maximum allowed length of 2048 characters.');
  }

  const budgetNum = parseFloat(input.budget);
  if (isNaN(budgetNum) || budgetNum < 0) {
    throw new ValidationError(`Invalid budget value: ${input.budget}`);
  }

  if (budgetNum > MAX_TESTNET_BUDGET_U) {
    throw new ValidationError(
      `Budget ${budgetNum} U exceeds maximum permitted testnet limit of ${MAX_TESTNET_BUDGET_U} U.`
    );
  }

  if (input.expiryDurationSec !== undefined) {
    if (input.expiryDurationSec < MIN_EXPIRY_SECONDS || input.expiryDurationSec > MAX_EXPIRY_SECONDS) {
      throw new ValidationError(
        `Expiry duration must be between ${MIN_EXPIRY_SECONDS}s and ${MAX_EXPIRY_SECONDS}s.`
      );
    }
  }
}

export function validateJobOperation(method: string, jobId: number): void {
  if (!isAllowedMethod(method)) {
    throw new ValidationError(`Method ${method} is not permitted.`);
  }

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new ValidationError(`Invalid jobId: ${jobId}`);
  }
}
