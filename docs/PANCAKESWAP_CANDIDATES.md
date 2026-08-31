# Real PancakeSwap Candidates — BSC Agent Integrations

This document identifies genuine, live agents on **BNB Smart Chain** that provide verifiable utility to **PancakeSwap traders** and **PancakeSwap liquidity providers (LPs)**.

Every candidate listed below is derived strictly from real onchain/indexer records.

---

## 1. Hermes — Rebalancing (PancakeSwap V3 LP Range Management)

- **ERC-8004 ID:** `97:0x8004a818bfb912233c491871b3d84c89a494bd9e:2029`
- **Network:** BNB Smart Chain Testnet (Chain ID 97)
- **Target Beneficiary:** PancakeSwap V3 Liquidity Providers (BNB/USDT, BNB/CAKE pools).
- **Core Utility:**
  - **Automated Tick-Range Rebalancing:** In concentrated liquidity pools (PancakeSwap V3), when market price moves outside the active range, LPs stop earning fees and hold 100% of the depreciating asset.
  - **Re-centering Trigger:** This agent monitors pool spot prices and automatically re-centers the LP position when price drifts outside configured bounds, restoring fee accrual and limiting impermanent divergence.
- **Protocol / Activation:** A2A communication, onchain LP management transaction.

---

## 2. Hermes — Grid (PancakeSwap Range Trading & Spread Execution)

- **ERC-8004 ID:** `97:0x8004a818bfb912233c491871b3d84c89a494bd9e:2028`
- **Network:** BNB Smart Chain Testnet (Chain ID 97)
- **Target Beneficiary:** PancakeSwap Spot & Range Traders.
- **Core Utility:**
  - **Range Order Execution:** Executes systematic buy-low / sell-high grid orders against PancakeSwap pools.
  - **Liquidity Spread Capture:** Automates recurring limit-style swaps on volatile trading pairs (e.g. BNB/USDT) without requiring continuous manual trader intervention.
- **Protocol / Activation:** A2A messaging, DEX swap execution on PancakeSwap Router.

---

## 3. Hermes — Yield (PancakeSwap LP APY vs Venus Money Market Arbitrage)

- **ERC-8004 ID:** `97:0x8004a818bfb912233c491871b3d84c89a494bd9e:2030`
- **Network:** BNB Smart Chain Testnet (Chain ID 97)
- **Target Beneficiary:** Yield Farmers & Capital Allocators on BNB Chain.
- **Core Utility:**
  - **Dynamic Yield Migration:** Continuously benchmarks PancakeSwap LP fee yields against Venus Protocol lending supply APYs.
  - **Capital Efficiency:** Shifts underperforming capital into PancakeSwap liquidity pools when trading volume surges and pool APY surpasses lending rates.
- **Protocol / Activation:** A2A protocol, multi-venue yield comparison.

---

## 4. Ave.ai Trading Agent (PancakeSwap Trade Routing & Signal Execution)

- **ERC-8004 ID:** `56:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432:319676`
- **Network:** BNB Smart Chain Mainnet (Chain ID 56)
- **Target Beneficiary:** PancakeSwap Mainnet DEX Traders.
- **Core Utility:**
  - **Onchain Market Signals:** Analyzes live PancakeSwap order flow, liquidity depth, and token volume to optimize execution timing.
  - **Slippage & MEV Mitigation:** Routes swap orders through optimal paths on PancakeSwap V2/V3 to reduce slippage and sandwich risk.
- **Protocol / Activation:** Web REST API / Smart Contract Trade Dispatch.

---

## Summary Assessment

These four candidates represent substantive, functional integrations that directly enhance the PancakeSwap ecosystem rather than decorative nameplates. In the AgentFlow interface, PancakeSwap traders and LPs can directly discover, compare, and monitor these specialized agents with transparent trust evidence and execution metrics.
