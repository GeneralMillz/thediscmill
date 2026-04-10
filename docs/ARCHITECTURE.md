# The Disc Mill: Technical Specification & Architecture Manual

**Version:** 1.0.0  
**Status:** Production-Ready / Mission-Critical  
**Architecture:** Pure Client-Side / Instrumented Observability

---

## 1. Project Overview

The Disc Mill is a high-performance, data-driven disc golf platform. Its core philosophy is **radical simplicity through client-side instrumentation**.

Unlike traditional web applications that rely on backends, databases, or server-side rendering, The Disc Mill operates entirely within the user's browser. It treats external APIs as live, volatile data streams, and the platform itself as an **instrumented system** that provides real-time observability into its own health.

**Core Philosophy:**
- **Zero-Backend:** No server routes, no Node.js server, no server actions.
- **Zero-Persistence:** No databases, no filesystem writes, no `localStorage` for core data.
- **Live-Fetch:** Data is fetched directly from external sources (PDGA, Infinite Discs) in real-time.
- **Observability-First:** Every external dependency is monitored via the Live Data Audit Dashboard.

---

## 2. The Architecture Contract (The 9 Rules)

Any engineer contributing to The Disc Mill must adhere to these 9 rules. Violation of these rules compromises the integrity of the platform.

| Rule | Description | Violation Indicator |
| :--- | :--- | :--- |
| **1. Pure Client-Side** | No backend, server routes, or SSR. | Presence of `/api` folders or server-side code. |
| **2. Direct Fetching** | Fetch directly from external sources. | Internal `/api/*` endpoints. |
| **3. No Persistence** | No databases, `localStorage`, or IndexedDB. | Imports of `fs`, `sqlite`, or `localStorage` usage. |
| **4. In-Memory Cache** | Use `Map` objects only. | Filesystem-based caching. |
| **5. Client Components** | All data-fetching components are "use client". | Server-side data fetching logic. |
| **6. No SSR** | All fetches happen in the browser. | `getServerSideProps` or similar. |
| **7. Browser-Only Audit** | Audit dashboard must run in-browser. | Backend-dependent monitoring. |
| **8. Minimal Env Vars** | No API keys unless unavoidable. | Hardcoded secrets or unneeded env vars. |
| **9. Universal Enforcement** | Rules apply to all future features. | Any feature violating rules 1-8. |

---

## 3. Service Layer Specification

All external data interaction occurs within `/src/services/*.ts`.

### Service Structure
Each service file must:
1.  Initialize a private `const cache = new Map<string, any>();` for in-memory caching.
2.  Export `async` functions that perform `fetch()` calls.
3.  Handle errors gracefully (log to console, return empty/null).
4.  Perform HTML parsing (for PDGA) using `DOMParser`.

### Service Inventory

| Service | Source | Purpose |
| :--- | :--- | :--- |
| `discs.ts` | Infinite Discs | Disc data, flight numbers, pricing. |
| `courses.ts` | PDGA | Course directory, location, ratings. |
| `players.ts` | PDGA | Player profiles, ratings. |
| `events.ts` | PDGA | Tournament data. |
| `rounds.ts` | PDGA | Round scores/data. |
| `search.ts` | External | Search indexing. |

### Error Handling & Validation
- **Parser Drift Detection:** If `doc.querySelector()` returns `null` or zero matches, the service must log a "Parser Drift" warning to the console, which the Audit Dashboard will capture.
- **Schema Validation:** Services should ideally validate the shape of returned data (e.g., checking for required fields) before caching.

---

## 4. React Hooks Specification

All data consumption in UI components must be handled via custom hooks (e.g., `useDiscs`, `useCourses`).

- **Client Components:** Hooks must be used in components marked with `'use client'`.
- **`useEffect` Pattern:** Hooks must use `useEffect` to trigger the service layer fetch, handle loading states, and update local state.
- **State Management:** Hooks must expose `data`, `loading`, and `error` states to the component.

---

## 5. Live Data Audit Dashboard Specification

The Audit Dashboard (`/src/components/LiveDataAudit.tsx`) is the system's "cockpit."

### Key Features
- **Endpoint Health Checks:** Real-time status (OK/Slow/Error) based on latency.
- **Latency Thresholds:**
    - 🟢 OK: < 500ms
    - 🟡 Slow: 500ms – 1500ms
    - 🔴 Error: > 1500ms or failed
