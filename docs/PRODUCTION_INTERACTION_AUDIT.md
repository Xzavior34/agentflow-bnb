# AgentFlow — Deployed Production Interaction Audit

This document records the interaction verification crawl performed against the production application running on **`http://localhost:8080/`**.

---

## 1. Interaction Crawl Results

| Route | Interaction Target | Expected Behavior | Actual Behavior | Result |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Hero `Find Hirable Agents` | Navigates to `/agents?filter=hirable` | Navigates & filters to hirable agents | **PASS** |
| `/` | Hero `Explore All Agents` | Navigates to `/agents` | Navigates to full marketplace | **PASS** |
| `/` | Category Card: Rebalancing | Navigates to `/categories/rebalancing` | Navigates to Rebalancing category page | **PASS** |
| `/` | Category Card: Grid Trading | Navigates to `/categories/grid-trading` | Navigates to Grid Trading category page | **PASS** |
| `/` | Category Card: Yield Optimisation | Navigates to `/categories/yield-optimisation` | Navigates to Yield Optimisation page | **PASS** |
| `/` | Category Card: Health Factor | Navigates to `/categories/health-factor` | Navigates to Health Factor page | **PASS** |
| `/agents` | Search Input | Filters agents by search term | Filters agent list dynamically | **PASS** |
| `/agents` | `HIRABLE ONLY` Badge Filter | Toggles hirable filter | Shows SafeHire ProofOps #2032 | **PASS** |
| `/agents` | Card `Hire Agent` Button | Opens Hire Wizard Modal | Displays Step 1 of guided 9-step wizard | **PASS** |
| `/agents` | Card `Inspect Agent` Button | Navigates to Agent Profile | Opens agent profile view | **PASS** |
| `/agents/56/319871` | Header `Hire Agent` Button | Opens Hire Wizard Modal | Displays Step 1 of guided 9-step wizard | **PASS** |
| `/agents/56/319871` | BscScan Registry Link | Opens external BscScan window | Opens testnet.bscscan.com/address/... | **PASS** |
| `/agents/56/319871` | AgentProof Passport Link | Opens external AgentProof window | Opens agentproof-rho.vercel.app | **PASS** |
| `/compare` | Select Agent Dropdown | Updates compared agent | Updates matrix columns dynamically | **PASS** |
| `/compare` | Remove Agent (`X`) Button | Removes column | Removes agent from compare state | **PASS** |
| Modal | Hire Wizard `Next` / `Back` | Advances / regresses steps | Navigates steps without state corruption | **PASS** |
| Modal | Job Receipt `Download JSON` | Triggers browser download | Downloads `erc8183-job-810-receipt.json` | **PASS** |

---

## 2. Crawl Summary

- **Total Controls Crawled:** 17
- **Passed:** 17
- **Failed:** 0
- **Critical Failure Count:** **0**
- **Audit Verdict:** **PASSED — Production Ready**
