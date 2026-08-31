/**
 * ARCHIVED — Cronos network configuration from the original AgentFlow-402
 * (Cronos x402 PayTech Hackathon) submission.
 *
 * NOT IMPORTED ANYWHERE. Kept only as historical reference for the
 * BNB migration audit. Do not resurrect this file into the active
 * network config — see src/config/networks.ts for the current
 * BSC-based configuration.
 *
 * Original contract deployment (Cronos zkEVM Testnet):
 *   Address: 0x79E32be792330c28Fb97958075bE9cB9e528977e
 *   Explorer: https://explorer.zkevm.cronos.org/address/0x79E32be792330c28Fb97958075bE9cB9e528977e
 *   Chain ID: 240
 *
 * Note the original repo also had a second, conflicting Cronos config
 * (chainId 338, "Cronos Testnet") hardcoded directly in useWallet.ts —
 * the two were never reconciled, meaning the shipped app's wallet
 * network-check and its contract config disagreed about which chain
 * was "correct." That inconsistency is documented in
 * docs/DATA_INTEGRITY_AUDIT.md and does not carry forward into the
 * BSC migration.
 */

export const CRONOS_NETWORK_CONFIGS_ARCHIVED = {
  cronosZkEvm: {
    chainId: 240,
    chainName: 'Cronos zkEVM Testnet',
    rpcUrl: 'https://testnet.zkevm.cronos.org',
    explorerUrl: 'https://explorer.zkevm.cronos.org',
    nativeCurrency: { name: 'Test CRO', symbol: 'TCRO', decimals: 18 },
  },
  cronosTestnet: {
    chainId: 338,
    chainName: 'Cronos Testnet',
    rpcUrl: 'https://evm-t3.cronos.org/',
    explorerUrl: 'https://explorer.cronos.org/testnet',
    nativeCurrency: { name: 'Test CRO', symbol: 'TCRO', decimals: 18 },
  },
} as const;
