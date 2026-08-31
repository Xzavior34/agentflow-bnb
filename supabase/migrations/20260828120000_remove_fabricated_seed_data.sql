-- Data integrity cleanup — see docs/DATA_INTEGRITY_AUDIT.md
--
-- The original migration (20260104144300_...) inserted four "transactions"
-- rows with fabricated tx_hash values (e.g. '0xabc123...def456') presented as
-- completed on-chain settlements. These never happened on any chain. Per this
-- project's zero-fake-evidence policy, they must not remain in a table that
-- the UI (TransactionFeed.tsx) queries and displays as "Live".
--
-- This does NOT remove the `transactions` table or its real-time subscription
-- mechanism — that mechanism is legitimate and can be reused once it is fed
-- by genuine on-chain or agent activity. It only removes the fabricated rows.

DELETE FROM public.transactions
WHERE tx_hash IN (
  '0xabc123...def456',
  '0x789xyz...123abc',
  '0xfed987...654cba',
  '0x111222...333444'
);

-- The six rows in `services` (Weather Oracle, Sentiment Analysis, etc.) are
-- demo/placeholder listings, not real discovered agents. They are left in
-- place for now because removing them entirely would leave the marketplace
-- empty before real agent-data integration (ERC-8004/8004scan) lands — see
-- docs/BNB_PROTOCOL_RESEARCH.md and docs/CONTRACT_DECISION.md. They are
-- flagged here so they are not mistaken for real inventory, and must be
-- either clearly labeled as demo fixtures in the UI or removed outright
-- during the marketplace-reconstruction phase (not in this cleanup pass).
COMMENT ON TABLE public.services IS
  'Demo/placeholder listings as of 2026-08-28 cleanup. Not sourced from any real agent registry yet. See docs/DATA_INTEGRITY_AUDIT.md.';
