# Evidence Navigation Index — Solana Repro

This index cross-references all verified claims to their underlying source files, test suites, and on-chain references.

---

| Claim / Capability | Verification Status | Source Location | Test Suite / On-Chain Reference |
|---|---|---|---|
| **Deterministic Check Engine** | VERIFIED LOCALLY | `src/engine/` | `tests/unit/runner.test.ts` |
| **Claim Composition Logic** | VERIFIED LOCALLY | `src/claims/evaluate.ts` | `tests/unit/claims.test.ts` |
| **Secret Redaction & Security** | VERIFIED LOCALLY | `src/security/redact.ts` | `tests/unit/redact.test.ts`, `tests/unit/solanaSecurity.test.ts` |
| **HTML Report Generation (XSS Safe)** | VERIFIED LOCALLY | `src/reporters/html.ts` | `tests/unit/htmlReport.test.ts` |
| **Live Devnet RPC Connectivity** | VERIFIED ON DEVNET | `src/solana/connection.ts` | `tests/devnet/connectivity.test.ts` |
| **Devnet Cluster Genesis Identity** | VERIFIED ON DEVNET | `src/checks/solana/clusterIdentity.ts` | Genesis: `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG` |
| **Devnet Program Executability** | VERIFIED ON DEVNET | `src/checks/solana/programExecutable.ts` | Program: `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` |
| **Real SOL Transfer Settlement** | VERIFIED ON DEVNET | `src/checks/solana/solTransferEffect.ts` | Tx: [`2cmytcPSBNaZjqgrEpsfz2mCabmpzV74aakC96JXSjJZzB6PFULZSAnngecKpM2RUSfAqqUAiXHXrJ3pSKXV1d2z`](https://explorer.solana.com/tx/2cmytcPSBNaZjqgrEpsfz2mCabmpzV74aakC96JXSjJZzB6PFULZSAnngecKpM2RUSfAqqUAiXHXrJ3pSKXV1d2z?cluster=devnet) |
| **Killer Negative Test (+1 Lamport)** | VERIFIED ON DEVNET | `examples/payment-proof/repro.real-tx-negative.yaml` | `tx-transfer: FAIL`, Status: `DISPROVED` |
| **Infrastructure Error Isolation** | VERIFIED ON DEVNET | `src/solana/errors.ts` | Unreachable RPC `127.0.0.1:1` $ightarrow$ `UNVERIFIED — ERROR` |
| **Certification Manifest Hashing** | VERIFIED LOCALLY | `src/evidence/manifest.ts` | Digest: `122ccbb1d9f91b15d8a9e20eaf1e46b3fcdc580285129b8686338346f71ca8b7` |
| **Zero-Backend Verifier UI** | BUILT LOCALLY | `viewer/index.html` | `viewer/README.md` |
