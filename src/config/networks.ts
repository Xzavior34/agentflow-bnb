/**
 * AgentFlow Network Configuration — SINGLE SOURCE OF TRUTH
 *
 * Configured strictly for BNB Smart Chain (BSC Mainnet: 56, BSC Testnet: 97).
 * Every part of the app imports network configuration from here.
 */

export type NetworkKey = 'bscMainnet' | 'bscTestnet';

export interface ProtocolAddresses {
  /** ERC-8004 Identity Registry — canonical agent identity/discovery. */
  erc8004Registry: string;
  /** ERC-8183 AgenticCommerce kernel — job/escrow contract. */
  erc8183Commerce: string;
  /** ERC-8183 EvaluatorRouter — routing + hook for job evaluation. */
  erc8183Router: string;
  /** ERC-8183 OptimisticPolicy — silence-approves/vote-rejects policy contract. */
  erc8183Policy: string;
}

export interface NetworkConfig {
  chainId: number;
  chainIdHex: string;
  chainName: string;
  rpcUrls: string[];
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  /** MegaFuel gas-sponsorship relay URL for this network, per @bnbagent/sdk. */
  paymasterUrl: string;
  protocol: ProtocolAddresses;
}

/**
 * Protocol contract addresses below were NOT hand-entered from the Phase 2
 * brief — they were independently cross-checked against the installed
 * `@bnbagent/sdk` package's own bundled `NETWORKS` config (verified via
 * `node -e "require('@bnbagent/sdk').NETWORKS"` against this exact
 * `node_modules` install) and matched exactly. That's the strongest
 * verification available without live RPC/explorer access (both are
 * blocked in this execution sandbox — see docs/BNB_PROTOCOL_RESEARCH.md).
 */
export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  bscMainnet: {
    chainId: 56,
    chainIdHex: '0x38',
    chainName: 'BNB Smart Chain',
    rpcUrls: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
    ],
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    paymasterUrl: 'https://bsc-megafuel.nodereal.io/',
    protocol: {
      erc8004Registry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      erc8183Commerce: '0xea4daa3100a767e86fded867729ae7446476eba6',
      erc8183Router: '0x51895229e12f9876011789b04f8698af06ccd6da',
      erc8183Policy: '0x9c01845705b3078aa2e8cff7520a6376fd766de5',
    },
  },
  bscTestnet: {
    chainId: 97,
    chainIdHex: '0x61',
    chainName: 'BNB Smart Chain Testnet',
    rpcUrls: [
      'https://bsc-testnet-rpc.publicnode.com',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
    ],
    explorerUrl: 'https://testnet.bscscan.com',
    nativeCurrency: { name: 'Test BNB', symbol: 'tBNB', decimals: 18 },
    paymasterUrl: 'https://bsc-megafuel-testnet.nodereal.io',
    protocol: {
      erc8004Registry: '0x8004A818BFB912233c491871b3d84c89A494BD9e',
      erc8183Commerce: '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de',
      erc8183Router: '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25',
      erc8183Policy: '0xd6a4217588f6b1f5657a92a3e94e6422ad771cea',
    },
  },
};

/**
 * Active network for this build. Testnet by default — this is a hackathon
 * submission and P0 requires all demonstrated transactions to be testnet
 * and independently verifiable, per the project's zero-fake-evidence policy.
 *
 * Override via VITE_CHAIN_ENV=mainnet if a mainnet deployment is ever needed.
 */
const envChain = (import.meta.env.VITE_CHAIN_ENV as string | undefined)?.toLowerCase();
export const ACTIVE_NETWORK_KEY: NetworkKey = envChain === 'mainnet' ? 'bscMainnet' : 'bscTestnet';
export const ACTIVE_NETWORK: NetworkConfig = NETWORKS[ACTIVE_NETWORK_KEY];

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Runtime-safe replacement for the old `address !== ZERO_ADDRESS` literal
 * comparison that TypeScript correctly flagged as impossible (comparing two
 * different string-literal types can never be false, so the "not yet
 * deployed" branch could never trigger). This takes a plain `string` so the
 * comparison is a real runtime check, not a compile-time-narrowed literal.
 */
export function isDeployedAddress(address: string | undefined | null): boolean {
  if (!address) return false;
  return address.toLowerCase() !== ZERO_ADDRESS;
}

export function isCorrectChainId(chainIdHex: string | null | undefined): boolean {
  if (!chainIdHex) return false;
  return chainIdHex.toLowerCase() === ACTIVE_NETWORK.chainIdHex.toLowerCase();
}

/**
 * 8004scan indexer REST API base URL. Value confirmed by reading the
 * installed @bnbagent/sdk package's own exported `SCAN_API_URL` constant
 * (not guessed) — see docs/BNB_PROTOCOL_RESEARCH.md for how this was
 * verified.
 */
export const SCAN_API_URL = 'https://www.8004scan.io/api/v1';

/**
 * Chain IDs this marketplace's competition views are allowed to surface.
 * 8004scan is multi-chain; the hackathon eligibility rule requires BSC-only
 * agents in competition views (see docs/BNB_PROTOCOL_RESEARCH.md section on
 * BSC-only filtering). Any agent whose chainId isn't in this set must be
 * excluded from marketplace/category/search results, never just visually
 * de-emphasized.
 */
export const BSC_CHAIN_IDS: ReadonlySet<number> = new Set([
  NETWORKS.bscMainnet.chainId,
  NETWORKS.bscTestnet.chainId,
]);

export function isBscChainId(chainId: number | null | undefined): boolean {
  if (chainId === null || chainId === undefined) return false;
  return BSC_CHAIN_IDS.has(chainId);
}
