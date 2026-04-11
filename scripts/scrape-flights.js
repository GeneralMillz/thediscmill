/**
 * scrape-flights.js
 *
 * One-time authoritative scrape of Manufacturer Flight Numbers from
 * InfiniteDiscs.com for all discs in the local curated catalog.
 *
 * Source  : d:/thediscmill/data/discs.json
 * Output  : d:/thediscmill/data/discs_final.json
 *
 * Merge rules
 *   - Local description always wins (local ?? scraped)
 *   - Local flight numbers kept when non-zero
 *   - API flight numbers used only when local is all-zero
 *   - Discs that can't be scraped are kept untouched
 *   - Local-only discs (brands not in scrape list) pass through unchanged
 *
 * Node 18+. No external dependencies (uses native fetch).
 * Usage: node scripts/scrape-flights.js
 */

import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Paths ────────────────────────────────────────────────────────────────────

const __dir    = dirname(fileURLToPath(import.meta.url));
const SRC_FILE = resolve(__dir, "../data/discs.json");
const OUT_FILE = resolve(__dir, "../data/discs_final.json");
const BASE_URL = "https://infinitediscs.com";

// ─── Rate limiting ────────────────────────────────────────────────────────────

const DELAY_MS   = 500;  // 500ms between requests = max 2 req/s
const MAX_RETRY  = 3;
const RETRY_BASE = 500;  // ms; multiplied by attempt number for backoff

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Brand → Infinite Discs URL slug prefix(es) ───────────────────────────────
//
// Determined empirically — Infinite Discs shortens some brand names.
// Each entry is [primarySlug, ...fallbackSlugs].
// The script tries each in order and uses the first that returns flight data.

