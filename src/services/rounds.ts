import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, any>();

export async function fetchRound(eventId: string, roundNumber: number) {
  const url = `https://www.pdga.com/tour/event/${eventId}/round/${roundNumber}`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('rounds', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(url);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Title
    const title =
      doc.querySelector('h1.page-title')?.textContent?.trim() ||
      doc.querySelector('h1')?.textContent?.trim() ||
      '';

    if (!title) {
      console.warn('Parser Drift: Round title not found for event', eventId, 'round', roundNumber);
      updateAudit('rounds', {
        parserDrift: true,
        lastHtmlSnapshot: html.slice(0, 500),
        lastProxyUsed: proxyUsed,
      });
    }

    // Score rows
    let rows = doc.querySelectorAll('.views-table tbody tr');
    if (rows.length === 0) rows = doc.querySelectorAll('table.sticky-enabled tbody tr');
    if (rows.length === 0) rows = doc.querySelectorAll('table tbody tr');

    const scores: any[] = [];
    rows.forEach(row => {
      const nameEl =
        row.querySelector('.views-field-title a') ||
        row.querySelector('.views-field-name a') ||
        row.querySelector('td:first-child');
      const scoreEl =
        row.querySelector('.views-field-score') ||
        row.querySelector('.views-field-total') ||
        row.querySelector('[class*="score"]');

      if (nameEl) {
        scores.push({
          name: nameEl.textContent?.trim() || '',
          score: scoreEl?.textContent?.trim() || '',
        });
      }
    });

    const roundData = { eventId, roundNumber, title, scores };
    cache.set(url, roundData);

    updateAudit('rounds', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
    });

    return roundData;
  } catch (error: any) {
    updateAudit('rounds', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return null;
  }
}
