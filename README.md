
# The Disc Mill

**National disc golf intelligence — open data, client-side, zero backend.**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)

[thediscmill.com](https://thediscmill.com) · [Disc Catalog](/discs) · [Buying Guides](/guides) · [Course Finder](/course-finder)

</div>

---

## What It Is

The Disc Mill is a free, open-data disc golf platform. No accounts, no paywalls, no backend — just a fast client-side app that helps players find the right disc, build a bag, discover courses, and learn the sport.

**Core features:**

- **Disc Catalog** — 200+ discs with flight numbers, stability ratings, and manufacturer pages
- **Disc Finder** — filter by category, stability, and throw type to find the right plastic
- **Bag Builder** — visually assemble and evaluate a bag
- **Buying Guides** — honest, beginner-first gear recommendations with affiliate links
- **Recommended Gear** — curated bags, shoes, and accessories
- **Course Finder** — browse and search disc golf courses
- **Players & Events** — PDGA data integration
- **Throw Analyzer** — AI-powered throw analysis via Gemini
- **Flight Simulator** — 2D physics-based disc flight simulation
- **Disc Return Network** — QR-code-based lost disc recovery system
- **Live Data Audit** — real-time dashboard monitoring all external data sources

---

## Architecture

This is a **pure client-side application**. There is no server, no database, no API routes, and no SSR. Every feature runs entirely in the browser.

```
src/
├── pages/          # Route-level page components
├── components/     # Shared UI components
│   └── monetization/   # Affiliate / sponsored components
├── services/       # Data-fetching layer (fetch + in-memory cache)
├── hooks/          # Custom React hooks (useDiscs, useCourses, etc.)
├── utils/          # Pure utilities (amazon.ts, physics.ts, seo.ts, brandSlug.ts)
├── types/          # Shared TypeScript interfaces
└── constants/      # Static reference data

public/
└── data/
    ├── discs_fallback.json      # Authoritative disc catalog (204 discs)
    ├── manufacturers.json       # Manufacturer metadata
    └── products.json            # Gear catalog

scripts/
├── generate-sitemap.js          # Generates public/sitemap.xml
├── sync-discs.js                # Syncs disc data from external APIs
├── scrape-flights.js            # Scrapes flight numbers
└── patch-flights.js             # Patches individual disc flight data
```

**Data sources:**

| Source | Method | Used for |
|---|---|---|
| Infinite Discs API | `fetch()` + JSON | Disc catalog primary |
| `discs_fallback.json` | Static file | Disc catalog fallback |
| PDGA.com | `DOMParser` HTML scrape | Players, events, courses |
| allorigins proxy | CORS wrapper | PDGA scraping |
| Google Gemini | `@google/genai` SDK | Throw analysis |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + React Router 7 |
| Build | Vite 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite` plugin) |
| Animation | Motion (formerly Framer Motion) |
| SEO | `react-helmet-async` + JSON-LD structured data |
| AI | Google Genai (`@google/genai`) |
| QR Codes | `qrcode` library |
| Analytics | Google Analytics 4 (`G-MDVBETWYDP`) |

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template and add your Gemini API key
cp .env.example .env.local

# Start dev server at http://localhost:3000
npm run dev

# Type-check (no test runner — TypeScript only)
npm run lint

# Production build (outputs to /dist)
npm run build

# Preview production build
npm run preview
```

**Environment variables:**

```
GEMINI_API_KEY=your_key_here
```

Only required for the Throw Analyzer feature. All other features work without it.

---

## Data Pipeline

The disc catalog lives in `public/data/discs_fallback.json` and is the source of truth for all disc pages, manufacturer pages, and the sitemap.

```bash
# After updating the catalog, regenerate the sitemap
node scripts/generate-sitemap.js

# Sync disc data from external APIs (fills missing flight numbers)
node scripts/sync-discs.js

# Patch individual flight numbers from DiscIt API
node scripts/patch-flights.js
```

> **Important:** Never overwrite `discs_fallback.json` wholesale — curated descriptions and stable disc IDs live there. Scripts are additive-only: they fill missing data but do not overwrite existing values.

---

## Monetization

The Disc Mill uses Amazon Associates (`thediscmill-20`) for affiliate links. All linking logic goes through `src/utils/amazon.ts` — never hardcode affiliate URLs in UI components.

Priority cascade for disc links: `amazonShort` → `asin` → `amazonQuery` → none.

Sponsorship components live in `src/components/monetization/`. All recommendations are honest — sponsored placements are clearly labeled.

---

## Contributing

Pull requests are welcome. A few hard rules:

- **No backend** — no `/api` routes, no server-side logic, no databases
- **No localStorage/IndexedDB** for core data
- **No new dependencies** without a strong reason — the bundle is intentionally lean
- **Disc IDs and slugs are immutable** — changing them breaks sitemap URLs and inbound links
- **Manufacturer slugs are immutable** — same reason
- New services must register in `LiveDataAudit.tsx`

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
<sub>Built for disc golfers, by disc golfers.</sub>
</div>