const BRAND_SLUGS = {
  "Innova":                  ["innova"],
  "Discraft":                ["discraft"],
  "Dynamic Discs":           ["dynamic-discs"],
  "Latitude 64":             ["latitude-64"],
  "Westside Discs":          ["westside",              "westside-discs"],
  "Axiom Discs":             ["axiom",                 "axiom-discs"],
  "MVP Disc Sports":         ["mvp",                   "mvp-disc-sports"],
  "Streamline Discs":        ["streamline",            "streamline-discs"],
  "Prodigy Disc":            ["prodigy",               "prodigy-disc"],
  "Discmania":               ["discmania"],
  "Gateway Disc Sports":     ["gateway",               "gateway-disc-sports"],
  "Kastaplast":              ["kastaplast"],
  "Thought Space Athletics": ["thought-space-athletics"],
  "Mint Discs":              ["mint-discs",            "mint"],
  "EV-7":                    ["ev-7"],
  "Clash Discs":             ["clash-discs",           "clash"],
  "Millennium Golf Discs":   ["millennium",            "millennium-golf-discs"],
  "RPM Discs":               ["rpm-discs",             "rpm"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a string to a URL-safe slug.
 * "Zone OS" → "zone-os", "PD2" → "pd2", "Grym X" → "grym-x"
 */
const toSlug = (s) =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/** True when all four flight numbers are zero (i.e. not yet populated). */
const hasNoFlightData = (disc) =>
  disc.speed === 0 &&
  disc.glide === 0 &&
  disc.turn  === 0 &&
  disc.fade  === 0;

function classifyCategory(speed) {
  if (speed <= 3) return "Putter";
  if (speed <= 5) return "Midrange";
  if (speed <= 8) return "Fairway Driver";
  return "Distance Driver";
}

function classifyStability(turn, fade) {
  const net = fade - turn;
  if (net >= 4) return "Very Overstable";
  if (net >= 2) return "Overstable";
  if (net >= 0) return "Stable";
  return "Understable";
}

// ─── Scraper ──────────────────────────────────────────────────────────────────

/**
 * Regex that matches the Manufacturer Flight Numbers block on an
 * Infinite Discs product page, e.g.:
 *   Manufacturer Flight Numbers ... <strong>10.0/6.0/0.0/3.0</strong>
 */
const FLIGHT_RE =
  /Manufacturer Flight Numbers[\s\S]{0,300}<strong>([\d.]+)\/([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)<\/strong>/;

/**
 * Fetch a single Infinite Discs product page and extract manufacturer flight
 * numbers. Returns { speed, glide, turn, fade } or null on miss.
 *
 * A final URL containing "/Page/" signals that Infinite Discs couldn't find
 * a product under that slug — treated as a miss.
 */
async function fetchFlightsFromSlug(slug, attempt = 1) {
  const url = `${BASE_URL}/${slug}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
          "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });

    // Infinite Discs redirects unresolvable slugs to /Page/<slug>, which is
    // itself a 302 — the final URL still contains "/Page/".
    if (!res.ok || res.url.includes("/Page/")) return null;

    const html = await res.text();
    const m    = html.match(FLIGHT_RE);
    if (!m) return null;

    return {
      speed: parseFloat(m[1]),
      glide: parseFloat(m[2]),
      turn:  parseFloat(m[3]),
      fade:  parseFloat(m[4]),
    };
  } catch (err) {
    if (attempt < MAX_RETRY) {
      const backoff = RETRY_BASE * attempt;
      console.warn(
        `    [retry ${attempt}/${MAX_RETRY}] ${slug} — ${err.message} (wait ${backoff}ms)`
      );
      await sleep(backoff);
      return fetchFlightsFromSlug(slug, attempt + 1);
    }
    console.warn(`    [give up] ${slug} — ${err.message}`);
    return null;
  }
}

/**
 * Try every slug variant for a brand/name combination in order.
 * Returns { speed, glide, turn, fade, resolvedSlug } or null.
 */
async function resolveFlights(brand, discName) {
  const prefixes = BRAND_SLUGS[brand];
  if (!prefixes) return null; // brand not in scrape list

  const nSlug = toSlug(discName);

  for (const prefix of prefixes) {
    const slug   = `${prefix}-${nSlug}`;
    const result = await fetchFlightsFromSlug(slug);

    if (result) return { ...result, resolvedSlug: slug };

    // Only sleep between slug attempts, not after the last one
    // (the outer loop handles inter-disc delays)
    if (prefixes.indexOf(prefix) < prefixes.length - 1) await sleep(DELAY_MS);
  }

  return null;
}

// ─── Merge ────────────────────────────────────────────────────────────────────

/**
 * Merge scraped flight data into a local disc record.
 * Returns a new object — the original is never mutated.
 */
function mergeDisc(local, scraped) {
  // Description: always prefer curated local copy
  const description = local.description ?? scraped?.description ?? undefined;

  // Flight numbers: only overwrite when local is all-zero
  const useScraped =
    scraped !== null && hasNoFlightData(local);

  const speed = useScraped ? scraped.speed : local.speed;
  const glide = useScraped ? scraped.glide : local.glide;
  const turn  = useScraped ? scraped.turn  : local.turn;
  const fade  = useScraped ? scraped.fade  : local.fade;

  const merged = {
    id:        local.id,
    brand:     local.brand,
    name:      local.name,
    speed,
    glide,
    turn,
    fade,
    category:  classifyCategory(speed),
    stability: classifyStability(turn, fade),
  };

  if (description) merged.description = description;
  return merged;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const raw = JSON.parse(await readFile(SRC_FILE, "utf-8"));
  console.log(`Loaded ${raw.length} discs from ${SRC_FILE}\n`);

  const results   = [];
  const misses    = [];
  let scraped     = 0;
  let alreadyOk   = 0;
  let localOnly   = 0;

  for (const disc of raw) {
    const inScrapeList = Boolean(BRAND_SLUGS[disc.brand]);

    // ── Disc not in any brand we scrape ──────────────────────────────────────
    if (!inScrapeList) {
      results.push(mergeDisc(disc, null));
      localOnly++;
      continue;
    }

    // ── Disc already has correct flight numbers ───────────────────────────────
    if (!hasNoFlightData(disc)) {
      results.push(mergeDisc(disc, null));
      alreadyOk++;
      continue;
    }

    // ── Needs scraping ────────────────────────────────────────────────────────
    process.stdout.write(
      `  ${disc.brand.padEnd(26)} ${disc.name.padEnd(30)} … `
    );

    const flights = await resolveFlights(disc.brand, disc.name);

    if (!flights) {
      console.log("MISS");
      misses.push(`${disc.brand} — ${disc.name}`);
      results.push(mergeDisc(disc, null)); // keep local values untouched
    } else {
      const after = `${flights.speed}/${flights.glide}/${flights.turn}/${flights.fade}`;
      console.log(`${after}  (via ${flights.resolvedSlug})`);
      results.push(mergeDisc(disc, flights));
      scraped++;
    }

    await sleep(DELAY_MS);
  }

  // ── Deduplicate by id (first occurrence wins) ─────────────────────────────
  const seen   = new Set();
  const unique = results.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });

  // ── Sort by brand → name ──────────────────────────────────────────────────
  unique.sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );

  // ── Write output ──────────────────────────────────────────────────────────
  await writeFile(OUT_FILE, JSON.stringify(unique, null, 2), "utf-8");

  // ── Summary ───────────────────────────────────────────────────────────────
  const withFlight = unique.filter((d) => !hasNoFlightData(d)).length;
  const withDesc   = unique.filter((d) => d.description).length;

  console.log(`
────────────────────────────────────────────────────
  Output                    : ${OUT_FILE}
────────────────────────────────────────────────────
  Total discs               : ${unique.length}
  Scraped successfully      : ${scraped}
  Already had flight data   : ${alreadyOk}
  Local-only (unlisted)     : ${localOnly}
  Missed (kept as-is)       : ${misses.length}
────────────────────────────────────────────────────
  With flight data          : ${withFlight}
  With descriptions         : ${withDesc}
────────────────────────────────────────────────────`);

  if (misses.length) {
    console.log("\nUnresolved — verify manually:");
    misses.forEach((m) => console.log("  ✗", m));
  }
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
