// patch-flights.js
// Patches speed/glide/turn/fade in public/data/discs_fallback.json
// using live DiscIt API data. Everything else (descriptions, ids, etc.) is untouched.
// Node 18+. Usage: node scripts/patch-flights.js

import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir   = dirname(fileURLToPath(import.meta.url));
const FILE    = resolve(__dir, "../public/data/discs_fallback.json");
const API_BASE = "https://discit-api.fly.dev/disc";

const slugify = (s) =>
  String(s ?? "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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

async function fetchBrand(brand) {
  const url = `${API_BASE}?brand=${encodeURIComponent(brand)}`;
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
}

async function main() {
  const discs = JSON.parse(await readFile(FILE, "utf-8"));
  console.log(`Loaded ${discs.length} discs from ${FILE}\n`);

  // Group local discs by brand so we only fetch each brand once
  const byBrand = new Map();
  for (const disc of discs) {
    if (!byBrand.has(disc.brand)) byBrand.set(disc.brand, []);
    byBrand.get(disc.brand).push(disc);
  }

  let patched = 0;
  let missed  = 0;

  for (const [brand, localDiscs] of byBrand) {
    process.stdout.write(`Fetching ${brand.padEnd(26)} … `);

    const apiDiscs = await fetchBrand(brand);
    if (!apiDiscs.length) {
      console.log(`0 results — skipping`);
      missed += localDiscs.length;
      continue;
    }

    // Index API discs by name slug for fast lookup
    const apiByName = new Map(
      apiDiscs.map((d) => [slugify(d.name), d])
    );

    let brandPatched = 0;
    for (const disc of localDiscs) {
      const api = apiByName.get(slugify(disc.name));
      if (!api) {
        console.warn(`\n  [MISS] "${disc.name}" not found in API`);
        missed++;
        continue;
      }

      const before = `${disc.speed}/${disc.glide}/${disc.turn}/${disc.fade}`;

      disc.speed    = parseFloat(api.speed) || disc.speed;
      disc.glide    = parseFloat(api.glide) || disc.glide;
      disc.turn     = parseFloat(api.turn)  || disc.turn;
      disc.fade     = parseFloat(api.fade)  || disc.fade;
      disc.category  = classifyCategory(disc.speed);
      disc.stability = classifyStability(disc.turn, disc.fade);

      const after = `${disc.speed}/${disc.glide}/${disc.turn}/${disc.fade}`;
      if (before !== after) {
        console.log(`\n  ✔ ${disc.name.padEnd(24)} ${before.padEnd(14)} → ${after}`);
        brandPatched++;
        patched++;
      }
    }

    if (!brandPatched) console.log(`all matched, no changes needed`);
    else process.stdout.write(`  ${brandPatched} updated\n`);
  }

  discs.sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));

  await writeFile(FILE, JSON.stringify(discs, null, 2), "utf-8");

  console.log(`
─────────────────────────────────────────
  Patched  : ${patched} discs had flight numbers updated
  Unmatched: ${missed} discs not found in API
  Output   : ${FILE}
─────────────────────────────────────────`);
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
