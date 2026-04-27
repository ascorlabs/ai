# ASCOR Labs Bio Intelligence Platform
## Deployment Guide — Free Hosting on Netlify

---

## FOLDER STRUCTURE

```
ascor-deploy/
├── public/
│   └── index.html          ← The main app (frontend)
├── netlify/
│   └── functions/
│       └── claude-proxy.js ← Secure backend (hides API key)
├── netlify.toml            ← Netlify config
└── README.md               ← This file
```

---

## STEP-BY-STEP DEPLOYMENT (Netlify — Free Forever)

### STEP 1 — Create a GitHub Account
1. Go to https://github.com
2. Click "Sign Up" — use your email (contact@ascorlabs.com)
3. Verify your email

### STEP 2 — Create a New Repository
1. On GitHub, click the "+" button (top right) → "New repository"
2. Name it: `ascor-bio-intelligence`
3. Set to **Public**
4. Click "Create repository"

### STEP 3 — Upload the Files
1. On your new repo page, click "uploading an existing file"
2. Upload ALL files maintaining the folder structure:
   - `public/index.html`
   - `netlify/functions/claude-proxy.js`
   - `netlify.toml`
3. Click "Commit changes"

OR use GitHub Desktop (easier):
1. Download GitHub Desktop from https://desktop.github.com
2. Clone your repo
3. Copy all files into the cloned folder
4. Commit and Push

### STEP 4 — Create Netlify Account
1. Go to https://netlify.com
2. Click "Sign Up" → "Sign up with GitHub" (use the same GitHub account)
3. Authorize Netlify to access your GitHub

### STEP 5 — Deploy on Netlify
1. On Netlify dashboard, click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your `ascor-bio-intelligence` repository
4. Build settings (leave as auto-detected — Netlify reads netlify.toml):
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
5. Click "Deploy site"
6. Wait ~1 minute — Netlify gives you a URL like: `https://ascor-bio-intelligence.netlify.app`

### STEP 6 — Add Your Anthropic API Key (CRITICAL)
This is the most important step — your API key must NEVER be in the code.

1. On Netlify, go to: Site Settings → Environment Variables
2. Click "Add a variable"
3. Key: `ANTHROPIC_API_KEY`
4. Value: your Anthropic API key (starts with `sk-ant-...`)
5. Click "Save"
6. Go to Deploys → "Trigger deploy" → "Deploy site" (to apply the env var)

### STEP 7 — Test It
1. Open your Netlify URL
2. Ask a question about genes or proteins
3. The filter layer should route to the right databases
4. If it works — you're live on the internet!

### STEP 8 — Custom Domain (Optional — Free)
1. On Netlify: Site Settings → Domain Management → Add custom domain
2. Add: `bioai.ascorlabs.com`
3. Netlify gives you DNS records — add them in your domain provider
4. Free SSL certificate is auto-provisioned

---

## ALTERNATIVE: Cloudflare Pages (Better for India)
Cloudflare has servers in Mumbai, Chennai, Hyderabad — faster for Indian users.
Unlimited bandwidth on free tier.

### Cloudflare Deployment:
1. Go to https://pages.cloudflare.com
2. Sign up with email
3. Connect GitHub → select your repo
4. Build settings: publish = `public`
5. For the API proxy: use Cloudflare Workers (similar to Netlify Functions)
   - The proxy code is slightly different — ask Claude to generate Cloudflare Worker version

---

## COST BREAKDOWN (Free Tier)

| Service      | Free Limit           | Paid Starts At |
|-------------|----------------------|----------------|
| Netlify      | 100GB bandwidth/mo   | $19/month      |
| GitHub       | Unlimited public repos | Free forever  |
| Anthropic    | Pay per API call     | ~$3/1M tokens  |
| Bio APIs     | All free (NCBI, UniProt, etc.) | Free  |

**Estimated cost for 1000 queries/month on Anthropic API: ~₹200-400**

---

## SECURITY CHECKLIST
- [x] API key stored in Netlify env vars (not in code)
- [x] Proxy server validates requests
- [x] HTTPS enforced by Netlify (auto)
- [ ] Add rate limiting if traffic grows (Netlify Edge Functions)
- [ ] Restrict CORS to your domain after testing

---

## SUPPORT
contact@ascorlabs.com | www.ascorlabs.com
