/**
 * Strict Security Allowlists for BSC Testnet Execution.
 * Prevents arbitrary contract execution, unapproved chains, or excessive value transfers.
 */

export const ALLOWED_CHAIN_IDS = [97] as const;

export const ALLOWED_CONTRACTS = {
  COMMERCE_KERNEL: '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de'.toLowerCase(),
  EVALUATOR_ROUTER: '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25'.toLowerCase(),
  OPTIMISTIC_POLICY: '0xd6a4217588f6b1f5657a92a3e94e6422ad771cea'.toLowerCase(),
  IDENTITY_REGISTRY: '0x8004A818BFB912233c491871b3d84c89A494BD9e'.toLowerCase(),
  PAYMENT_TOKEN: '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565'.toLowerCase(),
} as const;

export const ALLOWED_METHODS = [
  'createJob',
  'fund',
  'submit',
  'complete',
  'reject',
  'claimRefund',
  'settle',
  'getJob',
  'jobs',
] as const;

export const MAX_TESTNET_BUDGET_U = 10.0; // Max 10 U allowed per job to protect testnet funds
export const MIN_EXPIRY_SECONDS = 300; // 5 minutes minimum
export const MAX_EXPIRY_SECONDS = 86400 * 30; // 30 days max

export function isAllowedChainId(chainId: number): boolean {
  return (ALLOWED_CHAIN_IDS as readonly number[]).includes(chainId);
}

export function isAllowedContract(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  const normalized = address.toLowerCase();
  const allowed = Object.values(ALLOWED_CONTRACTS) as string[];
  return allowed.includes(normalized);
}

export function isAllowedMethod(methodName: string): boolean {
  return (ALLOWED_METHODS as readonly string[]).includes(methodName);
}
