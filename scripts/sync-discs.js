// sync-discs.js
// Merges curated local disc catalog with live DiscIt API data.
// Node 18+ (native fetch). No external dependencies.
// Usage: node scripts/sync-discs.js

import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Config ────────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dir, "../data/discs.json");
const API_BASE  = "https://discit-api.fly.dev/disc";

const BRANDS = [
  "Innova",
  "Discraft",
  "Dynamic Discs",
  "Latitude 64",
  "Westside Discs",
  "Axiom Discs",
  "MVP Disc Sports",
  "Streamline Discs",
  "Prodigy Disc",
  "Discmania",
  "Gateway Disc Sports",
  "Kastaplast",
  "Thought Space Athletics",
  "Mint Discs",
  "EV-7",
  "Clash Discs",
  "Millennium Golf Discs",
  "RPM Discs",
];

// ── Pure helpers ──────────────────────────────────────────────────────────────

const slugify = (s) =>
  String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const makeId = (brand, name) => `${slugify(brand)}-${slugify(name)}`;

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

const hasFlightData = (disc) =>
  disc.speed !== 0 || disc.glide !== 0 || disc.turn !== 0 || disc.fade !== 0;

// ── API layer ─────────────────────────────────────────────────────────────────

async function fetchBrand(brand, retries = 3) {
  const url = `${API_BASE}?brand=${encodeURIComponent(brand)}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        console.warn(`  [WARN] ${brand}: HTTP ${res.status}`);
        return [];
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (attempt === retries) {
        console.warn(`  [ERROR] ${brand}: ${err.message} (gave up after ${retries} attempts)`);
        return [];
      }
      console.warn(`  [RETRY ${attempt}/${retries}] ${brand}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1_000 * attempt));
    }
  }

  return [];
}

function normalizeApiDisc(apiDisc, brand) {
  const name  = String(apiDisc.name ?? "").trim();
  const speed = parseFloat(apiDisc.speed) || 0;
  const glide = parseFloat(apiDisc.glide) || 0;
  const turn  = parseFloat(apiDisc.turn)  || 0;
  const fade  = parseFloat(apiDisc.fade)  || 0;

  return {
    id:          makeId(brand, name),
    brand,
    name,
    speed,
    glide,
    turn,
    fade,
    category:    classifyCategory(speed),
    stability:   classifyStability(turn, fade),
    description: apiDisc.notes ?? apiDisc.description ?? null,
  };
}

// ── Merge logic ───────────────────────────────────────────────────────────────

function merge(local, api) {
  // Description: curated always wins
  const description = local.description ?? api.description ?? undefined;

  // Flight numbers: API wins unless local already has non-zero values
  const useApiFlights = !hasFlightData(local);
  const speed = useApiFlights ? api.speed : local.speed;
  const glide = useApiFlights ? api.glide : local.glide;
  const turn  = useApiFlights ? api.turn  : local.turn;
  const fade  = useApiFlights ? api.fade  : local.fade;

  const result = {
    id:        api.id,   // canonical id from API brand name
    brand:     api.brand,
    name:      api.name,
    speed,
    glide,
    turn,
    fade,
    category:  classifyCategory(speed),
    stability: classifyStability(turn, fade),
  };

  if (description) result.description = description;
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Load local catalogue
  const localDiscs = JSON.parse(await readFile(DATA_FILE, "utf-8"));
  console.log(`Loaded ${localDiscs.length} local discs from ${DATA_FILE}`);

  // Index local discs for O(1) lookup
  const byId   = new Map(localDiscs.map((d) => [d.id,            d]));
  const byName = new Map(localDiscs.map((d) => [slugify(d.name), d]));

  // 2. Fetch and merge API data
  const result  = new Map(); // id → final disc
  const matched = new Set(); // local disc ids that were matched to an API disc

  for (const brand of BRANDS) {
    process.stdout.write(`Fetching ${brand.padEnd(26)} … `);
    const raw = await fetchBrand(brand);

    if (!raw.length) {
      console.log("0 discs");
      continue;
    }

    let added   = 0;
    let updated = 0;

    for (const apiRaw of raw) {
      const api = normalizeApiDisc(apiRaw, brand);
      if (!api.name) continue;
      if (result.has(api.id)) continue; // deduplicate within brand pass

      // Match strategy: id first, then name-only
      const localMatch = byId.get(api.id) ?? byName.get(slugify(api.name));

      if (localMatch) {
        result.set(api.id, merge(localMatch, api));
        matched.add(localMatch.id);
        updated++;
      } else {
        const disc = {
          id:        api.id,
          brand:     api.brand,
          name:      api.name,
          speed:     api.speed,
          glide:     api.glide,
          turn:      api.turn,
          fade:      api.fade,
          category:  api.category,
          stability: api.stability,
        };
        if (api.description) disc.description = api.description;
        result.set(api.id, disc);
        added++;
      }
    }

    console.log(`${raw.length} fetched — ${updated} merged, ${added} new`);
  }

  // 3. Carry forward local-only discs (not matched to any API disc)
  let preserved = 0;

  for (const disc of localDiscs) {
    if (matched.has(disc.id) || result.has(disc.id)) continue;

    const speed = disc.speed ?? 0;
    const glide = disc.glide ?? 0;
    const turn  = disc.turn  ?? 0;
    const fade  = disc.fade  ?? 0;
    const flightKnown = speed !== 0 || glide !== 0 || turn !== 0 || fade !== 0;

    const kept = {
      id:        disc.id ?? makeId(disc.brand ?? "", disc.name ?? ""),
      brand:     disc.brand ?? "",
      name:      disc.name  ?? "",
      speed,
      glide,
      turn,
      fade,
      category:  flightKnown ? classifyCategory(speed)            : (disc.category  ?? "Unknown"),
      stability: flightKnown ? classifyStability(turn, fade)      : (disc.stability ?? "Unknown"),
    };

    if (disc.description) kept.description = disc.description;
    result.set(kept.id, kept);
    preserved++;
  }

  // 4. Sort by brand → name and write
  const sorted = [...result.values()].sort(
    (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name)
  );

  await writeFile(DATA_FILE, JSON.stringify(sorted, null, 2), "utf-8");

  // 5. Summary
  const withFlight = sorted.filter(hasFlightData).length;
  const withDesc   = sorted.filter((d) => d.description).length;

  console.log(`
─────────────────────────────────────────
  Output : ${DATA_FILE}
  Total  : ${sorted.length} discs
  Merged : ${matched.size} (local + API)
  New    : ${result.size - matched.size - preserved} (API-only)
  Kept   : ${preserved} (local-only)
─────────────────────────────────────────
  With flight data  : ${withFlight}
  With descriptions : ${withDesc}
─────────────────────────────────────────`);
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
