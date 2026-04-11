// generate-sitemap.js
// Generates public/sitemap.xml from the authoritative disc catalog.
// Run after any catalog update: node scripts/generate-sitemap.js
// Node 18+. No dependencies.

import { readFile, writeFile, stat } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir    = dirname(fileURLToPath(import.meta.url));
const CATALOG  = resolve(__dir, "../public/data/discs_fallback.json");
const OUT      = resolve(__dir, "../public/sitemap.xml");
const BASE     = "https://thediscmill.com";

// ── Static pages ──────────────────────────────────────────────────────────────

const STATIC = [
  { path: "/",              priority: "1.0", changefreq: "daily"   },
  { path: "/discs",         priority: "0.8", changefreq: "yearly"  },
  { path: "/courses",       priority: "0.8", changefreq: "yearly"  },
  { path: "/players",       priority: "0.8", changefreq: "yearly"  },
  { path: "/events",        priority: "0.8", changefreq: "yearly"  },
  { path: "/manufacturers", priority: "0.7", changefreq: "yearly"  },
  { path: "/guides",        priority: "0.7", changefreq: "yearly"  },
  { path: "/gear",          priority: "0.7", changefreq: "yearly"  },
  { path: "/disc-finder",   priority: "0.5", changefreq: "yearly"  },
  { path: "/bag-builder",   priority: "0.5", changefreq: "yearly"  },
  { path: "/analyzer",      priority: "0.5", changefreq: "yearly"  },
  { path: "/blog",          priority: "0.5", changefreq: "yearly"  },
  { path: "/disc-return",   priority: "0.5", changefreq: "yearly"  },
  { path: "/course-finder", priority: "0.5", changefreq: "yearly"  },
];

// ── Category filter pages ─────────────────────────────────────────────────────

const CATEGORIES = [
  "Putter",
  "Midrange",
  "Fairway Driver",
  "Distance Driver",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const brandSlug = (brand) =>
  brand.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function urlBlock({ loc, lastmod, changefreq, priority }) {
  const lines = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod)   lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority)  lines.push(`    <priority>${priority}</priority>`);
  lines.push(`  </url>`);
  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // File mtime as lastmod (YYYY-MM-DD)
  const fileStat = await stat(CATALOG);
  const lastmod  = fileStat.mtime.toISOString().split("T")[0];

  const discs = JSON.parse(await readFile(CATALOG, "utf-8"));

  // Derive unique brands in sorted order
  const brands = [...new Set(discs.map((d) => d.brand))].sort();

  const blocks = [];

  // 1. Static pages (no lastmod — content doesn't change by catalog date)
  for (const page of STATIC) {
    blocks.push(urlBlock({
      loc:        `${BASE}${page.path}`,
      changefreq: page.changefreq,
      priority:   page.priority,
    }));
  }

  // 2. Category pages
  for (const cat of CATEGORIES) {
    blocks.push(urlBlock({
      loc:        `${BASE}/discs?category=${encodeURIComponent(cat)}`,
      lastmod,
      changefreq: "monthly",
      priority:   "0.8",
    }));
  }

  // 3. Brand / manufacturer pages
  for (const brand of brands) {
    blocks.push(urlBlock({
      loc:        `${BASE}/manufacturer/${brandSlug(brand)}`,
      lastmod,
      changefreq: "monthly",
      priority:   "0.7",
    }));
  }

  // 4. Disc detail pages
  for (const disc of discs) {
    blocks.push(urlBlock({
      loc:        `${BASE}/disc/${disc.id}`,
      lastmod,
      changefreq: "monthly",
      priority:   "0.6",
    }));
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...blocks,
    `</urlset>`,
  ].join("\n");

  await writeFile(OUT, xml, "utf-8");

  // ── Summary ─────────────────────────────────────────────────────────────────
  const total = STATIC.length + CATEGORIES.length + brands.length + discs.length;

  console.log(`
────────────────────────────────────────────
  Output   : ${OUT}
────────────────────────────────────────────
  Static   : ${STATIC.length}
  Category : ${CATEGORIES.length}
  Brand    : ${brands.length}
  Disc     : ${discs.length}
  ─────────────────────────────────────────
  Total    : ${total} URLs
────────────────────────────────────────────`);

  // First 20 URLs preview
  console.log("\nFirst 20 URLs:");
  const allLocs = [
    ...STATIC.map((p) => `${BASE}${p.path}`),
    ...CATEGORIES.map((c) => `${BASE}/discs?category=${encodeURIComponent(c)}`),
    ...brands.map((b) => `${BASE}/manufacturer/${brandSlug(b)}`),
    ...discs.map((d) => `${BASE}/disc/${d.id}`),
  ];
  allLocs.slice(0, 20).forEach((u, i) => console.log(`  ${String(i + 1).padStart(2)}. ${u}`));
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
