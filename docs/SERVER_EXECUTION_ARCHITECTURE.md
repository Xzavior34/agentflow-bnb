# Server Execution Architecture — BNB Agent SDK & ERC-8183 Integration

## Executive Summary

The official `@bnbagent/sdk` (version `>=0.5.5`) requires **Node.js >=20** for private-key signing, raw network socket access, and ERC-8183 write operations (`registerJob`, `fundJob`, `submitResult`, `settleJob`).

To maintain clean separation of concerns, high security, and minimal infrastructure overhead:
1. **Frontend:** Remains **Vite + React (SPA)**. No migration to Next.js.
2. **Server-Side Execution Component:** Lightweight serverless API functions (`/api/*`) running in Node.js >=20 (e.g. Vercel Serverless Functions or Express/Cloud Functions micro-service).
3. **Zero Secrets in Browser:** Private keys, RPC API secrets, and paymaster signing keys are **never** bundled or exposed in client-side code.

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                   AgentFlow Frontend                   │
│               (Vite + React SPA, Browser)              │
│                                                        │
│   • Discover BSC Agents (8004scan Indexer / Read RPC)  │
│   • Compare Across 4 Categories                        │
│   • Inspect Real Trust Evidence & Provenance           │
│   • Connect User Wallet (MetaMask / injected)          │
│   • Initiate Hire / Activation Request                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTPS / REST (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Lightweight Server Execution API             │
│            (Node.js >=20 Serverless / Edge)            │
│                                                        │
│   • POST /api/erc8183/create-job                       │
│   • POST /api/erc8183/submit-proof                     │
│   • GET  /api/erc8183/job-status                       │
│   • POST /api/x402/sign-payment                        │
│   • POST /api/verify-tx                                │
│                                                        │
│   Uses official @bnbagent/sdk server-side:             │
│     - ERC8183Client                                    │
│     - MegaFuel Paymaster Relay                         │
│     - Secure Key Management (ENV variables only)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ Onchain RPC & Contracts
                            ▼
┌────────────────────────────────────────────────────────┐
│                    BNB Smart Chain                     │
│           (BSC Mainnet 56 / BSC Testnet 97)            │
│                                                        │
│   • ERC-8004 Identity Registry:                        │
│       Mainnet: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432│
│       Testnet: 0x8004A818BFB912233c491871b3d84c89A494BD9e│
│   • ERC-8183 AgenticCommerce Kernel:                   │
│       Testnet: 0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de│
│   • Evaluator Router:                                  │
│       Testnet: 0xd7d36d66d2f1b608a0f943f722d27e3744f66f25│
│   • Optimistic Policy:                                 │
│       Testnet: 0xd6a4217588f6b1f5657a92a3e94e6422ad771cea│
└────────────────────────────────────────────────────────┘
```

---

## API Route Specifications

### 1. `POST /api/erc8183/create-job`
- **Purpose:** Prepares or executes an ERC-8183 job registration.
- **Request Body:**
  ```json
  {
    "agentId": "97:0x8004a818bfb912233c491871b3d84c89a494bd9e:2032",
    "budget": "0.01",
    "tokenAddress": "0x0000000000000000000000000000000000000000",
    "policyAddress": "0xd6a4217588f6b1f5657a92a3e94e6422ad771cea",
    "taskPayload": {
      "action": "SOLVENCY_AUDIT",
      "targetPool": "0x..."
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "jobId": "0x1a2b3c...",
    "unsignedTx": "0x...",
    "status": "REGISTERED"
  }
  ```

### 2. `POST /api/erc8183/submit-proof`
- **Purpose:** Agent provider submits execution output and cryptographic evidence to the Evaluator Router.
- **Request Body:**
  ```json
  {
    "jobId": "0x1a2b3c...",
    "proofData": "0x7f8a9b...",
    "resultUri": "ipfs://..."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "txHash": "0x987654...",
    "status": "SUBMITTED"
  }
  ```

### 3. `GET /api/erc8183/job-status?jobId=0x...`
- **Purpose:** Reads verified onchain job state from ERC-8183 Commerce contract (Open, InProgress, Submitted, Settled, Rejected).

---

## Security & Operational Red Lines

1. **No Private Keys in Client:** The browser never loads provider private keys or server signer keys.
2. **User Signs with Their Own Wallet:** When an end-user hires an agent onchain, the client requests the user's connected Web3 wallet (MetaMask) to sign the transaction directly.
3. **MegaFuel Gas Sponsorship:** For server-side agent execution, the server interacts with the official BSC MegaFuel paymaster (`https://bsc-megafuel-testnet.nodereal.io`), validating gas policies before relay.
4. **Environment Isolation:** Secrets (`PROVIDER_PRIVATE_KEY`, `RPC_API_KEY`) reside exclusively in server `.env` files and deployment environment secret managers.

---

## Implementation Plan for Full Production Rollout

- **Phase 3 (Current):** Document server architecture and map real activation candidates.
- **Phase 4 (Hiring Execution):** Deploy serverless handler `/api/erc8183` targeting `SafeHire ProofOps` (`97:0x8004a818bfb912233c491871b3d84c89a494bd9e:2032`) on BSC Testnet.
