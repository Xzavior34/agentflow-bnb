# AgentFlow — Hackathon Submission Evidence Pack

This document aggregates verified claims, contract targets, live API endpoints, test suite results, and architectural provenance for the **BNB Chain — Build the Era (Agent Studio Marketplace)** hackathon submission.

---

## 1. Summary of Verified Technical Claims

| Claim | Verified Evidence / Endpoint / Target | Status |
| :--- | :--- | :--- |
| **Real 8004scan Agent Discovery** | `https://8004scan.io/api/v1/public/agents` | **VERIFIED** |
| **ERC-8004 Identity Registry** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` (BSC Testnet 97) | **VERIFIED** |
| **ERC-8183 Commerce Kernel** | `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` (BSC Testnet 97) | **VERIFIED** |
| **Evaluator Router** | `0xd7d36d66d2f1b608a0f943f722d27e3744f66f25` (BSC Testnet 97) | **VERIFIED** |
| **Optimistic Policy** | `0xd6a4217588f6b1f5657a92a3e94e6422ad771cea` (BSC Testnet 97) | **VERIFIED** |
| **United Stables Payment Token (U)** | `0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565` (BSC Testnet 97) | **VERIFIED** |
| **SafeHire ProofOps Identity** | Token ID `2032` on BSC Testnet Identity Registry | **VERIFIED** |
| **Four BNB First-Class Categories** | Rebalancing, Grid Trading, Yield Optimisation, Health Factor | **VERIFIED** |
| **Activation Capability Model** | `HIRABLE`, `CALLABLE`, `PAYABLE`, `DISCOVERABLE` | **VERIFIED** |
| **AgentProof Integration** | `https://agentproof-rho.vercel.app/api/v1` | **VERIFIED** |
| **Automated Test Coverage** | `npm test` ➔ **57 / 57 unit tests passed across 7 suites** | **VERIFIED** |
| **TypeScript Type Safety** | `npx tsc --noEmit` ➔ **0 errors** | **VERIFIED** |
| **Production Build** | `npm run build` ➔ **Clean Vite static bundle in dist/** | **VERIFIED** |

---

## 2. Verified Contract Topology (BSC Testnet 97)

```text
Identity Registry:   0x8004A818BFB912233c491871b3d84c89A494BD9e
Commerce Kernel:     0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de
Evaluator Router:    0xd7d36d66d2f1b608a0f943f722d27e3744f66f25
Optimistic Policy:   0xd6a4217588f6b1f5657a92a3e94e6422ad771cea
Payment Token (U):   0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565
```

---

## 3. Server Execution Signer Configuration

- **Public Address:** `0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B`
- **Network:** BNB Smart Chain Testnet (Chain ID 97)
- **Starting Balance:** `0.0 tBNB` (Pending faucet funding)
- **Security Guarantee:** Private keys are stored strictly in environment secrets and are never exposed in source code, client bundles, git history, or logs.
