import { Player } from '../types';
import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, any>();

function parsePlayerFromDoc(doc: Document, html: string, playerId: string, proxyUsed: string): Player | null {
  const name =
    doc.querySelector('h1.page-title')?.textContent?.trim() ||
    doc.querySelector('h1')?.textContent?.trim() ||
    doc.querySelector('.pane-page-title h2')?.textContent?.trim() ||
    '';

  if (!name) {
    console.warn('Parser Drift: Player name not found for', playerId);
    updateAudit('players', {
      parserDrift: true,
      lastHtmlSnapshot: html.slice(0, 500),
      lastProxyUsed: proxyUsed,
    });
    return null;
  }

  // Rating — try multiple patterns
  const ratingText =
    doc.querySelector('.current-rating')?.textContent ||
    doc.querySelector('.pdga-number-rating .rating')?.textContent ||
    doc.querySelector('.player-info .field-name-player-rating')?.textContent ||
    doc.querySelector('[class*="rating"]')?.textContent ||
    '0';
  const rating = parseInt(ratingText.replace(/\D/g, '') || '0', 10);

  // Location
  const locationEl =
    doc.querySelector('.field-name-field-location') ||
    doc.querySelector('.field--name-field-location') ||
    doc.querySelector('[class*="location"]');
  const location = locationEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

  // Classification (Amateur / Professional)
  const classEl =
    doc.querySelector('.field-name-field-classification') ||
    doc.querySelector('.field--name-field-classification') ||
    doc.querySelector('[class*="classification"]');
  const classification = classEl?.textContent?.trim() || '';

  // Member Since
  const memberEl =
    doc.querySelector('.field-name-field-member-since') ||
    doc.querySelector('.field--name-field-member-since') ||
    doc.querySelector('[class*="member-since"]');
  const memberSince = memberEl?.textContent?.trim() || '';

  return {
    id: playerId,
    name,
    pdgaNumber: playerId,
    rating: isNaN(rating) ? 0 : rating,
    location,
    classification,
    memberSince,
    careerWins: 0,
    careerEarnings: 0,
  };
}

export async function fetchPlayer(playerId: string): Promise<Player | null> {
  const url = `https://www.pdga.com/player/${playerId}`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('players', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(url);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const player = parsePlayerFromDoc(doc, html, playerId, proxyUsed);

    if (player) {
      cache.set(url, player);
      updateAudit('players', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - startTime,
        cacheHit: false,
        lastError: null,
        lastProxyUsed: proxyUsed,
      });
    }

    return player;
  } catch (error: any) {
    updateAudit('players', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return null;
  }
}

export async function fetchPlayerDetails(playerId: string): Promise<Player | null> {
  const url = `https://www.pdga.com/player/${playerId}/details`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('playerDetails', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(url);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const player = parsePlayerFromDoc(doc, html, playerId, proxyUsed);

    if (player) {
      cache.set(url, player);
      updateAudit('playerDetails', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - startTime,
        cacheHit: false,
        lastError: null,
        lastProxyUsed: proxyUsed,
      });
    }

    return player;
  } catch (error: any) {
    updateAudit('playerDetails', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return null;
  }
}

/**
 * Search PDGA players by name or PDGA number.
 *
 * Strategy (two-stage, per architecture contract):
 *
 * 1. Digit-only query  → fetchPlayer(id) directly (fastest, no scraping needed)
 *
 * 2. Name query — Stage A: https://www.pdga.com/search?query={q}
 *    Per docs/ARCHITECTURE.md this is the canonical PDGA search endpoint.
 *    Parse every <a href="/player/{id}"> in the response — completely
 *    selector-independent and drift-resistant.
 *
 * 3. Name query — Stage B (fallback): /players?FirstName=FIRST&LastName=LAST
 *    Split the query on whitespace so "Paul McBeth" → FirstName=Paul&LastName=McBeth.
 *    This is the fix for the original bug where the full name was placed in
 *    FirstName only, returning zero results.
 *    Parse using Drupal Views selectors with multiple fallbacks.
 */
