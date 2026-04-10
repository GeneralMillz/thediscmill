# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Identity

The Disc Mill is a **national, open-data, client-side disc golf platform** — a media + discovery ecosystem, not a retailer. It helps players find discs, build bags, learn to throw, explore courses, and return lost discs.

---

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build (outputs to /dist)
npm run lint      # Type-check only (tsc --noEmit — no test runner exists)
npm run preview   # Preview the production build
```

**Environment:** Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`.

---

## Architecture Contract (Non-Negotiable — The 9 Rules)

This is a **pure client-side** application. There is no backend, no database, and no server-side rendering. Every rule below is a hard constraint:

| # | Rule | What's Forbidden |
|---|------|-----------------|
| 1 | Pure Client-Side | `/api` folders, server routes, SSR |
| 2 | Direct Fetching | Internal `/api/*` proxy endpoints |
| 3 | No Persistence | `localStorage`, `IndexedDB`, `fs`, any DB client |
| 4 | In-Memory Cache | Filesystem-based caching (use `Map` only) |
| 5 | Client Components | Server-side data fetching logic |
| 6 | No SSR | `getServerSideProps` or equivalent |
| 7 | Browser-Only Audit | Backend-dependent monitoring |
| 8 | Minimal Env Vars | Hardcoded secrets; unneeded env vars |
| 9 | Universal Enforcement | Any feature violating rules 1–8 |

**Anti-patterns:** Never create `/api/*` routes. Never use `fs`, `sqlite`, `pg`, or any database client. Never use `localStorage` or `IndexedDB` for core data. Never implement Node.js server logic.

---

## Data Architecture

**External sources:**
- **PDGA.com** — HTML-scraped via `DOMParser` (highly sensitive to markup changes; parser drift is common)
- **Infinite Discs** — JSON API (generally stable, requires proper headers)
- **allorigins** proxy — used for CORS-protected endpoints

**Service layer** (`/src/services/*.ts`): Every service must (1) initialize a private `const cache = new Map<string, any>()`, (2) export `async` functions using `fetch()`, (3) handle errors gracefully (log, return null/empty), and (4) log a "Parser Drift" warning if `DOMParser` selectors return null. Services: `discs.ts`, `courses.ts`, `players.ts`, `events.ts`, `rounds.ts`, `search.ts`, `products.ts`, `audit.ts`.

**Hooks** (`/src/hooks/`): All UI data consumption goes through custom hooks (`useDiscs`, `useCourses`, etc.) using the `useEffect` → service call → `{data, loading, error}` pattern.

**Live Data Audit Dashboard** (`/src/pages/LiveDataAudit.tsx`): The system "cockpit." Monitors all external services in real-time. Latency thresholds: green < 500ms, yellow 500–1500ms, red > 1500ms. When adding a new service, register it here.

---

## Adding New Features

1. **New service:** `/src/services/[name].ts` — `fetch` + `DOMParser` + `Map` cache
2. **New hook:** `/src/hooks/use[Name].ts` — `useEffect` calling the service
3. **New page:** `/src/pages/[Name].tsx` — registered in `App.tsx` router
4. **Register in audit:** Add the new service to `LiveDataAudit.tsx`'s services array
5. **Validate:** No backend, no persistence, pure client-side only

---

## Monetization System

Monetization is implemented as a **provider system** — never hard-code affiliate URLs in UI components.

**Amazon Associates:** Affiliate tag is `thediscmill-20`. Use `src/utils/amazon.ts` → `linkFor(asin)`.

**Brand modules** live in `/src/utils/` (or `/affiliates/`). Each exports `isAvailable`, `linkFor(sku)`, and `metadata`. Phase 1 brands: Infinite Discs, OTB Discs, Discmania, MVP/Axiom/Streamline, Dynamic Discs/Trilogy, Discraft, Thought Space Athletics, Upper Park, GripEQ, Bushnell.

**Sponsorship UI components:** `<SponsoredBadge />`, `<FeaturedPlacement />`, `<SpotlightManufacturer />` (in `/src/components/monetization/`).

**Product catalog schema:**
```json
{
  "id": "unique-id",
  "name": "Product Name",
  "brand": "Brand Name",
  "type": "disc | bag | shoe | accessory | training",
  "role": "putter | midrange | fairway | driver | etc",
  "asin": "optional Amazon ASIN",
  "sku": "optional brand SKU",
  "flight": { "speed": 7, "glide": 5, "turn": -1, "fade": 2 },
  "beginnerNotes": "string",
  "sponsored": false
}
```

**Monetization is additive-only:** Never break existing tools. All changes must be modular and isolated. Recommendations must be honest — no hype, no deceptive placements.

---

## Key Architectural Notes

- **Path alias:** `@/*` maps to the repo root (configured in `tsconfig.json` and `vite.config.ts`)
- **Routing:** React Router 7 with 16+ routes defined in `App.tsx`
- **Styling:** Tailwind CSS 4.x (configured via `@tailwindcss/vite` plugin, not `postcss`)
- **AI:** Google Genai (`@google/genai`) — used for throw analysis features; requires `GEMINI_API_KEY`
- **Flight physics:** `src/utils/physics.ts` implements 2D disc flight simulation (drag, lift, stability, wind, terrain)
- **QR codes:** `src/utils/qr.ts` + `qrcode` library — used by the Disc Return Network
- **Google Analytics:** Injected in `index.html` (tag `GA-MDVBETWYDP`)
- **Geolocation:** Requested at app level (declared in `metadata.json`) for location-aware course/gear features
