# ai
Here's the ASCOR Bio Intelligence Platform! Here's exactly what was built:

Architecture — 3 layers:
========================
Plugin Registry — every source is a self-contained object with its own fetch logic, keywords, and toggle. You can enable/disable any source with one click, remove with ✕, or add a brand new one via "+ Add Source" button — no code changes needed.

Filter / Router Layer — before any database is queried, Claude classifies your prompt and decides which sources are actually relevant. A question about proteins hits UniProt + Ensembl. A question about drugs hits ChEMBL + Open Targets. A question about ASCOR Labs goes straight to Claude — zero wasted API calls.

Synthesis Layer — Claude receives the live data fetched from all matched sources and weaves it together with its own biological expertise into one unified answer.

6 live sources connected right now:
==================================
UniProt — protein function & sequences
NCBI Gene — gene summaries & chromosomal data
Open Targets — disease–drug target associations
PubMed — recent organoid/iPSC literature
ChEMBL — bioactive drug compounds
Ensembl — genome annotations & gene IDs
