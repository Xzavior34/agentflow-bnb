# Official Hackathon Requirements — BNB Chain: Build the Era (Smart Money & Agent Studio)

**Retrieval Date:** August 31, 2026  
**Official Hackathon Track:** Main Track — Agent Studio Marketplace  
**Official Chain & Target:** BNB Smart Chain (BSC Mainnet & BSC Testnet Chain ID 97)

---

## 1. Key Hackathon Parameters & Rubric

### 🎯 Primary Judging Criteria (Main Track)

1. **Functionality:**
   - Seamless end-to-end user journey: Discover ➔ Compare ➔ Hire / Activate ➔ Verify onchain.
   - Zero dead buttons, broken routes, or unhandled errors.
   - Publicly accessible web application requiring no private authentication to inspect.

2. **Data Quality:**
   - Decision-grade agent information sourced dynamically from onchain registries (ERC-8004) and decentralized APIs (8004scan / AgentProof).
   - Zero synthetic, fake, or unverified claims.
   - Clear provenance labelling (Identity, Chain, Owner, Protocol Support, Escrow Compatibility).

3. **Agent Diversity:**
   - Comprehensive indexing of 290,000+ registered BSC agents.
   - First-class support for 4 core autonomous finance domains:
     - **Rebalancing**
     - **Grid Trading**
     - **Yield Optimisation**
     - **Health Factor Monitoring**

4. **Public Accessibility & Submission Artifacts:**
   - Public HTTPS URL (Vercel deployment: `https://agentflow-bnb.vercel.app/`).
   - Open source public GitHub repository (`https://github.com/Xzavior34/agentflow-bnb`).
   - Clean, verified documentation, test suite, and evidence ledger.

---

## 2. Verification Checklist

- [x] **Public Accessibility:** Live on Vercel (`https://agentflow-bnb.vercel.app/`).
- [x] **Open Source Code:** Public repository (`https://github.com/Xzavior34/agentflow-bnb`).
- [x] **4 Autonomous Finance Categories:** Implemented at `/categories/*`.
- [x] **Real BSC Agent Data:** Dynamically sourced from 8004scan API & ERC-8004 contracts.
- [x] **Independent Reliability Evidence:** Integrated via AgentProof API.
- [x] **ERC-8183 Escrow Hiring:** Integrated via 9-step guided hiring wizard modal.
