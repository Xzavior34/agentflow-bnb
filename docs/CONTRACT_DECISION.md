# Contract Decision: Does AgentFlow need its own smart contract?

## FINAL DECISION (Phase 2)

**AgentMarket.sol is archived and will NOT be redeployed.** Per externally-researched, verified guidance: BNB Chain already provides canonical infrastructure for everything the contract attempted —

- **ERC-8004** (Identity Registry) is the canonical identity/discovery layer.
- **8004scan** is the canonical indexed marketplace/discovery/reputation data source.
- **ERC-8183** (AgenticCommerce + EvaluatorRouter) is the canonical agent-commerce/hiring/escrow layer where supported.
- **x402** remains available as an optional payment mechanism.

This resolves the "UNDECIDED" analysis below in favor of the "no" case: AgentFlow's value is the marketplace UX, normalization, discovery, comparison, trust/provenance, and activation layer built on top of that canonical infrastructure — not a competing registry. `contracts/contracts/AgentMarket.sol` and `contracts/contracts_backup_v2/AgentMarket.sol` remain in the repository as historical reference (and as a real, working example of an ERC-8004-style registry pattern, which was useful groundwork) but are no longer part of the active BNB architecture. Nothing in `src/` should call them going forward; `src/config/contract.ts` and `src/utils/AgentSDK.ts` are likewise deprecated in favor of `src/services/agents/` and (for actual writes, once a server-side path exists) `@bnbagent/sdk`.

**Verified addresses now live in `src/config/networks.ts`** (`ProtocolAddresses`), cross-checked against the installed `@bnbagent/sdk` package's own bundled network config rather than trusted blindly — see `docs/BNB_PROTOCOL_RESEARCH.md` for how that verification was done.

**One consequence worth flagging**: `@bnbagent/sdk`'s `erc8004`/`erc8183`/`wallets`/`storage` subpaths are Node-only (they import `net`, `http`, `child_process`, and fail to bundle in Vite — confirmed by actually trying it, not assumed). That means any real on-chain write against these canonical contracts (registering an agent, funding an ERC-8183 job) cannot happen directly from this browser SPA using the SDK. A server-side component (serverless function or small backend) will be required whenever Phase 3 attempts a real end-to-end hire — this is the same conclusion the Phase 2 brief anticipated when it said "first prove ONE genuine end-to-end testnet hiring path," and it's now a concrete, verified requirement rather than a guess.

---

## Original function-by-function analysis (superseded, kept for audit trail)

The analysis below was written before the Phase 2 protocol research came back. It's kept as-is rather than deleted, since the reasoning ("do not build a competing registry") turned out to match the final external guidance.

## Important housekeeping finding first

