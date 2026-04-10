/**
 * discCatalog.ts
 *
 * Two-phase disc data pipeline:
 *   Phase 1 — Scrape the PDGA Approved Disc list for authoritative mold names + manufacturers.
 *   Phase 2 — Enrich individual discs on-demand with flight numbers from Infinite Discs search API.
 *
 * Neither phase blocks the initial render. The catalog builds progressively.
 */

import { Disc } from '../types';
import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

// ─── In-memory stores ────────────────────────────────────────────────────────

const catalogCache = new Map<string, Disc[]>();       // keyed by page URL
const enrichmentCache = new Map<string, Partial<Disc>>(); // keyed by "brand:name"
let assembledCatalog: Disc[] | null = null;

const PDGA_APPROVED_URL = 'https://www.pdga.com/technical-standards/equipment-certification/discs';
const INFINITE_SEARCH_URL = 'https://infinitediscs.com/api/search?search=';

// ─── PDGA Parser ─────────────────────────────────────────────────────────────

function parsePDGAApprovedDiscs(doc: Document, html: string, url: string): Disc[] {
  // Identify the data table — PDGA uses Drupal Views
  const table =
    doc.querySelector('table.views-table') ||
    doc.querySelector('table.sticky-enabled') ||
    doc.querySelector('.view-disc-certification table') ||
    doc.querySelector('.view-equipment-certification table') ||
    doc.querySelector('table');

  if (!table) {
    console.warn('Parser Drift: PDGA approved disc table not found at', url);
    updateAudit('discCatalog', {
      parserDrift: true,
      lastHtmlSnapshot: html.slice(0, 500),
    });
    return [];
  }

  // Read headers to identify column indices (more resilient than fixed positions)
  const headers = Array.from(table.querySelectorAll('thead th, thead td')).map(
    th => th.textContent?.trim().toLowerCase() || ''
  );

  const mfgIdx = headers.findIndex(h => h.includes('manufactur') || h.includes('brand'));
  const moldIdx = headers.findIndex(h => h.includes('model') || h.includes('mold') || h.includes('name'));

  const rows = table.querySelectorAll('tbody tr');
  if (rows.length === 0) {
    console.warn('Parser Drift: PDGA approved disc table has no rows at', url);
    updateAudit('discCatalog', {
      parserDrift: true,
      lastHtmlSnapshot: html.slice(0, 500),
    });
    return [];
  }

  const discs: Disc[] = [];
  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length < 2) return;

    // Use detected indices or positional fallback
    const brand = cells[mfgIdx >= 0 ? mfgIdx : 0]?.textContent?.trim() || '';
    const name = cells[moldIdx >= 0 ? moldIdx : 1]?.textContent?.trim() || '';

    if (!brand || !name) return;

    const id = `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    discs.push({
      id,
      brand,
      name,
      speed: 0,
      glide: 0,
      turn: 0,
      fade: 0,
      category: '',
      stability: '',
    });
  });

  return discs;
}

// ─── Fetch PDGA catalog (multi-page) ─────────────────────────────────────────

export async function fetchPDGACatalog(): Promise<Disc[]> {
  if (assembledCatalog) return assembledCatalog;

  const allDiscs: Disc[] = [];
  const startTime = Date.now();
  const seen = new Set<string>();

  try {
    for (let page = 0; page < 10; page++) {
      const url = page === 0
        ? PDGA_APPROVED_URL
        : `${PDGA_APPROVED_URL}?page=${page}`;

      if (catalogCache.has(url)) {
        catalogCache.get(url)!.forEach(d => {
          if (!seen.has(d.id)) { seen.add(d.id); allDiscs.push(d); }
        });
        continue;
      }

      const { response, proxyUsed } = await fetchWithProxy(url);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pageDiscs = parsePDGAApprovedDiscs(doc, html, url);

      if (pageDiscs.length === 0) {
        updateAudit('discCatalog', { lastProxyUsed: proxyUsed });
        break; // last page or drift
      }

      catalogCache.set(url, pageDiscs);
      pageDiscs.forEach(d => {
        if (!seen.has(d.id)) { seen.add(d.id); allDiscs.push(d); }
      });

      updateAudit('discCatalog', { lastProxyUsed: proxyUsed });
    }

    assembledCatalog = allDiscs;
    updateAudit('discCatalog', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      dataSource: 'live',
      itemCount: allDiscs.length,
    });

    return allDiscs;
  } catch (error: any) {
    updateAudit('discCatalog', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return allDiscs;
  }
}

// ─── Enrich a single disc with flight numbers from Infinite Discs ─────────────

export async function enrichDiscWithFlightNumbers(
  brand: string,
  name: string
): Promise<Partial<Disc>> {
  const key = `${brand}:${name}`.toLowerCase();
  if (enrichmentCache.has(key)) return enrichmentCache.get(key)!;

  const query = encodeURIComponent(`${brand} ${name}`);
  const url = `${INFINITE_SEARCH_URL}${query}`;
  const startTime = Date.now();

  try {
    const { response, proxyUsed } = await fetchWithProxy(url, 6000);
    const data = await response.json();

    const results: any[] = Array.isArray(data)
      ? data
      : data?.products || data?.results || data?.items || [];

    if (results.length === 0) {
      updateAudit('discEnrichment', {
        parserDrift: true,
        lastHtmlSnapshot: JSON.stringify(data).slice(0, 500),
        lastProxyUsed: proxyUsed,
        latency: Date.now() - startTime,
      });
      enrichmentCache.set(key, {});
      return {};
    }

    // Find best match by name similarity
    const match = results.find((r: any) => {
      const rName = (r.Name || r.name || '').toLowerCase();
      return rName.includes(name.toLowerCase()) || name.toLowerCase().includes(rName);
    }) || results[0];

    const enriched: Partial<Disc> = {
      speed: Number(match.Speed ?? match.speed ?? 0),
      glide: Number(match.Glide ?? match.glide ?? 0),
      turn: Number(match.Turn ?? match.turn ?? 0),
      fade: Number(match.Fade ?? match.fade ?? 0),
      category: match.Category || match.category || '',
      stability: match.Stability || match.stability || '',
      image: match.Image || match.image || match.ImageUrl || '',
      description: match.Description || match.description || '',
    };

    enrichmentCache.set(key, enriched);
    updateAudit('discEnrichment', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
    });

    return enriched;
  } catch (error: any) {
    updateAudit('discEnrichment', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    enrichmentCache.set(key, {});
    return {};
  }
}

// ─── Public helper: get catalog + optionally enrich a subset ─────────────────

export async function getCatalogWithFlightNumbers(
  limit = 50
): Promise<Disc[]> {
  const catalog = await fetchPDGACatalog();
  if (catalog.length === 0) return catalog;

  // Only enrich the first `limit` discs to avoid flooding the API
  const toEnrich = catalog.slice(0, limit);
  await Promise.allSettled(
    toEnrich.map(async disc => {
      const enriched = await enrichDiscWithFlightNumbers(disc.brand, disc.name);
      Object.assign(disc, enriched);
    })
  );

  return catalog;
}