- **Parser Drift Detection:** Monitors for missing HTML selectors.
- **HTML Snapshot:** On failure, captures the first 500 characters of the response.
- **Network Timeline:** Chronological log of all fetch attempts.
- **Session Stats:** Tracks total calls, cache hits/misses, and latency averages.
- **Auto-Refresh:** Configurable 30s polling interval.
- **Panic Banner:** Global warning if any service enters an Error state.

---

## 6. Data Flow Diagram

```text
+----------------+       +-------------------+       +----------------+
|                |       |                   |       |                |
| UI Components  |<----->| Service Layer     |<----->| External API   |
| (Hooks/Pages)  |       | (fetch + Parser)  |       | (PDGA/Infinite)|
|                |       +---------+---------+       +----------------+
+-------+--------+                 |
        ^                          |
        |                          v
+-------+--------+       +-------------------+
| Audit Dashboard|<------| In-Memory Cache   |
| (Observability)|       | (Map)             |
+----------------+       +-------------------+
```

---

## 7. External Dependencies

| Dependency | Type | Known Quirks |
| :--- | :--- | :--- |
| **PDGA.com** | HTML | Highly sensitive to markup changes; parser drift is common. |
| **Infinite Discs** | JSON | Generally stable, but requires proper headers. |

---

## 8. How to Add New Features

1.  **New Service:** Create `/src/services/[name].ts`. Implement `fetch` + `DOMParser` + `Map` cache.
2.  **New Hook:** Create `/src/hooks/use[Name].ts`. Use `useEffect` to call the service.
3.  **New UI Page:** Create `/src/components/[Name].tsx`. Mark as `'use client'`.
4.  **Audit Checks:** Update `LiveDataAudit.tsx` to include the new service in the `services` array.
5.  **Validation:** Ensure no backend, no persistence, and pure client-side logic.

---

## 9. Anti-Patterns (Forbidden Behaviors)

- **NEVER** create `/api/*` routes.
- **NEVER** use `fs`, `sqlite`, `pg`, or any database client.
- **NEVER** use `localStorage` or `IndexedDB` for core data.
- **NEVER** implement Node.js server logic (`server.js`, `express`).
- **NEVER** use SSR (`getServerSideProps`).
- **NEVER** store API keys in client code (use proxy if absolutely required).

---

## 10. Glossary

- **Pure Client-Side:** Architecture running entirely in the browser without server-side execution.
- **In-Memory Cache:** Data stored in a `Map` that is lost on page refresh.
- **Parser Drift:** When external HTML markup changes, breaking the `DOMParser` logic.
- **Schema Validation:** Ensuring fetched data matches the expected structure.
- **Panic Banner:** Global UI indicator for system-wide failures.

---

## 11. Final Summary

The Disc Mill is a **pure client-side, instrumented platform**. It achieves high performance and reliability by fetching data directly from external sources, caching it in-memory, and providing real-time observability via a dedicated Audit Dashboard. By strictly forbidding backend, persistence, and SSR, we ensure the platform remains lightweight, fast, and easy to maintain.


Architecture: Pure Client-Side / Instrumented Observability
THE DISC MILL — EXTERNAL URL INVENTORY
PDGA — NATIONAL COURSE DIRECTORY (HTML)
https://www.pdga.com/course-directory/all?page={page}
PDGA — COURSE DETAIL (HTML)
https://www.pdga.com/course-directory/course/{courseId}
PDGA — PLAYER PAGE (HTML)
https://www.pdga.com/player/{playerId}
PDGA — PLAYER DETAILS (HTML)
https://www.pdga.com/player/{playerId}/details
PDGA — EVENT PAGE (HTML)
https://www.pdga.com/tour/event/{eventId}
PDGA — EVENT ROUND PAGE (HTML)
https://www.pdga.com/tour/event/{eventId}/round/{roundNumber}
PDGA — SEARCH (HTML)
https://www.pdga.com/search?query={query}
INFINITE DISCS — DISC CATALOG (JSON)
https://infinitediscs.com/Products/Category?start=0&limit=1000
PROXY (REQUIRED FOR ALL EXTERNAL FETCHES)
https://api.allorigins.win/raw?url={ENCODED_URL}
