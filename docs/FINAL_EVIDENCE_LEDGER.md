# AgentFlow — Final Evidence Ledger

This document maps every major technical and product claim in **AgentFlow** directly to verifiable onchain, API, or test suite evidence.

---

## 🧾 Claim Verification Matrix

| Claim | Verification Status | Source of Truth / Evidence Link | Limitation / Context |
| :--- | :--- | :--- | :--- |
| **290K+ BSC Agents Indexed** | **VERIFIED** | Live 8004scan API (`https://8004scan.io/api/v1`) | Sourced dynamically from public 8004scan registry indexer. |
| **4 Finance Categories** | **VERIFIED** | `/categories/rebalancing`, `/categories/grid-trading`, `/categories/yield-optimisation`, `/categories/health-factor` | First-class routing and evaluation criteria. |
| **ERC-8004 Onchain Identity** | **VERIFIED** | BSC Identity Registry `0x8004A818BFB912233c491871b3d84c89A494BD9e` (Testnet) / `0x8004a169fb4a3325136eb29fa0ceb6d2e539a432` (Mainnet) | Direct contract address resolution. |
| **ERC-8183 Escrow Hiring** | **VERIFIED** | Commerce Kernel `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` | Integrated via 9-step guided hiring wizard modal. |
| **AgentProof Reliability** | **VERIFIED** | AgentProof Public API (`https://agentproof-rho.vercel.app/api/v1/agents/bsc/49637`) | Live independent operational passports. |
| **57/57 Unit Tests Passing** | **VERIFIED** | `npm test` console output across 7 test suites | Verified locally and in build pipeline. |
| **Zero Synthetic Data** | **VERIFIED** | Runtime codebase audit ([`docs/LEGACY_REMOVAL_AUDIT.md`](file:///c:/Users/Administrator/CrossDevice/Pixel%208%20Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/docs/LEGACY_REMOVAL_AUDIT.md)) | Zero fake reviews or fake metrics in production. |
| **Public Live Vercel Deployment** | **VERIFIED** | [`https://agentflow-bnb.vercel.app/`](https://agentflow-bnb.vercel.app/) | Deployed with SPA rewrites enabled. |
| **Public Open-Source Repo** | **VERIFIED** | [`https://github.com/Xzavior34/agentflow-bnb`](https://github.com/Xzavior34/agentflow-bnb) | Publicly accessible git repository. |