export async function searchPlayers(query: string, page = 0): Promise<Player[]> {
  const startTime = Date.now();
  const trimmed = query.trim();
  if (!trimmed) return [];

  // ── Fast path: PDGA number → direct profile fetch (not paginated) ───────────
  if (/^\d+$/.test(trimmed)) {
    const player = await fetchPlayer(trimmed);
    if (player) {
      updateAudit('playerSearch', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - startTime,
        cacheHit: false,
        lastError: null,
        dataSource: 'live',
        itemCount: 1,
      });
    }
    return player ? [player] : [];
  }

  // Cache key is per-page so each page is independently cached
  const cacheKey = `search:${trimmed.toLowerCase()}:${page}`;
  if (cache.has(cacheKey)) {
    updateAudit('playerSearch', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(cacheKey);
  }

  // ── Stage A: PDGA general search endpoint (architecture doc primary) ────────
  const searchUrl = `https://www.pdga.com/search?query=${encodeURIComponent(trimmed)}&page=${page}`;
  let players: Player[] = [];

  try {
    const { response: r1, proxyUsed: p1 } = await fetchWithProxy(searchUrl);
    const html1 = await r1.text();
    const doc1 = new DOMParser().parseFromString(html1, 'text/html');

    // Scan every anchor for the /player/{id} href pattern.
    // This is intentionally selector-free — it works regardless of Drupal
    // template changes, CAPTCHA pages, or markup drift.
    const seen = new Set<string>();
    doc1.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      const m = href.match(/\/player\/(\d+)/);
      if (!m) return;
      const id = m[1];
      if (seen.has(id)) return;
      seen.add(id);
      const name = a.textContent?.trim() || '';
      // Ignore very short strings (nav links, "Back", single letters, etc.)
      if (name.length < 3) return;
      players.push({
        id,
        name,
        pdgaNumber: id,
        rating: 0,
        location: '',
        classification: '',
        memberSince: '',
        careerWins: 0,
        careerEarnings: 0,
      });
    });

    if (players.length > 0) {
      cache.set(cacheKey, players);
      updateAudit('playerSearch', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - startTime,
        cacheHit: false,
        lastError: null,
        lastProxyUsed: p1,
        dataSource: 'live',
        itemCount: players.length,
      });
      return players;
    }

    // Stage A returned HTML but no player links → log as drift and try Stage B
    console.warn('Parser Drift: /search?query= returned no player links for', trimmed);
    updateAudit('playerSearch', {
      parserDrift: true,
      lastHtmlSnapshot: html1.slice(0, 500),
      lastProxyUsed: p1,
    });
  } catch (e1: any) {
    updateAudit('playerSearch', {
      lastError: `search: ${e1.message}`,
      latency: Date.now() - startTime,
    });
  }

  // ── Stage B: legacy /players form, name properly split ──────────────────────
  // Splitting "Paul McBeth" → FirstName=Paul, LastName=McBeth fixes the
  // original root cause where the entire string was placed in FirstName only.
  const parts = trimmed.split(/\s+/);
  const firstName = encodeURIComponent(parts[0] || '');
  const lastName  = encodeURIComponent(parts.slice(1).join(' ') || '');
  const legacyUrl = `https://www.pdga.com/players?FirstName=${firstName}&LastName=${lastName}&PDGANum=&State=All&Country=All&Class=All&Tier=All&op=Search&page=${page}`;

  try {
    const { response: r2, proxyUsed: p2 } = await fetchWithProxy(legacyUrl);
    const html2 = await r2.text();
    const doc2 = new DOMParser().parseFromString(html2, 'text/html');

    let rows = doc2.querySelectorAll('.views-table tbody tr');
    if (rows.length === 0) rows = doc2.querySelectorAll('table tbody tr');

    if (rows.length === 0) {
      console.warn('Parser Drift: /players form returned no rows for', trimmed);
      updateAudit('playerSearch', {
        parserDrift: true,
        lastHtmlSnapshot: html2.slice(0, 500),
        lastProxyUsed: p2,
        latency: Date.now() - startTime,
      });
      return [];
    }

    rows.forEach(row => {
      const nameEl =
        row.querySelector('.views-field-first-name a') ||
        row.querySelector('.views-field-title a') ||
        row.querySelector('td a');
      if (!nameEl) return;

      const href = nameEl.getAttribute('href') || '';
      const m = href.match(/\/player\/(\d+)/);
      const id = m?.[1] || '';
      const name = nameEl.textContent?.trim() || '';
      if (!name) return;

      const pdgaEl =
        row.querySelector('.views-field-pdga-number') ||
        row.querySelector('.views-field-field-pdga-number');
      const pdgaNumber = pdgaEl?.textContent?.trim().replace(/\D/g, '') || id;

      const ratingEl = row.querySelector('.views-field-player-rating');
      const rating = parseInt(ratingEl?.textContent?.replace(/\D/g, '') || '0', 10);

      players.push({
        id,
        name,
        pdgaNumber,
        rating: isNaN(rating) ? 0 : rating,
        location: '',
        classification: '',
        memberSince: '',
        careerWins: 0,
        careerEarnings: 0,
      });
    });

    if (players.length > 0) {
      cache.set(cacheKey, players);
    }

    updateAudit('playerSearch', {
      lastSuccessfulFetch: players.length > 0 ? Date.now() : null,
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: players.length === 0 ? 'No results from either endpoint' : null,
      lastProxyUsed: p2,
      dataSource: 'live',
      itemCount: players.length,
    });

    return players;
  } catch (e2: any) {
    updateAudit('playerSearch', {
      lastError: `legacy players: ${e2.message}`,
      latency: Date.now() - startTime,
    });
    return [];
  }
}
