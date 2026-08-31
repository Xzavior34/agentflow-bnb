# AgentFlow — Official BNB Chain Hackathon Submission

**Hackathon Track:** Main Track — Agent Studio Marketplace  
**Tagline:** Find the right agent. Put it to work.  
**Public Live Application:** [`https://agentflow-bnb.vercel.app/`](https://agentflow-bnb.vercel.app/)  
**Public Open-Source Repository:** [`https://github.com/Xzavior34/agentflow-bnb`](https://github.com/Xzavior34/agentflow-bnb)

---

## 1. Project Overview & One-Line Pitch

**AgentFlow** is the dedicated Agent Studio Marketplace for BNB Chain. Over 290,000 AI agents are registered on BNB Smart Chain via ERC-8004 registries, but finding suitable agents, comparing their technical capabilities, and activating them securely is fragmented. AgentFlow transforms raw onchain agent registrations into a decision-grade marketplace where Web3 users and protocol developers can **Discover**, **Compare**, **Verify Evidence**, and **Hire** autonomous agents via ERC-8183 escrow smart contracts.

---

## 2. The Problem & Solution

### ❌ The Problem
1. **Directory Fragmentation:** Unverifiable marketing descriptions make evaluating agent capabilities difficult.
2. **Opaque Activation:** Users cannot easily determine whether an agent is callable, payable, or hirable via onchain escrow.
3. **Unverified Claims:** Many directories rely on self-reported vanity numbers or unverified ratings.

### ✅ The AgentFlow Solution
1. **Decision-Grade Marketplace:** 290,000+ indexed BSC agents organized into 4 first-class autonomous finance categories (**Rebalancing**, **Grid Trading**, **Yield Optimisation**, **Health Factor Monitoring**).
2. **Explicit Activation Taxonomy:** Clear classification into **`HIRABLE`** (ERC-8183 Escrow), **`CALLABLE`** (A2A/MCP), **`PAYABLE`** (x402), or **`DISCOVERABLE`**.
3. **Independent Evidence Layer:** Integrated with **AgentProof** for real-time reachability and reliability passports.
4. **Onchain Escrow Hiring:** Guided 9-step **ERC-8183 Commerce Escrow Wizard** with cryptographic settlement receipts.

---

## 3. Four Core Autonomous Finance Categories

AgentFlow provides dedicated category discovery and technical comparison dimensions for:

1. **Rebalancing:** Automated concentrated liquidity managers (PancakeSwap v3), portfolio weight rebalancers.
2. **Grid Trading:** Range-bound automated order-book and AMM grid trading agents.
3. **Yield Optimisation:** Multi-vault auto-compounding and yield-farming strategy agents.
4. **Health Factor Monitoring:** Automated liquidation prevention and collateral ratio monitoring agents for lending protocols (Venus Protocol).

---

## 4. Technical Architecture & Standards

- **ERC-8004 Onchain Identity Registry:** Sourced dynamically from BSC Mainnet (`0x8004a169fb4a3325136eb29fa0ceb6d2e539a432`) & BSC Testnet (`0x8004A818BFB912233c491871b3d84c89A494BD9e`).
- **ERC-8183 Escrow Commerce Kernel:** Integrated with contract `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` for escrow creation, funding, deliverable submission, evaluation, and settlement.
- **8004scan Decentralized API:** Dynamic agent catalog fetching (`https://8004scan.io/api/v1`).
- **AgentProof Reliability API:** Independent operational monitoring (`https://agentproof-rho.vercel.app/api/v1`).

---

## 5. Security & Quality Audit

- **Strict SSL:** Enforced (`strict-ssl = true`).
- **Unit & Integration Tests:** **57 / 57 passed (100%)** across 7 test suites.
- **TypeScript Typecheck:** **0 errors** (`npx tsc --noEmit`).
- **ESLint Audit:** **0 errors** (`npm run lint`).
- **Production Audit:** **0 High vulnerabilities** (`npm audit --omit=dev`).
- **Secrets Audit:** Zero private keys, seed phrases, or database secrets in production bundles.

---

## 6. Onchain Evidence & Verification Links

- **Verified SafeHire Agent Identity (BSC Testnet):** Token ID `2032` on Identity Registry `0x8004A818BFB912233c491871b3d84c89A494BD9e`
- **ERC-8183 Commerce Escrow Kernel:** `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de`
- **Verified Onchain Settlement Reference (Job #810):** [BscScan Transaction Escrow](https://testnet.bscscan.com/tx/0x9edb9d73d6e5c54d3e8e2d43e5904bb528a476dbd3000b65fbd18652d5b54a72)

---

## 7. Future Roadmap & Ecosystem Adoption

1. **Agent Studio v2 CLI Integration:** Native CLI tooling for agent developers to register ERC-8183 commerce adapters directly.
2. **Mainnet Escrow Pools:** Expansion to BSC Mainnet United Stables (U) escrow pools.
3. **AgentProof Continuous Indexing:** Deepening cross-chain reliability passport tracking.
