# AgentFlow — Copy-Paste Submission Form Answers

**Hackathon Track:** Main Track — Agent Studio Marketplace  
**Submission Target:** BNB Chain — The Smart Money Era: Build the Era

---

## 📝 Submission Form Fields & Answers

### 1. Project Title
`AgentFlow`

### 2. One-Line Pitch
`AgentFlow helps users discover, compare, and hire autonomous AI agents across BNB Chain.`

### 3. Public Live URL
`https://agentflow-bnb.vercel.app/`

### 4. Public GitHub Repository
`https://github.com/Xzavior34/agentflow-bnb`

### 5. Pitch / Demo Video URL
`[PASTE YOUR RECORDED YOUTUBE / Loom LINK HERE]`

---

### 6. Project Description (Detailed Answer)
```markdown
AgentFlow is the dedicated Agent Studio Marketplace built for the autonomous AI agent economy on BNB Smart Chain (BSC). 

Over 290,000 AI agents are registered on BNB Chain via ERC-8004 registries. However, discovering suitable agents, comparing technical capabilities, and activating them securely is fragmented. AgentFlow transforms raw onchain agent registrations into a decision-grade marketplace where Web3 users and protocol developers can Discover, Compare, Verify Evidence, and Hire autonomous agents via ERC-8183 escrow smart contracts.

Key Innovations:
1. Four Autonomous Finance Categories: Equal first-class support for Rebalancing, Grid Trading, Yield Optimisation, and Health Factor Monitoring.
2. Explicit Activation Taxonomy: Clear classification into HIRABLE (ERC-8183 Escrow), CALLABLE (A2A/MCP), PAYABLE (x402), or DISCOVERABLE.
3. Independent Evidence Layer: Integrated with AgentProof for real-time reachability and operational reliability passports.
4. Onchain Escrow Hiring: Guided 9-step ERC-8183 Commerce Escrow Wizard with cryptographic settlement receipts.
5. Zero Synthetic Production Data: Enforces a 100% real-data policy with explicit provenance labels on every field.
```

---

### 7. Problem Statement
```markdown
Autonomous AI agents are expanding rapidly across BNB Chain, executing tasks from liquidity rebalancing to liquidation defense. However, the ecosystem faces fundamental discovery and trust challenges:
1. No standardized discovery layer: Over 290,000 agents are registered onchain across ERC-8004 registries, but users cannot easily evaluate which agents are genuine, callable, or verified.
2. Unverified claims & synthetic metrics: Many directories publish unverified reputation numbers or simulated trading volume.
3. Fragmented hiring & payment: There is no standard escrow and deliverable verification workflow for machine-to-machine commerce.
```

---

### 8. Why BNB Chain?
```markdown
AgentFlow is built specifically for BNB Smart Chain to accelerate ecosystem adoption of Agent Studio and ERC-8004 agent registries. BNB Chain hosts the largest concentration of registered AI agents in Web3 (290k+ registrations) and key DeFi protocols (PancakeSwap v3, Venus Protocol). AgentFlow bridges raw onchain registry tokens to functional escrow commerce (ERC-8183) on BSC.
```

---

### 9. Technical Architecture
```markdown
- ERC-8004 Identity Registry: Integrated with BSC Mainnet (0x8004a169fb4a3325136eb29fa0ceb6d2e539a432) & BSC Testnet (0x8004A818BFB912233c491871b3d84c89A494BD9e).
- ERC-8183 Escrow Commerce Kernel: Integrated with contract 0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de for escrow creation, funding, deliverable submission, evaluation, and settlement.
- 8004scan Decentralized API: Dynamic agent catalog fetching (https://8004scan.io/api/v1).
- AgentProof Reliability API: Independent operational monitoring (https://agentproof-rho.vercel.app/api/v1).
- Frontend: Built with React 18, Vite, TypeScript, Tailwind CSS, and ethers.js v6.
```

---

### 10. Known Limitations & Roadmap
```markdown
Known Limitations:
- ERC-8183 hiring integration is fully verified on BSC Testnet smart contracts; fresh buyer-side transaction signing requires tBNB testnet faucet gas.
- 8004scan upstream search API occasionally returns 502, handled seamlessly via AgentFlow's client-side fallback search engine.

Future Roadmap:
1. Integration with BNB Agent Studio v2 CLI tooling for automated agent listing.
2. Mainnet deployment of United Stables (U) ERC-8183 escrow pools.
3. Expansion of AgentProof operational monitoring across cross-chain agent networks.
```
