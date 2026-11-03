# Christian Jeremiah — Product Design Portfolio Web App

> **Redesign (current):** the pages are generated. Edit the copy and facts in `scripts/content/site.mjs` (case studies, figures, article text in `scripts/content/article.json`), then run `npm run site` to rewrite the HTML. Styles live in `assets/site/site.css`, behaviour in `assets/site/site.js`. The Clash Grotesk font is in `fonts/clash-grotesk/`.

A high-performance, responsive portfolio web application showcasing UI/UX product design, research, case studies, and insights by **Christian Jeremiah**.

---

## ✨ Features & Architecture

- **High-Performance Static Core**: Built from optimized Framer production export with ES modules (`.mjs`), custom typography, Lottie animations, and Framer CMS hydration.
- **Custom Native Node Server (`server.js`)**:
  - Full MIME type support for modern formats (`.mjs`, `.framercms`, `.woff2`, `.lottie`, `.svg`, `.webp`).
  - Native **HTTP Range Request** (`206 Partial Content`) handling for Framer CMS binary chunk streaming.
  - Automatic directory index routing & clean URLs (`/case-studies/keepit`, `/contact`, `/blog`).
  - Transparent **Framer CDN mapping** resolving 190+ image, font, and asset URLs locally.
  - **Live Reload** in development mode using Server-Sent Events (SSE) with automated file change detection.
  - Gzip / Deflate compression for ultra-fast page delivery.
- **Pre-configured Multi-Platform Deployment**:
  - [Vercel](vercel.json) with custom header MIME types and redirects.
  - [Netlify](netlify.toml) configuration with caching headers.
  - [Cloudflare Pages](_headers) headers and redirects support.

---

## 🚀 Quick Start

### 1. Start Development Server
Starts the local web server with **Hot Live-Reload** enabled:

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser. Any edits made to HTML or assets will automatically refresh the browser.

### 2. Production Preview
Serves the web application in production mode with caching headers:

```bash
npm start
# or: npm run preview
```

The server runs in production mode by default. `npm run dev` enables live reload.

### 3. Verify Assets & Routes
Verifies that all 300+ asset links, CDN mappings, and internal routes exist on disk.
The command exits with a non-zero status if it finds missing references:

```bash
npm run verify
```

### 4. Build Audit
Runs a complete pre-flight check across all routes, file sizes, and deployment manifests:

```bash
npm run build
```

---

## 📂 Project Structure

```
├── server.js                      # Custom Node dev/production server with Range & MIME handling
├── package.json                   # NPM configuration, dependencies & build scripts
├── framer-cdn-map.json            # Framer CDN to local asset path mapping
├── index.html                     # Homepage (Hero, Case Studies, Skills & Tools, Blog preview)
├── contact/
│   └── index.html                 # Contact page
├── blog/
│   ├── index.html                 # Blog overview
│   └── what-is-an-experience/     # Article: What is an experience?
├── case-studies/
│   ├── keepit/                    # Microsoft Backup Integration
│   ├── google-transtale/          # Multi-User Translation Solution
│   ├── rislly/                    # Pet Adoption Management
│   ├── opnr/                      # OPNR Redesign
│   └── girintec/                  # Girintec Case Study
├── scripts/
│   ├── project-paths.js           # Project-root path validation helper
│   ├── site-config.js             # Shared route and hosting configuration
│   ├── verify-assets.js           # Automated link & asset integrity checker
│   ├── build.js                   # Build verification and site metrics audit
│   └── fix-links.js               # Route link normalizer
├── assets/
│   ├── js/framer/                  # Generated Framer ES module bundles
│   └── ...                         # CMS chunks and other static assets
├── fonts/                         # Web fonts (Albert Sans, Inter, FontShare)
├── images/                        # Optimized project screenshots, logos & SVGs
├── vercel.json                    # Vercel deployment configuration
├── netlify.toml                   # Netlify deployment configuration
├── _headers                       # Cloudflare Pages / Netlify headers
└── _redirects                     # 301 Redirect rules for clean routes
```

---

## 🌐 Deployment

### Vercel
1. Install Vercel CLI (`npm i -g vercel`) or push the repo to GitHub.
2. Run `vercel` or link your repository on [vercel.com](https://vercel.com).
3. The included [vercel.json](vercel.json) handles MIME headers for `.mjs` and `.framercms` automatically.

### Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Set Publish directory to `.` (root).
3. The included [netlify.toml](netlify.toml) configures headers and redirects automatically.

### Cloudflare Pages
1. Connect your repository on Cloudflare Pages.
2. Leave build command empty and set publish directory to `.`.
3. `_headers` and `_redirects` will be automatically applied.
