# AgentProof Integration — Verified Candidate Document

**Candidate Agent:** OpenOdds.Ai  
**Chain:** BSC Mainnet  
**ERC-8004 Token ID:** `49637`  
**Registry Contract:** `0x8004a169fb4a3325136eb29fa0ceb6d2e539a432`  
**AgentProof ID:** `bsc:49637`  
**AgentProof Public API Endpoint:** `https://agentproof-rho.vercel.app/api/v1/agents/bsc/49637`

---

## 1. Verified Evidence Payload

```json
{
  "data": {
    "identity": {
      "id": "bsc:49637",
      "chain": "bsc",
      "onchainId": "49637",
      "registryAddress": "0x8004a169fb4a3325136eb29fa0ceb6d2e539a432",
      "provenance": {
        "source": "INDEXER",
        "origin": "8004scan",
        "observedAt": "2026-08-31T06:49:59.731Z"
      }
    },
    "metadata": {
      "agentId": "bsc:49637",
      "name": "OpenOdds.Ai",
      "description": "Verifiable pre-match football odds prediction agent for major European leagues, combining five-model consensus, xG context, and on-chain commit-reveal records.",
      "metadataUri": "ipfs://QmaynfJRJSCeytJqU5a1ENETc97hcTHEkCTtFRtNwMoyxS"
    }
  }
}
```

---

## 2. Integration & Provenance Rules

1. **Canonical Matching:** AgentFlow matches `OpenOdds.Ai` exclusively via canonical keys: `chain = "bsc"`, `tokenId = "49637"`, and `registryAddress = "0x8004a169fb4a3325136eb29fa0ceb6d2e539a432"`.
2. **Provenance Distinction:** 8004scan identity/metadata is displayed alongside independent operational monitoring signals from AgentProof.
3. **Public Reliability Passport Link:** Direct link rendered to `https://agentproof-rho.vercel.app`.
