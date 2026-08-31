# Data Integrity Audit

Full sweep of the repository for fabricated evidence, per the project's
zero-fake-evidence policy. Search methods used: `grep` for `Math.random`,
`mock`/`Mock`/`fake`, hardcoded dollar/percentage figures, fabricated tx
hashes, and manual review of every page component (`Index.tsx`,
`Marketplace.tsx`, `Demo.tsx`, `Register.tsx`, `NotFound.tsx`) and every
component that renders numeric or activity data.

This document will need a follow-up pass once real ERC-8004/8004scan data is
wired in (Phase 2), to confirm none of these placeholders crept back in.

## Findings

| # | Location | What was fabricated | Action taken |
|---|----------|---------------------|---------------|
| 1 | `src/components/LiveEconomyTicker.tsx` (mounted globally in `App.tsx`) | A hardcoded, shuffled, looping array of 10 scripted messages ("847 Active Agents connected", "1,402 Transactions settled in the last hour", specific fake per-transaction amounts like "0.001 TCRO") presented with a pulsing "Live" badge as if it were a real-time feed. | Unmounted from `App.tsx`. File moved to `src/_archive/LiveEconomyTicker.tsx` with a docblock explaining why. Not deleted outright in case the shell is reused later against a real data source. |
| 2 | `src/components/AgentLeaderboard.tsx` (mounted on landing page `Index.tsx`) | A hardcoded `MOCK_AGENTS` array (8 fake agent names/emojis, fake trading volume, fake transaction counts, fake win streaks) with a `setInterval` that used `Math.random()` every 4 seconds to fabricate volume increases, new transaction counts, and % change — sorted and displayed as "Top Performing Agents" real-time rankings. | Unmounted from `Index.tsx`. File moved to `src/_archive/AgentLeaderboard.tsx` with a docblock. |
| 3 | `src/pages/Index.tsx` — "Investor Stats Banner" | Hardcoded landing-page stats: `Total Volume: $2.4M+`, `Active Agents: 1,247`, `Services Listed: 89`, `24h Growth: +34.2%`. None of these were derived from any real or even demo data source — plain string literals. | Section removed entirely, replaced with a comment explaining what was there and what a real version needs (genuine measured data or an explicit "Insufficient data" state, never silence forever). |
| 4 | `src/pages/Register.tsx` — "Protocol Stats" panel | Hardcoded `100+ Registered Agents`, `$50K+ Total Volume`, `0.4s Avg Settlement`. | Removed. Kept only `2%` Protocol Fee, which is a real, verifiable constant matching `PROTOCOL_FEE_BPS` in `AgentMarket.sol` — not measured data, but not fabricated either. Replaced the removed stats with an explicit "— (pending real data)" placeholder for registered-agent count rather than inventing a new number. |
| 5 | `src/components/ServiceCard.tsx` — `handlePing` | A "Ping" button that faked a health-check response by generating `Math.floor(Math.random() * 50 + 10)`ms and showing it as a real "is online!" response time. No actual network request was made. | Button and handler removed. Documented that a real health-check requires an actual endpoint to query, which doesn't exist yet in this data layer. |
| 6 | `supabase/migrations/20260104144300_...sql` — `transactions` seed rows | Four rows inserted with fabricated tx hashes (`0xabc123...def456`, `0x789xyz...123abc`, `0xfed987...654cba`, `0x111222...333444`) and `status: 'completed'`, consumed live by `TransactionFeed.tsx` and displayed with a "Live" badge. | New migration `20260828120000_remove_fabricated_seed_data.sql` deletes these four rows by their known fake hashes. The `transactions` table and its realtime-subscription mechanism are legitimate and kept — they just need to be fed by genuine data going forward. |
| 7 | `supabase/migrations/...` — `services` seed rows | Six demo service listings (Weather Oracle, Sentiment Analysis, etc.) attributed to fictional provider IDs (`Agent-Weather-1`, `Agent-Omega-3`, etc.). Not presented with fake activity metrics, but not real discovered agents either. | Not deleted (would leave the marketplace empty pre-migration). Table commented in the new migration as demo/placeholder data, flagged here for the marketplace-reconstruction phase to either clearly label as demo fixtures in the UI or replace with real data — not resolved in this cleanup pass, per the "no full marketplace reconstruction yet" stop condition. |

## Checked and found NOT fabricated (kept as-is)

- `src/pages/Marketplace.tsx` "Stats" footer (Active Services / On-Chain Agents / Avg Cost / Protocol) — all four values are computed live from `combinedServices`/`onChainServices`/`stats` state, not hardcoded or randomized. They're only as "real" as their current data source (see finding #7 above), but the display logic itself doesn't fabricate anything on top of that.
- `src/components/ui/sidebar.tsx` — uses `Math.random()` to vary skeleton-loading-placeholder widths (a standard loading-shimmer UI trick), not presented as data of any kind. No action needed.
- Chain-ID / contract-address inconsistency between `useWallet.ts` and `config/contract.ts` — this was a bug, not fabricated evidence, and is covered separately under the network-architecture fix rather than this audit.

## Not yet addressed (explicitly out of scope for this cleanup pass)

- The `services` table content itself (finding #7) — deferred to marketplace reconstruction.
- Whatever new UI is eventually built to surface real ERC-8004/8004scan-sourced reputation, feedback, and activity data must be checked again once implemented, to ensure it distinguishes onchain-verified data from offchain metadata from agent-provided claims, and never presents "insufficient evidence" as a confident number.
