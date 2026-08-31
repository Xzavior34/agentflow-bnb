# AgentFlow — Complete User-Facing Interaction Audit

This document provides a comprehensive inventory and classification of every user-facing control, route, button, CTA, form, filter, dropdown, tab, link, copy button, and modal action in **AgentFlow**.

---

## 1. Route & Component Interaction Inventory

| Route / Component | Control / Action | Target / Function | Classification | Verification Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`/` (Homepage)** | **`Find Hirable Agents` (Hero Primary CTA)** | Navigates to `/agents?filter=hirable` | **WORKING** | Pre-filters marketplace to hirable agents. |
| **`/` (Homepage)** | **`Explore Marketplace` (Hero Secondary CTA)** | Navigates to `/agents` | **WORKING** | Opens full agent marketplace catalog. |
| **`/` (Homepage)** | **Category Cards (4)** | Navigates to `/categories/{slug}` | **WORKING** | Links to Rebalancing, Grid, Yield, Health. |
| **`/` (Homepage)** | **`Compare Agents` CTA** | Navigates to `/compare` | **WORKING** | Opens side-by-side comparison matrix. |
| **`/agents` (Marketplace)** | **Search Input** | Client-side catalog search | **WORKING** | Searches name, ID, category, capabilities. |
| **`/agents` (Marketplace)** | **`HIRABLE ONLY` Filter Badge** | Toggles hirable filter | **WORKING** | Filters list to ERC-8183 hirable agents. |
| **`/agents` (Marketplace)** | **Protocol Filter Tabs (All, A2A, MCP, x402)** | Filters catalog by protocol | **WORKING** | Filters agents by declared protocol. |
| **`/agents` (Marketplace)** | **`Hire Agent` Button (Card)** | Opens Hire Wizard Modal | **WORKING** | Triggers guided ERC-8183 hiring wizard. |
| **`/agents` (Marketplace)** | **`Inspect Agent` Button (Card)** | Navigates to `/agents/:chainId/:tokenId` | **WORKING** | Opens detailed agent profile page. |
| **`/agents/:chainId/:tokenId` (Profile)** | **`Hire Agent` Button (Header)** | Opens Hire Wizard Modal | **WORKING** | Triggers guided ERC-8183 hiring wizard. |
| **`/agents/:chainId/:tokenId` (Profile)** | **BscScan Registry Link** | Opens external BscScan URL | **WORKING** | Opens contract on testnet.bscscan.com. |
| **`/agents/:chainId/:tokenId` (Profile)** | **AgentProof Passport Link** | Opens external AgentProof URL | **WORKING** | Opens agentproof-rho.vercel.app. |
| **`/categories/:category`** | **Category Switcher Buttons** | Navigates to category route | **WORKING** | Switches between 4 first-class categories. |
| **`/categories/:category`** | **Category Search Input** | Filters category agents | **WORKING** | Filters agents within current category. |
| **`/compare`** | **Agent Selector Dropdowns** | Selects agent for slot 1/2/3 | **WORKING** | Updates comparison query parameter. |
| **`/compare`** | **Remove Agent (`X`) Button** | Removes agent from matrix | **WORKING** | Removes agent and updates URL state. |
| **`ERC8183HireWizardModal`** | **Next / Back / Close Buttons** | Navigates wizard steps | **WORKING** | Navigates 9 steps cleanly without state loss. |
| **`ERC8183HireWizardModal`** | **`Connect MetaMask Wallet`** | Invokes EIP-1193 provider | **WORKING** | Triggers window.ethereum connection. |
| **`ERC8183JobReceiptModal`** | **`Download JSON Proof` Button** | Downloads receipt JSON file | **WORKING** | Exports cryptographic JSON receipt. |
| **`ERC8183JobReceiptModal`** | **BscScan Transaction Links** | Opens external BscScan tx | **WORKING** | Links to verified transaction hashes. |

---

## 2. Classification Summary

- **WORKING:** 20 / 20 audited interactions (**100%**)
- **BROKEN:** 0 / 20 (**0%**)
- **PARTIAL:** 0 / 20 (**0%**)
- **UNVERIFIED:** 0 / 20 (**0%**)
- **INTENTIONALLY_DISABLED:** 0 / 20 (**0%**)

**Verdict:** Zero dead buttons or broken links exist in the production runtime.
