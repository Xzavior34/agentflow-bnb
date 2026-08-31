# Current Verified Proof Ledger — Solana Repro

This ledger documents only independently observed facts.

---

## 1. Automated Engineering Baseline

| Verification Item | Result | Evidence |
|---|---|---|
| **Automated Tests** | **202 / 202 PASSED** | Vitest suite across 22 test files (unit, integration, and security tests). |
| **TypeScript Typecheck** | **CLEAN (0 errors)** | `tsc -p tsconfig.json --noEmit` passed. |
| **ESLint** | **CLEAN (0 errors/warnings)** | `eslint src tests --ext .ts` passed. |
| **Production Build** | **CLEAN** | Compiled to `dist/` via `tsc -p tsconfig.build.json`. |
| **Package Tarball Install** | **VERIFIED LOCALLY** | Tarball `solana-repro-0.1.0-alpha.tgz` (86.4 kB) cleanly installed in fresh temp directory; `npx solana-repro --help` and local verify executed. |

---

## 2. Real Solana Devnet Evidence

| Evidence Primitive | Devnet Target / Input | Observed Result | Status |
|---|---|---|---|
| **RPC Reachability** | `https://api.devnet.solana.com` | Answered with genesis hash in 775ms | **VERIFIED ON DEVNET** |
| **Cluster Genesis Identity** | Expected: `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`<br>Provenance: `solana_official_devnet_genesis_cluster_documentation` | Observed hash matched expected genesis hash | **VERIFIED ON DEVNET** |
| **Program Executability** | Program: `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` (SPL Memo v2) | Account exists, owner: `BPFLoader2`, executable: `true` | **VERIFIED ON DEVNET** |
| **Real Transaction Settlement** | Tx: `2cmytcPSBNaZjqgrEpsfz2mCabmpzV74aakC96JXSjJZzB6PFULZSAnngecKpM2RUSfAqqUAiXHXrJ3pSKXV1d2z` | Confirmed legacy transaction on Devnet, `err: null` | **VERIFIED ON DEVNET** |
| **Exact Transfer Amount** | Signer: `Q2vXcWQF3dHoRVEtY3PwFJsgk7YPEadHg44vFwk5U2G`<br>Recipient: `zgkybQfaNg9xQanB2qtHh36fD5y8EioiEahs5WP4s8i` | Recipient balance increase: **52,067,120 lamports**; Sender decrease: **52,072,120 lamports** (52,067,120 + 5,000 fee) | **VERIFIED ON DEVNET** |
| **Killer Negative Test** | Same Tx, altered expected amount: **52,067,121 lamports** | `tx-transfer FAIL`, Claim: `DISPROVED` (Exit code 1) | **VERIFIED ON DEVNET** |
| **Infrastructure Error Isolation** | Unreachable RPC: `http://127.0.0.1:1` | Checks return `ERROR`, Claim: `UNVERIFIED — ERROR` (Exit code 1, never false FAIL) | **VERIFIED ON DEVNET** |

---

## 3. Local Groundwork vs Grant Milestones

| Component | Current Prototype Status | Grant Milestone Role |
|---|---|---|
| **Deterministic Manifest Hashing** | VERIFIED LOCALLY (`122ccbb1...`) | Core Engine Groundwork |
| **Transaction Construction with Blockhash** | VERIFIED ON DEVNET | Core Engine Groundwork |
| **Certificate Verification Logic** | VERIFIED LOCALLY | Core Engine Groundwork |
| **Client-Side Verification Viewer UI** | BUILT LOCALLY (`viewer/index.html`) | Milestone 4: Deploy publicly |
| **On-Chain Certificate Broadcast** | PENDING OPERATOR WALLET FUNDING | Milestone 2: Live broadcast & verification on Devnet |
| **Versioned (v0) & ALT Support** | PENDING GRANT MILESTONE | Milestone 1: Implement & test v0/ALT |
| **Public NPM Registry Release** | PENDING GRANT MILESTONE | Milestone 3: Publish `solana-repro` |
| **External Repository Hardening** | PENDING GRANT MILESTONE | Milestone 5: Validate 3+ external repos |
