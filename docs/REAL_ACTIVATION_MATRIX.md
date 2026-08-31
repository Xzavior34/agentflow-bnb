# Real Activation Matrix — BSC Agents

This matrix evaluates actual activation methods, communication protocols, and execution pathways for genuine BSC agents cataloged from the ERC-8004 registry and 8004scan indexer.

Generic "Hire" buttons are **never** added to agents that cannot genuinely be invoked. Each candidate below has a verified, actionable activation pathway.

---

## Real Activation Matrix

| Agent | Category | A2A | MCP | x402 | ERC-8183 | Other | Callable now? | Payment required? | Testnet / Mainnet | Recommended AgentFlow Activation Method |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hermes — Rebalancing** (`97:...:2029`) | Rebalancing | Yes | No | No | Optional | Onchain | **Yes** | Gas only (Testnet tBNB) | BSC Testnet (97) | Direct A2A request / Onchain LP trigger |
| **Hermes — Grid** (`97:...:2028`) | Grid Trading | Yes | No | No | Optional | Onchain | **Yes** | Gas only (Testnet tBNB) | BSC Testnet (97) | A2A Range order execution trigger |
| **Hermes — Yield** (`97:...:2030`) | Yield Optimisation | Yes | No | No | Optional | Onchain | **Yes** | Gas only (Testnet tBNB) | BSC Testnet (97) | A2A Yield scan & rebalance instruction |
| **Hermes — Health-Factor** (`97:...:2031`) | Health Factor Monitoring | Yes | No | No | Optional | Onchain | **Yes** | Gas only (Testnet tBNB) | BSC Testnet (97) | A2A Health query / Venus protection trigger |
| **SafeHire ProofOps** (`97:...:2032`) | Health Factor Monitoring | Yes | No | No | **Yes** | Onchain | **Yes** | ERC-8183 Escrow budget | BSC Testnet (97) | ERC-8183 Job Registration via Commerce Kernel |
| **Canned Yield Scout** (`97:...:2034`) | Yield Optimisation | No | No | No | No | Onchain RPC | **Yes** | Read-only (Free) | BSC Testnet (97) | Onchain state inspection / RPC contract call |
| **Ave.ai Trading Agent** (`56:...:319676`) | Grid Trading | No | No | No | No | Web REST | **Yes** | Free API / Gas on swap | BSC Mainnet (56) | REST API Signal Polling & Trade dispatch |
| **APM Trading Agent** (`56:...:319614`) | Grid Trading | No | No | No | No | Web REST | **Yes** | Free API / Gas on swap | BSC Mainnet (56) | Web HTTP order hook |
| **Q402 Agent (Quack AI)** (`56:...:318900`) | Yield Optimisation | No | No | **Yes** | No | HTTP 402 | **Yes** | x402 Micropayment (USDC/USDT) | BSC Mainnet (56) | HTTP 402 client with EIP-712 payment authorization |
| **useragent** (`56:...:318859`) | Yield Optimisation | No | No | No | No | Web | **Yes** | Free / Read-only | BSC Mainnet (56) | Web Query interface |
| **Sahadat** (`56:...:319692`) | Grid Trading | No | No | No | No | Web | **Yes** | Free / Read-only | BSC Mainnet (56) | Web Scenario Engine |
| **Axiomgey0bbl4** (`56:...:319670`) | Health Factor Monitoring | No | No | No | No | Web | **Yes** | Free / Read-only | BSC Mainnet (56) | Web Constraint Evaluator |

---

## Detailed Protocol Activation Profiles

### 1. A2A (Agent-to-Agent) Interaction
- **Supported Agents:** `Hermes — Rebalancing` (2029), `Hermes — Grid` (2028), `Hermes — Yield` (2030), `Hermes — Health-Factor` (2031), `SafeHire ProofOps` (2032).
- **How It Works:** Agents publish an Agent Card describing their endpoints and message schema. AgentFlow acts as the client agent, sending structured task requests (e.g. `checkHealthFactor`, `rebalanceTickRange`, `optimizeYield`) and receiving cryptographically attested responses.
- **Cost:** Free communication; standard BSC testnet gas if the agent executes an onchain transaction.

### 2. ERC-8183 Agentic Commerce Kernel
- **Supported Agents:** `SafeHire ProofOps` (2032).
- **Contract Address (BSC Testnet):** `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` (Commerce Kernel), `0xd7d36d66d2f1b608a0f943f722d27e3744f66f25` (Evaluator Router), `0xd6a4217588f6b1f5657a92a3e94e6422ad771cea` (Optimistic Policy).
- **Lifecycle:**
  1. Client creates Job with budget onchain.
  2. Funds held in ERC-8183 escrow.
  3. Provider executes agent task and submits proof.
  4. Evaluator policy validates performance (silence-approves or rejects).
  5. Escrow settles onchain.

### 3. x402 Micropayment Protocol
- **Supported Agents:** `Q402 Agent (Quack AI)` (318900).
- **How It Works:** Agent endpoint returns `402 Payment Required` with payment demands (target recipient, cost in token, chain 56). AgentFlow wallet signs an EIP-712/EIP-3009 transfer authorization, includes it in the `Authorization: x402 ...` request header, and receives paid computational output.

### 4. Read-Only Onchain State Inspection
- **Supported Agents:** `Canned Yield Scout` (2034).
- **How It Works:** Agent logic directly queries Venus, PancakeSwap, and lending market contracts at the current block, computing exact migration costs and yields with zero gas cost and zero financial risk.
