import { describe, it, expect } from 'vitest';
import { isDeployedAddress, isCorrectChainId, ACTIVE_NETWORK, NETWORKS, ZERO_ADDRESS } from '@/config/networks';

describe('isDeployedAddress', () => {
  it('returns false for the zero address', () => {
    expect(isDeployedAddress(ZERO_ADDRESS)).toBe(false);
  });

  it('is case-insensitive for the zero address', () => {
    expect(isDeployedAddress('0X0000000000000000000000000000000000000000')).toBe(false);
  });

  it('returns false for null/undefined/empty', () => {
    expect(isDeployedAddress(null)).toBe(false);
    expect(isDeployedAddress(undefined)).toBe(false);
    expect(isDeployedAddress('')).toBe(false);
  });

  it('returns true for a real-looking non-zero address', () => {
    expect(isDeployedAddress('0x5B774b97F3e64238A7785744de9C3c7d322083a4')).toBe(true);
  });
});

describe('isCorrectChainId', () => {
  it('matches the active network chain id (case-insensitive)', () => {
    expect(isCorrectChainId(ACTIVE_NETWORK.chainIdHex)).toBe(true);
    expect(isCorrectChainId(ACTIVE_NETWORK.chainIdHex.toUpperCase())).toBe(true);
  });

  it('rejects a different chain id', () => {
    const other = ACTIVE_NETWORK.chainIdHex === NETWORKS.bscMainnet.chainIdHex
      ? NETWORKS.bscTestnet.chainIdHex
      : NETWORKS.bscMainnet.chainIdHex;
    expect(isCorrectChainId(other)).toBe(false);
  });

  it('rejects null/undefined', () => {
    expect(isCorrectChainId(null)).toBe(false);
    expect(isCorrectChainId(undefined)).toBe(false);
  });
});

describe('NETWORKS', () => {
  it('defines the correct, well-known BSC chain IDs', () => {
    expect(NETWORKS.bscMainnet.chainId).toBe(56);
    expect(NETWORKS.bscTestnet.chainId).toBe(97);
  });

  it('chainIdHex matches chainId for both networks', () => {
    expect(parseInt(NETWORKS.bscMainnet.chainIdHex, 16)).toBe(NETWORKS.bscMainnet.chainId);
    expect(parseInt(NETWORKS.bscTestnet.chainIdHex, 16)).toBe(NETWORKS.bscTestnet.chainId);
  });
});