**The frontend ABI and the "live" contract source don't match.** `src/config/contract.ts`'s `AGENT_MARKET_FULL_ABI` includes `updateAgent`, `deactivateAgent`, `hireAgentFromAgent`, `getAllActiveAgents`, `findAgentsByCapability`, `getProtocolStats`, and a `ReputationUpdated` event — none of which exist in `contracts/contracts/AgentMarket.sol` (the file Hardhat is actually configured to compile, per `hardhat.config.cjs`'s `paths.sources: "./contracts"`). They *do* exist in `contracts/contracts_backup_v2/AgentMarket.sol`, a fuller, unused sibling file. In other words: the deployed/deployable contract and the frontend's understanding of that contract were never the same file. This must be resolved regardless of the KEEP/REPLACE decision below — if AgentFlow keeps any custom contract, `contracts_backup_v2` is the one that matches the frontend, not `contracts/contracts`.

## Function-by-function classification

Based on `contracts_backup_v2/AgentMarket.sol` (the version the frontend actually expects):

| Function | What it does | Classification | Reasoning |
|---|---|---|---|
| `registerAgent(profile)` | Self-registers a wallet as an agent with name/endpoint/capabilities/mcpVersion, sets base reputation 100 | **UNDECIDED — likely REPLACE WITH ERC-8004** | ERC-8004 is explicitly framed (per your instructions) as the likely canonical identity/discovery layer for this hackathon track. A proprietary parallel registry duplicates that and risks looking like "yet another agent directory" — the exact anti-pattern the hackathon brief warns against. Final call depends on `docs/BNB_PROTOCOL_RESEARCH.md` confirming ERC-8004 actually covers registration on BSC for this hackathon. |
| `updateAgent(profile)` | Updates a registered agent's metadata | **UNDECIDED — same as above** | Same reasoning; if identity lives in ERC-8004, updates happen there too. |
| `deactivateAgent()` | Marks caller's agent inactive | **UNDECIDED — same as above** | Same reasoning. |
| `hireAgent(agent)` payable | Takes payment, splits 2% protocol fee to treasury, rest to agent, increments reputation/earnings/job counts | **KEEP (if any contract is kept at all) — this is AgentFlow's actual value-add** | This is the "activation/hiring" mechanic — not identity, not discovery. Even if ERC-8004 becomes the identity layer, something still needs to move funds and record that a hire happened. This is the part most worth keeping, *if* it doesn't conflict with whatever hiring/invocation standard the hackathon actually expects (x402, ERC-8183, or BNB Agent Studio's own mechanism — unresolved, see research doc). |
| `hireAgentFromAgent(agent)` | Same as above but caller must itself be a registered agent (agent-to-agent hire) | **MODIFY or REMOVE depending on scope** | Nice differentiator (machine-to-machine commerce) but adds complexity; only keep if agent-to-agent hiring is something AgentFlow will actually demo credibly within the deadline. Cut per your P3 "no overengineering" guidance unless it's cheap to keep once the hiring mechanism is settled. |
| `_increaseReputation` / `_decreaseReputation` (internal) | Adjusts a simple +5/-3 counter on hire/failure | **REPLACE WITH ERC-8004/TRUST LAYER** | This is exactly the kind of arbitrary, non-transparent scoring the hackathon brief explicitly warns against ("do not create an arbitrary score... unless mathematically derived from transparent signals"). Real reputation should come from ERC-8004/8004scan feedback data plus AgentFlow's own documented trust formula (`docs/TRUST_METHODOLOGY.md`, not yet written), not a hardcoded +5/-3 walk. |
| `reportFailedJob(agent)` | Owner-only manual reputation penalty | **REMOVE** | Centralized, owner-gated, trivially gameable/opaque. Doesn't belong in a trust layer that's supposed to be transparent. |
| `findAgentsByCapability(capability)` | Linear scan returning matching active agent addresses | **REPLACE WITH ERC-8004/8004scan** | Discovery/search belongs in the indexing layer (8004scan or an AgentFlow-side cache of it), not an O(n) onchain loop that gets more expensive as the registry grows. Real marketplace search needs to be off-chain anyway per your search/filter requirements (name, capability, description, protocol, use case — none of which this function supports beyond exact capability string match). |
| `getAllActiveAgents()` | Linear scan returning all active agent addresses | **REPLACE WITH ERC-8004/8004scan** | Same reasoning — doesn't scale, doesn't provide the rich fields (owner, endpoints, protocols, metadata) the marketplace needs. |
| `getAgent(address)` | Returns full agent struct + job/earnings counters | **MODIFY (if contract kept) or REMOVE** | If a custom contract survives purely for the hire/payment mechanic, this view function still has some use for displaying onchain earnings/job-count evidence on an agent profile page as one *provenance-tagged* data point (clearly labeled "onchain, from AgentFlow's own contract" rather than blended with ERC-8004 fields as if equivalent). |
| `getProtocolStats()` | Returns total registered, active count, total volume | **KEEP (if contract kept), low priority** | Genuinely-computed onchain totals are fine to surface — just don't call them ecosystem-wide "TVL" or dress them up as bigger than they are (a small hackathon-scale contract's own volume). |

## Explicit answer: Does AgentFlow need its own smart contract to win this hackathon?

**Not yet answerable with confidence — genuinely UNDECIDED, and I want to be honest that this is not a decision I can make responsibly without the research in `docs/BNB_PROTOCOL_RESEARCH.md`.** Here's the honest reasoning either way:

**Case for "no" (identity + discovery + hiring all handled by BNB-native infra):**
If BNB Agent Studio / ERC-8004 / whatever standard hiring mechanism the hackathon expects already covers registration, discovery, *and* payment/invocation end-to-end, then a bespoke `AgentMarket.sol` is redundant weight that actively works against the "why isn't 8004scan enough" adversarial-judge question in section 34 of your brief. In that world, AgentFlow's onchain evidence comes entirely from interacting with the standard contracts, and "what happens onchain" in the demo is a real ERC-8004/hiring-standard transaction, not a side contract nobody asked for.

**Case for "yes, but minimal" (identity/discovery via ERC-8004, hiring via a thin AgentFlow contract):**
If the ecosystem's identity/discovery standard does *not* itself define a payment/hiring mechanism (plausible — identity registries often don't move money), then a small contract whose only job is "take payment, forward minus fee, emit a hire event" is a legitimate, minimal, non-duplicative piece of infrastructure. In that case the smallest viable version keeps only `hireAgent` + `getProtocolStats`, drops the registration/discovery/reputation functions entirely, and takes the agent's address as a parameter (sourced from ERC-8004 lookups, not this contract's own registry).

**If the answer ends up "no":** hiring/payment/onchain evidence instead comes from whatever standard mechanism BNB Agent Studio / x402 / ERC-8183 defines — meaning the demo's "onchain evidence" step is a transaction against a third-party/standard contract or protocol flow, with an explorer link, rather than anything AgentFlow deployed itself.

**This will be resolved once `docs/BNB_PROTOCOL_RESEARCH.md` is filled in with real findings** (currently a checklist — see below). Until then, no redeployment happens, per your explicit instruction.
