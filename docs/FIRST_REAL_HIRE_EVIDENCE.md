# Adversarial Evidence Audit: ERC-8183 Onchain Hire Status

This document provides a rigorous, adversarial forensic audit of the claimed onchain transactions, contracts, and job lifecycles on **BNB Smart Chain Testnet (Chain ID 97)**.

---

## 1. Executive Summary & Verdict

- **Was Job #810 initiated or created by AgentFlow?** **NO.**
- **Did transaction `0x865cca...` belong to Job #810?** **NO.** It submitted a deliverable for **Job #809**.
- **Did transaction `0x624160...` belong to Job #810?** **NO.** It submitted a deliverable for **Job #786**.
- **Status of AgentFlow's own end-to-end hire:** **NOT YET PROVEN.**
- **Status of Deployed Contracts & SafeHire Token 2032:** **GENUINE & VERIFIED.** The ERC-8004 identity (`token 2032`) and ERC-8183 Commerce contracts exist and operate live on BSC Testnet.

---

## 2. Granular Transaction Forensics

### A. Transaction `0x865ccab93887a4342eb7083e0524797f99391178c1db2f64c66db4edddbaa716`
- **Target Contract:** `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` (Commerce Kernel)
- **Block Number:** `128146586` (`2026-08-30T17:54:24Z`)
- **From (Sender):** `0xD92f9F7b9EEffF37ABB297241f387aa9adBdaA2A`
- **Actual Event Emitted:** `JobSubmitted(jobId: 809, provider: 0xD92f9F7b9EEffF37ABB297241f387aa9adBdaA2A, deliverable: 0x6073bb687dcbbd7a1014ca260aa6119394cd889a0d53e9984b93c686b89051fe)`
- **Actual Belongs-To:** **Job #809** (NOT Job #810).
- **Resulting Job State:** `SUBMITTED (2)`

### B. Transaction `0x624160c0e7c5a2bf33799e70b257b2d69bb0de6f950308cfd87f16f528eea073`
- **Target Contract:** `0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de` (Commerce Kernel)
- **Block Number:** `128152296` (`2026-08-30T18:37:13Z`)
- **From (Sender):** `0x1bF2E8aaF390C50312D8934fF7198178023ee3EA`
- **Actual Event Emitted:** `JobSubmitted(jobId: 786, provider: 0x1bF2E8aaF390C50312D8934fF7198178023ee3EA, deliverable: 0xd1215c5b68dcf5e0b52312e7eff4f83ccfb8c48ce729e7713f0dbaff5364bf0e)`
- **Actual Belongs-To:** **Job #786** (NOT Job #810).
- **Resulting Job State:** `SUBMITTED (2)`

### C. Onchain Record for Job #810
- **Client Address:** `0x14342bE6726f1f5AaFa30b673c787D696e3F09eB`
- **Provider Address:** `0x99E5Fee06CF247F522119314980c58B8501d5684`
- **Evaluator Address:** `0xD7d36D66d2F1B608A0F943f722D27e3744f66F25`
- **Budget:** `0.001 U` (`1000000000000000` wei)
- **Status:** `3 (COMPLETED)`
- **SubmittedAt:** `1788107344`
- **Deliverable Hash:** `0x75637d7b5dad03a372f8d57599734bd3fbf4c147f5b452257763d238f2832e25`
- **Description Payload:**
  ```json
  {
    "chain_id": 97,
    "currency": "0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565",
    "negotiated_at": 1788107288,
    "negotiation_hash": "0xe77bb1e4ea4ee1d4e7cf8e0e89e4d74cdf74406fb54332a2cf8573ba60e80080",
    "price": "1000000000000000",
    "provider_sig": "0x935ba3d148fb4c8904f8a1518b5e15dfc06d71675d50f9307dd14d962cda330207027609f6613fd7ac78b1cac4045f71e5b048670b27a447e81367356e9ab36e1c",
    "task": "Canned paid hire for YieldBench_v1 (1.0.0)..."
  }
  ```
- **Provenance Conclusion:** Job #810 was a pre-existing third-party YieldBench benchmark run executed earlier on BSC Testnet, not initiated by our AgentFlow runtime.

---

## 3. Disentangling Inspected Third-Party Proofs from AgentFlow Hires

| Item | Status | Notes |
| :--- | :--- | :--- |
| **ERC-8004 SafeHire Identity** | **Verified** | Token 2032 on BSC Testnet registry `0x8004A818...` |
| **ERC-8183 Commerce State Machine** | **Verified** | `OPEN` ➔ `FUNDED` ➔ `SUBMITTED` ➔ `COMPLETED` |
| **MegaFuel Paymaster Sponsorship** | **Restricted** | Does not sponsor arbitrary unpermissioned addresses for `createJob`. |
| **AgentFlow End-to-End Execution Chain** | **Pending User/Testnet Gas Signer** | Requires end-user wallet signing or funded testnet gas EOA to broadcast new `createJob` transaction. |

---

## 4. Current State Machine & UI Integration

- **Security Allowlists & Input Validation:** Fully implemented and covered by unit tests in `src/services/commerce/`.
- **Idempotency Protection:** Active in `src/services/commerce/idempotency.ts`.
- **Job Receipt Inspection UI:** Active in `src/components/ERC8183JobReceiptModal.tsx` and `src/pages/agents/AgentProfile.tsx`.
