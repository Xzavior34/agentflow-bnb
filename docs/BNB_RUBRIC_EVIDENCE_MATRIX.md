# BNB Chain Hackathon Rubric to Evidence Matrix

This matrix maps each official BNB Chain hackathon evaluation criterion to AgentFlow's live public features and verifiable evidence.

---

## 📋 Rubric to Evidence Mapping

| Official Criterion | What BNB Is Testing | AgentFlow Implementation | Live Public Evidence | Onchain Evidence | Current Strength | Current Limitation | Action Required |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Functionality** | End-to-end user journey: Discover ➔ Compare ➔ Hire ➔ Verify | 9-step guided ERC-8183 Commerce Hiring Wizard Modal | [`https://agentflow-bnb.vercel.app/`](https://agentflow-bnb.vercel.app/) | Escrow Kernel `0xa206c051...` (Testnet) | 100% working interactive flow across all routes | Fresh buyer tx requires tBNB gas | Keep honest pre-faucet status |
| **Data Quality** | Decision-grade information beyond vanity counts | Deterministic data provenance model (8004SCAN, ERC-8004, AgentProof) | AgentProfile view at `/agents/56/49637` | Registry `0x8004a169...` (Mainnet) | Zero synthetic data, clear provenance tags | 8004scan API search can 502 | Fallback search client active |
| **Agent Diversity** | Real breadth across 4 required finance categories | Dedicated category routes for Rebalancing, Grid, Yield, Health Factor | `/categories/rebalancing` | 290k+ indexed BSC registrations | Equal first-class UX across all 4 domains | Some metadata lacks detailed APY specs | Display explicit "Agent-Provided" tag |
| **Public Accessibility** | Frictionless inspection without auth | SPA deployment on Vercel with rewrites enabled | [`https://agentflow-bnb.vercel.app/`](https://agentflow-bnb.vercel.app/) | Static `dist/` bundle on CDN | Instant load, 0 404s on direct refresh | None | None |
| **Independent Evidence** | Operational reachability monitoring | AgentProof REST API integration | `/agents/56/49637` | AgentProof Passport `https://agentproof-rho.vercel.app` | Canonical matching on chain + token ID | 25+ matched agents | Fallback to "Not yet indexed" |
