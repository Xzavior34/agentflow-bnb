# Real ERC-8183 Lifecycle & Commerce State Machine

This document specifies the exact, verified onchain lifecycle for **ERC-8183 Agentic Commerce** on **BNB Smart Chain (BSC Testnet, Chain ID 97)**, reverse-engineered from deployed contracts and the official `@bnbagent/sdk`.

---

## 1. Verified Contract Topology (BSC Testnet)

| Contract | Address | Purpose |
| :--- | :--- | :--- |
| **ERC-8004 Identity Registry** | `0x8004A818BFB912233c491871b3d84c89A494BD9e` | Canonical agent identity NFT registry (`tokenURI`, `ownerOf`). |
| **ERC-8183 Commerce Kernel** | `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` | Core escrow, job storage, funds locking, and deliverable state tracking. |
| **ERC-8183 Evaluator Router** | `0xd7d36d66d2f1b608a0f943f722d27e3744f66f25` | Routes evaluation verdicts between Policy and Commerce. |
| **ERC-8183 Optimistic Policy** | `0xd6a4217588f6b1f5657a92a3e94e6422ad771cea` | Optimistic dispute policy for job outputs. |
| **Payment Token (U)** | `0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565` | `United Stables (U)` ERC20 payment token (18 decimals). |

---

## 2. Onchain State Machine (`JobStatus`)

The Commerce Kernel implements a strict finite state machine tracked by `uint8 status` on each job record:

```
                  ┌────────────────┐
                  │   0: OPEN      │ ◄── createJob(provider, evaluator, description, budget, expiredAt, hook)
                  └───────┬────────┘
                          │
                          │ fund(jobId) [Requires ERC20 approve of paymentToken]
                          ▼
                  ┌────────────────┐
                  │   1: FUNDED    │ ◄── Funds locked in escrow contract
                  └───────┬────────┘
                          │
                          │ submit(jobId, deliverableBytes32) [By assigned provider]
                          ▼
                  ┌────────────────┐
                  │  2: SUBMITTED  │ ◄── Deliverable proof registered onchain
                  └───────┬────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
           │ complete(jobId)             │ reject(jobId, reason)
           ▼                             ▼
  ┌─────────────────┐           ┌─────────────────┐
  │  3: COMPLETED   │           │   4: REJECTED   │
  │ (Escrow Payout) │           │ (Escrow Refund) │
  └─────────────────┘           └─────────────────┘
```

### Alternative Terminal State
- **`5: EXPIRED`**: If a job is created/funded and `block.timestamp > expiredAt` before deliverable submission, client can trigger `claimRefund(jobId)` or Router `markExpired(jobId)`.

---

## 3. Actor Provenance Matrix

Every step in the lifecycle is cryptographically attributed to an explicit actor:

| Lifecycle Step | Responsible Actor | Transaction / Call | State Transition |
| :--- | :--- | :--- | :--- |
| **1. Negotiation** | `AGENT` (SafeHire ProofOps) | A2A JSON-RPC `skill: negotiate` | Generates signed quote envelope with task terms and price (e.g. `0.1 U`). |
| **2. Job Creation** | `USER` / `AGENTFLOW` | `CommerceKernel.createJob(...)` | `None` ➔ `OPEN` (`0`) |
| **3. Token Approval** | `USER` / `AGENTFLOW` | `PaymentToken.approve(Commerce, budget)` | Approves ERC20 spending |
| **4. Funding Escrow** | `USER` / `AGENTFLOW` | `CommerceKernel.fund(jobId)` | `OPEN` (`0`) ➔ `FUNDED` (`1`) |
| **5. Task Execution** | `AGENT` (SafeHire ProofOps) | Autonomous execution / analysis | Generates deliverable artifact & computes SHA-256 deliverable hash |
| **6. Submission** | `AGENT` (SafeHire) / `PROVIDER` | `CommerceKernel.submit(jobId, deliverable)` | `FUNDED` (`1`) ➔ `SUBMITTED` (`2`) |
| **7. Policy Check** | `EVALUATOR` / `CONTRACT` | `Policy.check(jobId)` | Evaluates dispute window & submission validity |
| **8. Settlement** | `ROUTER` / `CONTRACT` | `Router.settle(jobId)` or `Commerce.complete` | `SUBMITTED` (`2`) ➔ `COMPLETED` (`3`) (Escrow released) |

---

## 4. Required Assets for BSC Testnet Hire

1. **Gas Asset:** `tBNB` (Testnet BNB) for paying transaction fees on Chain ID 97.
2. **Escrow Payment Asset:** `0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565` (`United Stables U`).
   - Minimum SafeHire quote amount: `0.1 U` (`100000000000000000` wei).
   - Testnet tokens are minted freely via testnet faucets or mint functions on testnet.
