# BNB Protocol Research

**Status: Partially verified.** This is a rewrite of the Phase 1 placeholder,
now with real findings — but "real" here specifically means "confirmed by
installing and inspecting the actual `@bnbagent/sdk` npm package," not "hit
the live 8004scan/RPC endpoints and observed real responses." This sandbox's
network access is restricted to package registries (npm/pypi/github/etc.);
direct `curl` tests to `www.8004scan.io`, BSC RPC endpoints, and BscScan all
returned a proxy-level `host_not_allowed` 403 — genuinely unreachable from
here, not a permissions issue on my end that retrying would fix.

So: everything below the line marked **VERIFIED** was independently
confirmed by installing `@bnbagent/sdk@0.5.5` from the public npm registry
and reading its shipped `.d.ts` files and running `node -e` against its
compiled output — not copied from the brief and not recalled from training
data. Everything marked **UNVERIFIED** still needs a live API call, which
requires either enabling web/network access for this session or someone
running the app locally where the real hosts are reachable.

## VERIFIED — @bnbagent/sdk (the official TypeScript SDK)

- The package genuinely exists on npm: `@bnbagent/sdk@0.5.5`, published 23 hours before this check, maintained by `bnbchain.org`/`nodereal.io` addresses. Repo: `github.com/bnb-chain/bnbagent-sdk`.
- Depends only on `viem` (plus `@noble/*` crypto libs and `dotenv`) — no conflict with the existing `ethers`-based wallet layer; they can coexist in the same project without a rewrite.
- **Exports a real, working `NETWORKS` config** with `bsc-testnet` (chainId 97) and `bsc-mainnet` (chainId 56) presets, each carrying `registryContract` (ERC-8004), `commerceContract`/`routerContract`/`policyContract` (ERC-8183 stack), `rpcUrl`, and `paymasterUrl`. **These addresses were printed directly from the installed package and matched the Phase 2 brief's addresses exactly** — cross-verification, not blind trust of either source. They're now the source of truth in `src/config/networks.ts`.
- **Exports a real `SCAN_API_URL = "https://www.8004scan.io/api/v1"` constant.** This is the confirmed base URL used in `src/services/agents/8004scan.ts`.
- **Critical finding: the SDK is not fully browser-safe.** The root import (`@bnbagent/sdk`) and its `./erc8004`, `./erc8183`, `./wallets`, and `./storage` subpath exports all fail to bundle under Vite — they statically import Node built-ins (`net.BlockList`, `http`, `https`, `child_process`). Confirmed by actually trying to build each subpath through Vite, not by reading docs. Only `./x402`, `./signing`, `./networks`, and `./utils` bundle successfully for the browser.
  - Practical consequence: any real on-chain write using this SDK against ERC-8004 (`ERC8004Agent.registerAgent`) or ERC-8183 (`ERC8183Client`, job negotiation/funding/submission) must run in a Node context — a serverless function or small backend — not directly in this Vite SPA. Reads against 8004scan's REST API don't need the SDK at all (plain `fetch` works fine, which is what `8004scan.ts` does).
  - The SDK's `./wallets` subpath contains wallet-provider implementations (including a `TWAKProvider`/Turnkey-style provider referenced in its type exports) that are also Node-side, reinforcing that this SDK's write path is designed for an agent-operator backend, not a browser wallet-connect flow.
- The SDK's own `getAllAgents()` method (on `ERC8004Agent`, itself Node-only) returns `Promise<Record<string, unknown>>` — i.e., even the official SDK doesn't commit to a strict TypeScript schema for 8004scan's indexer response. This corroborates the brief's instruction not to invent field names: the SDK's own authors left it untyped for the same reason.
- ERC-8183's job lifecycle is real and concrete: `JobStatus` enum = `OPEN → FUNDED → SUBMITTED → COMPLETED | REJECTED | EXPIRED`, with a three-contract stack (AgenticCommerce kernel/escrow, EvaluatorRouter, OptimisticPolicy which "silence-approves, vote-rejects"). A `DeliverableManifest` schema defines the off-chain deliverable format with a `keccak256` hash committed on-chain for verification. This is a real, designed protocol — not a stub.
- MegaFuel gas sponsorship is real and wired into the SDK: both testnet (`https://bsc-megafuel-testnet.nodereal.io`) and mainnet (`https://bsc-megafuel.nodereal.io/`) paymaster URLs are present in the SDK's bundled config, with `usePaymaster: true` by default for both networks.

## UNVERIFIED — still needs a live call

- **Actual 8004scan response shape.** `src/services/agents/types.ts`'s `RawAgent` type is a best-effort shape based on the field list in the brief plus the SDK's `AgentEndpoint`/ERC-8004 metadata conventions — not a captured real response. `normalize.ts` is written defensively (every field optional-chained, nothing invented) specifically because of this gap.
- **8004scan rate-limit behavior in practice** (the 10/min, 100/day anonymous tier) — `8004scan.ts`'s retry/backoff logic is written to the documented limits but has never actually been rate-limited by the real service.
- **Whether an actual BSC-native agent currently exposes ERC-8183 hiring support** — the marketplace/profile UI is built to handle this capability-aware ("Supports ERC-8183 → offer hiring; no usable endpoint → say activation unavailable"), but no real agent has been checked yet.
- **BSC Testnet faucet specifics** and exact MegaFuel sponsorship eligibility per call — the SDK confirms sponsorship infrastructure exists, but not which specific write operations it covers versus requiring self-paid gas.

## What this means for Phase 3 hiring work

Proving one genuine end-to-end testnet hire (per the Phase 2 brief's own instruction) will require a small server-side component to run the SDK's `erc8004`/`erc8183` modules — this can no longer be attempted as a pure client-side Vite feature. That's a real architectural decision this research forced, not a preference.
