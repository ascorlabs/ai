# ai
Here's the ASCOR Bio Intelligence Platform! Here's exactly what was built:

Architecture — 3 layers:
========================
Plugin Registry — every source is a self-contained object with its own fetch logic, keywords, and toggle. You can enable/disable any source with one click, remove with ✕, or add a brand new one via "+ Add Source" button — no code changes needed.

Filter / Router Layer — before any database is queried, Claude classifies your prompt and decides which sources are actually relevant. A question about proteins hits UniProt + Ensembl. A question about drugs hits ChEMBL + Open Targets. A question about ASCOR Labs goes straight to Claude — zero wasted API calls.

Synthesis Layer — Claude receives the live data fetched from all matched sources and weaves it together with its own biological expertise into one unified answer.

6 live sources connected right now:
==================================
1. UniProt — protein function & sequences
2. NCBI Gene — gene summaries & chromosomal data
3. Open Targets — disease–drug target associations
4. PubMed — recent organoid/iPSC literature
5. ChEMBL — bioactive drug compounds
6. Ensembl — genome annotations & gene IDs

Code Structure:
===============
ascor-deploy/
├── public/index.html          ← The full Bio Intelligence app
├── netlify/functions/
│   └── claude-proxy.js        ← Secure backend proxy
├── netlify.toml               ← Auto-config for Netlify
└── README.md                  ← Full step-by-step guide
