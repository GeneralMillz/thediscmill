#!/usr/bin/env node
/**
 * generate-courses-fallback.js
 *
 * Build-time Node script that scrapes the PDGA course directory via the
 * allorigins CORS proxy and writes a comprehensive fallback JSON to
 * public/data/courses_fallback.json.
 *
 * Requirements: Node 18+ (built-in fetch). No extra dependencies needed.
 *
 * Usage:
 *   node scripts/generate-courses-fallback.js
 *
 * Or add to package.json scripts:
 *   "generate:courses": "node scripts/generate-courses-fallback.js"
 */

import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'public', 'data', 'courses_fallback.json');

const PROXY = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
const BASE_URL = 'https://www.pdga.com/course-directory/all';
const MAX_PAGES = 50;
const TIMEOUT_MS = 30000;

// ── HTML parser (regex-based, no deps) ────────────────────────────────────────

/**
 * Extract text content from the first matching tag pattern.
 * @param {string} html
 * @param {string} className - CSS class to look for (partial match)
 */
function extractField(html, className) {
  const re = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/td>`, 'i');
  const m = html.match(re);
  if (!m) return '';
  // Strip inner tags
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractLinkText(html, className) {
  const re = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>[\\s\\S]*?<a[^>]*href="([^"]*)"[^>]*>([^<]*)<`, 'i');
  const m = html.match(re);
  return m ? { href: m[1], text: m[2].trim() } : null;
}

/**
 * Parse a PDGA course directory HTML page into Course objects.
 * @param {string} html
 * @returns {Array}
 */
function parseCourses(html) {
  const courses = [];

  // Split by table rows
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRe.exec(html)) !== null) {
    const row = rowMatch[1];

    // Must have a title link to be a course row
    const titleMatch = row.match(/views-field-title[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([^<]+)</i);
    if (!titleMatch) continue;

    const href = titleMatch[1] || '';
    const name = titleMatch[2].trim();
    if (!name || name.length < 2) continue;

    // Extract ID from href (last path segment)
    const id = href.split('/').filter(Boolean).pop() || '';

    // Location / city
    const locationMatch = row.match(/views-field-(?:address|field-address|field-course-city)[^>]*>[\s\S]*?<[^>]+>([^<]*)</i);
    const location = locationMatch ? locationMatch[1].replace(/\s+/g, ' ').trim() : '';

    // Holes
    const holesMatch = row.match(/views-field-(?:field-course-holes|holes)[^>]*>[\s\S]*?<[^>]*>([^<]*)</i);
    const holes = parseInt(holesMatch?.[1]?.trim() || '18', 10) || 18;

    // State
    const stateMatch = row.match(/views-field-field-course-state[^>]*>[\s\S]*?<[^>]*>([^<]{2,30})</i);
    let state = stateMatch ? stateMatch[1].replace(/\s+/g, ' ').trim() : '';

    // Derive city/state from location if state missing
    const parts = location.split(',');
    const city = parts[0]?.trim() || '';
    if (!state && parts.length >= 2) {
      state = parts[parts.length - 1].trim().split(' ').shift() || '';
    }

    // Normalize state to 2-letter abbreviation (PDGA sometimes gives full name)
    if (state.length > 2) {
      state = STATE_ABBREV[state] || state.slice(0, 2).toUpperCase();
    }

    if (name && id) {
      courses.push({
        id,
        name,
        location,
        city,
        state: state.toUpperCase(),
        holes,
        rating: 0,
        difficulty: 'Intermediate',
        coordinates: null,
        tags: [],
        description: '',
      });
    }
  }

  return courses;
}

// State name → abbreviation lookup for normalization
const STATE_ABBREV = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
};

// ── Fetch helpers ──────────────────────────────────────────────────────────────

async function fetchPage(page) {
  const url = `${BASE_URL}?page=${page}`;
  const proxied = PROXY(url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(proxied, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TheDiscMill/1.0)' },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Generating courses fallback JSON...');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Max pages: ${MAX_PAGES}, Timeout per page: ${TIMEOUT_MS}ms\n`);

  const allCourses = [];
  let consecutiveEmpty = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    process.stdout.write(`  Page ${page}... `);
    try {
      const html = await fetchPage(page);
      const courses = parseCourses(html);

      if (courses.length === 0) {
        consecutiveEmpty++;
        console.log(`empty (${consecutiveEmpty} consecutive)`);
        if (consecutiveEmpty >= 2) {
          console.log('  Stopping: 2 consecutive empty pages.');
          break;
        }
        continue;
      }

      consecutiveEmpty = 0;
      allCourses.push(...courses);
      console.log(`${courses.length} courses (total: ${allCourses.length})`);

      // Small delay to be respectful to the proxy
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      consecutiveEmpty++;
      if (consecutiveEmpty >= 3) {
        console.log('  Stopping: 3 consecutive failures.');
        break;
      }
    }
  }

  if (allCourses.length === 0) {
    console.error('\nNo courses fetched. Check proxy availability and PDGA HTML structure.');
    process.exit(1);
  }

  // Deduplicate by id
  const seen = new Set();
  const unique = allCourses.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  // State summary
  const byState = {};
  unique.forEach(c => { byState[c.state] = (byState[c.state] || 0) + 1; });
  console.log('\nCourses per state:');
  Object.entries(byState).sort(([a], [b]) => a.localeCompare(b)).forEach(([s, n]) => {
    console.log(`  ${s}: ${n}`);
  });

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(unique, null, 2), 'utf8');
  console.log(`\nWrote ${unique.length} courses to ${OUTPUT_PATH}`);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
