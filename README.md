# 🧬 ASCOR Labs — Bio Intelligence Platform

> An AI-powered biological research assistant that connects to live open-source databases, intelligently routes queries, and synthesizes answers using Claude AI.

![Platform](https://img.shields.io/badge/Platform-Web-teal) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204-blue)

---

## 🌐 Live Demo

**[ai.ascorlabs.com](https://aiascorlabscom.netlify.app/)** — Ask anything about genes, proteins, organoids, drug targets, stem cells, and more.

---

## 📖 About

The ASCOR Labs Bio Intelligence Platform is a scalable, modular AI research assistant built for scientists, researchers, and pharma professionals. It was built by [ASCOR Labs](https://ascorlabs.com) — a Hyderabad-based deep-tech biotech startup pioneering human brain organoid technology.

Instead of relying on a single AI model, this platform routes every question through a **filter layer** that identifies which biological databases are relevant, queries them in parallel, and hands the live data to Claude AI for synthesis into a precise, contextual answer.

---

## 🏗️ Architecture

```
User Prompt
     │
     ▼
┌─────────────────────────────┐
│     Filter / Router Layer    │  ← Claude classifies the prompt
│  (decides which sources fit) │    and selects relevant sources
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────┐
│              Parallel Source Fetcher                 │
│                                                     │
│  UniProt │ NCBI Gene │ Open Targets │ PubMed │ ...  │
│  Ensembl │ ChEMBL   │ [your source] │ [+ add more]  │
└─────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────┐
│     Claude Synthesis Layer   │  ← Combines live data +
│     (Claude Sonnet 4)        │    domain expertise
└─────────────────────────────┘
     │
     ▼
  Final Answer + Pipeline Trace
```

**Key design principle:** If no biological source matches the prompt, the question goes directly to Claude — no wasted API calls.

---

## ✨ Features

### 🔌 Plugin Registry — Fully Modular Sources
Every data source is a self-contained plugin object. You can:
- **Enable / disable** any source with a single toggle — no code changes
- **Add a new source** via the UI — just paste an API endpoint and keywords
- **Remove a source** entirely with one click
- The filter layer automatically learns which prompts match new sources via keywords

### ⚡ Intelligent Filter / Router Layer
Before any database is queried, a Claude classification call reads the prompt and returns a JSON list of which sources are relevant. This means:
- A question about a protein → hits UniProt + Ensembl only
- A question about a drug → hits ChEMBL + Open Targets only
- A question about ASCOR Labs → goes straight to Claude, zero external calls

### 📡 Live Biological Data Sources (6 built-in)

| Source | Category | What it provides |
|--------|----------|-----------------|
| **UniProt** | Protein | Protein sequences, function, disease associations |
| **NCBI Gene** | Genomics | Gene summaries, chromosomal locations, OMIM links |
| **Open Targets** | Drug / Disease | Target–disease associations, drug pipeline data |
| **PubMed** | Literature | Recent organoid/iPSC/stem cell papers & abstracts |
| **ChEMBL** | Drug | Bioactive molecules, IC50 values, clinical phase |
| **Ensembl** | Genome | Gene annotations, coordinates, biotype, assembly |

All sources are free, open, and require no API keys.

### 🧠 Claude Synthesis
After fetching live data, Claude receives:
- Structured results from all matched sources
- ASCOR Labs scientific context (brain organoids, Triple-i protocol, patents)
- The original user question

It synthesizes everything into a single, precise, well-formatted answer — not a raw database dump.

### 📊 Pipeline Trace
Every response shows a trace of exactly which sources were queried, which were skipped, and how many results each returned — giving full transparency into how the answer was built.

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone the repository
git clone https://github.com/ascorlabs/bio-intelligence-platform.git
cd bio-intelligence-platform

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Set your Anthropic API key
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# 4. Run locally
netlify dev

# 5. Open in browser
# http://localhost:8888
```

---

## ☁️ Deploy to Netlify (Free)

### One-click deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ascorlabs/bio-intelligence-platform)

### Manual deploy

**Step 1 — Fork or clone this repository**

**Step 2 — Connect to Netlify**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → select this repository
4. Build settings are auto-detected from `netlify.toml`
5. Click "Deploy site"

**Step 3 — Add your API key (critical)**
1. Go to: Site Settings → Environment Variables
2. Add a new variable:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com)
3. Click Save → go to Deploys → Trigger deploy → Deploy site

**Step 4 — Your app is live**
```
https://your-site-name.netlify.app
```

**Step 5 — Custom domain (optional)**
1. Site Settings → Domain management → Add custom domain
2. Enter: `bioai.ascorlabs.com`
3. Add the CNAME record Netlify provides to your DNS:
   - Type: `CNAME`
   - Name: `bioai`
   - Value: `your-site.netlify.app`
4. Free SSL certificate is auto-provisioned within minutes

---

## 📁 Project Structure

```
bio-intelligence-platform/
│
├── public/
│   └── index.html              # Full frontend app (single file)
│
├── netlify/
│   └── functions/
│       └── claude-proxy.js     # Secure backend proxy — hides API key
│
├── netlify.toml                # Netlify build + redirect config
└── README.md                   # This file
```

---

## 🔧 Adding a New Biological Source

Open `public/index.html` and add a new object to the `SOURCE_REGISTRY` array:

```javascript
{
  id: 'string_db',              // unique ID
  name: 'STRING DB',            // display name
  category: 'protein',          // gene | protein | disease | singlecell | pathway | literature | model
  icon: '🔗',
  color: '#69db7c',
  colorA: 'rgba(105,219,124,0.1)',
  description: 'Protein interaction networks',
  keywords: ['interaction', 'network', 'PPI', 'binding', 'STRING'],  // filter matching
  tags: ['REST API', 'Interactions'],
  enabled: true,
  fetch: async (query) => {
    const r = await fetch(`https://string-db.org/api/json/network?identifiers=${encodeURIComponent(query)}&species=9606&limit=5`);
    const d = await r.json();
    return d.map(item => ({ from: item.preferredName_A, to: item.preferredName_B, score: item.score }));
  }
}
```

That's it — the filter layer automatically uses your `keywords` array to decide when to call this source. No other code changes needed.

---

## 🔒 Security

- **API key is never exposed** to the browser. It lives only in Netlify's environment variables and is injected server-side via the `claude-proxy.js` function.
- All browser requests go to `/api/claude-proxy` — a serverless function that adds the key before forwarding to Anthropic.
- HTTPS is enforced by Netlify on all deployments.

---

## 💰 Cost

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Netlify hosting | 100 GB bandwidth/month | Free forever |
| GitHub | Unlimited public repos | Free forever |
| UniProt, NCBI, Ensembl, PubMed, Open Targets, ChEMBL | Unlimited | All free, open APIs |
| Anthropic API | Pay per use | ~₹200–400 per 1,000 queries |

**Total infrastructure cost: ₹0/month** (Anthropic API usage billed separately based on actual usage.)

---

## 🧪 Built on ASCOR Science

This platform is grounded in ASCOR Labs' own published research and patents:

- **Nature Cell Biology (2022)** — Triple-i protocol for generating outer radial glia (oRG) cells and cortical organoids from iPSCs
- **Cell Stem Cell (2017)** — iPSC-derived organoid models for Multiple Sclerosis
- **Patent WO2023166111A1** — Method for generating oRG cells and cortical organoids
- **Patent WO2024100666A1** — AI-driven diagnostic platform for brain organoid analysis
- **Patent WO2024100667A1** — Reinforcement learning in neuronal cultures via MEA

**Scientific team:**
- Dr. Sneha Arora — Co-Founder & Chief Scientist, UCSF Broad Center (Rostock, Germany)
- Dr. Naresh Mutukula — CTO & Lead Scientist, Altos Labs (formerly Salk Institute) — 283 citations
- Jaligama Mounica — Co-Founder
- Damerla Divya Mallika — Co-Founder

---

## 🤝 Contributing

We welcome contributions — especially new biological data source plugins. Please open an issue or pull request.

1. Fork the repository
2. Add your source to `SOURCE_REGISTRY` in `public/index.html`
3. Test locally with `netlify dev`
4. Submit a pull request with a description of what the source provides

---

## 📬 Contact

**ASCOR Labs** — Hyderabad, India

- 🌐 [ascorlabs.com](https://ascorlabs.com)
- 📧 [contact@ascorlabs.com](mailto:contact@ascorlabs.com)
- 📞 +91 7569184252

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.

---

*Built with ❤️ in Hyderabad, India — transforming drug discovery with human organoids.*
